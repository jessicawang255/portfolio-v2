"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

const navLinks: { label: string; href: string; target?: string }[] = [
  { label: "Work",   href: "/" },
  { label: "About",  href: "/about" },
  { label: "Resume", href: "/JessicaWang_Resume.pdf", target: "_blank" },
]

const socialLinks = [
  { label: "Email",    href: "mailto:jessica.wang255@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/jwang255" },
  { label: "X",        href: "https://x.com/jossici" },
  { label: "GitHub",   href: "https://github.com/jessicawang255" },
]

const FOOTER_LINK_CLASS = "text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-150"

// Popover reveal — same on-screen-settle curve as TableOfContents' subsection reveal.
const PANEL_EASE: [number, number, number, number] = [0.33, 1, 0.68, 1]
const PANEL_WIDTH = 256 // matches w-64
const PANEL_VIEWPORT_MARGIN = 16

function TimeIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3.5 w-3.5 shrink-0 bg-current"
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  )
}

function getTimeIcon(hour: number) {
  if (hour >= 5  && hour < 8)  return <TimeIcon src="/icons/sun-foggy-fill.svg" /> // dawn
  if (hour >= 8  && hour < 18) return <TimeIcon src="/icons/sun-fill.svg" />       // day
  if (hour >= 18 && hour < 21) return <TimeIcon src="/icons/sun-foggy-fill.svg" /> // dusk
  return <TimeIcon src="/icons/moon-clear-fill.svg" />                            // night
}

function LiveClock() {
  const [info, setInfo] = useState<{ time: string; hour: number } | null>(null)

  useEffect(() => {
    function update() {
      const now = new Date()
      const time = new Intl.DateTimeFormat("en-US", {
        hour: "numeric", minute: "2-digit", second: "2-digit",
        hour12: true, timeZone: "America/Toronto",
      }).format(now)
      const hourStr = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit", hour12: false, timeZone: "America/Toronto",
      }).format(now)
      const hour = parseInt(hourStr) % 24
      setInfo({ time, hour })
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  if (!info) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-normal text-neutral-400">
      {getTimeIcon(info.hour)}
      {info.time}, Toronto
    </span>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
      <path
        d="M12 20s-7.5-4.6-10-9.3C.5 7 2.2 3.6 5.6 3.1c2-.3 3.9.6 5 2.2 1.1-1.6 3-2.5 5-2.2 3.4.5 5.1 3.9 3.6 7.6C19.5 15.4 12 20 12 20z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.6}
      />
    </svg>
  )
}

// Local-only for now — not wired to a persisted count yet.
function LikeButton() {
  const [liked, setLiked] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setLiked((v) => !v)}
      aria-pressed={liked}
      className={`inline-flex cursor-pointer items-center gap-1.5 text-base font-normal transition-colors duration-150 ${
        liked ? "text-neutral-900" : "text-nav-link hover:text-nav-link-hover"
      }`}
    >
      <HeartIcon filled={liked} />
      <span className="font-mono text-sm tabular-nums">{liked ? 129 : 128}</span>
    </button>
  )
}

// The footer sits behind #main-frame (z-0, see comment below) so its bottom
// corners can peel back — but that means anything positioned *inside* the
// footer is stuck under #main-frame's higher stacking context too, no
// matter its own z-index. Portal the panel to <body> and position it with
// fixed viewport coordinates so it escapes that context entirely.
function ColophonButton() {
  const [open, setOpen] = useState(false)
  // Gates the portal — stays false until the button is actually clicked, so
  // `document.body` is never touched during SSR or the hydration render.
  // Once true it stays true; AnimatePresence handles hide/show from then on.
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false)
  const [coords, setCoords] = useState<{ bottom: number; left: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  function openPanel() {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return
    // The trigger sits at the left edge of its column on mobile but the
    // right edge on desktop (`items-start` / `sm:items-end`) — anchor by
    // `left` either way and clamp so the panel always stays on-screen
    // instead of assuming one fixed side.
    const left = Math.min(
      Math.max(rect.left, PANEL_VIEWPORT_MARGIN),
      window.innerWidth - PANEL_WIDTH - PANEL_VIEWPORT_MARGIN
    )
    setCoords({ bottom: window.innerHeight - rect.top + 12, left })
    setOpen(true)
    setHasOpenedOnce(true)
  }

  useEffect(() => {
    if (!open) return

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || btnRef.current?.contains(target)) return
      setOpen(false)
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    // Scroll changes the button's viewport position (the footer is only
    // `fixed` from `sm` up, and scrolls with content below it) — rather than
    // tracking it live, just close the panel.
    function handleScroll() {
      setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("scroll", handleScroll, true)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-expanded={open}
        className={`cursor-pointer ${FOOTER_LINK_CLASS}`}
      >
        Colophon
      </button>
      {hasOpenedOnce && createPortal(
        <AnimatePresence>
          {open && coords && (
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-label="Colophon"
              initial={{ opacity: 0, y: reduce ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : 4 }}
              transition={reduce ? { duration: 0 } : { duration: 0.16, ease: PANEL_EASE }}
              style={{ position: "fixed", bottom: coords.bottom, left: coords.left, width: PANEL_WIDTH }}
              className="z-50 rounded-lg bg-surface p-4 text-sm text-secondary shadow-[0_12px_32px_-18px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.06)]"
            >
              <p className="mb-2 font-medium text-neutral-900">Colophon</p>
              <p>
                Built with Next.js, React, and Tailwind CSS. Set in Avenir Next
                W1G, with Roboto Mono for numerals. Animated with Framer Motion.
              </p>
              <p className="mt-2 text-muted">Designed &amp; built by Jessica Wang.</p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

// Static (scrolls with content) below `sm`, matching the header/nav's mobile
// behavior. Fixed from `sm` up — pinned behind the content frame so its
// bottom corners can peel back to reveal it on scroll (see
// ScrollRevealController, which animates that peel and reserves body
// padding-bottom for it at the desktop breakpoint).
export function Footer() {
  return (
    <footer id="site-footer" className="static sm:fixed sm:inset-x-0 sm:bottom-0 sm:z-0 bg-chrome">
      <div className="container-chrome grid grid-cols-1 gap-8 pt-9 pb-12 sm:grid-cols-4">
        {/* Name + clock */}
        <div className="flex flex-col gap-1">
          <span className="text-[18px] font-medium text-neutral-900">Jessica Wang</span>
          <LiveClock />
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {navLinks.map(({ label, href, target }) => (
              <li key={label}>
                <Link
                  href={href}
                  target={target}
                  rel={target === "_blank" ? "noopener noreferrer" : undefined}
                  className={FOOTER_LINK_CLASS}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social links */}
        <nav aria-label="Social links">
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {socialLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={FOOTER_LINK_CLASS}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Colophon, design system teaser, like count */}
        <div className="flex flex-col items-start gap-1 sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <ColophonButton />
            <Link href="/design" className={FOOTER_LINK_CLASS}>
              Design system
            </Link>
          </div>
          <LikeButton />
        </div>
      </div>
    </footer>
  )
}
