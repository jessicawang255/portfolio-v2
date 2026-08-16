"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { TertiaryLink } from "@/components/ui/TertiaryLink"

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

// `before:inset-[…]` pads each link's hit area out toward the 44px touch-
// target minimum (see IconButton's own `::before` for the same trick) —
// vertical inset only reaches -10px (not the full -11px+ that'd fully clear
// 44px) since these rows are stacked with just a 4px gap (`gap-1` below);
// going further would overlap more than it already does. Horizontal goes
// wider (-16px) since it costs nothing here — nothing else sits beside a
// stacked link — and single-character labels like "X" need it most.
const FOOTER_LINK_CLASS = "relative text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-150 before:absolute before:inset-x-[-16px] before:inset-y-[-10px] before:content-['']"

// Popover reveal — same on-screen-settle curve as TableOfContents' subsection reveal.
const PANEL_EASE: [number, number, number, number] = [0.33, 1, 0.68, 1]
// Sized to the widest colophon row ("Built on Next.js, TypeScript, and
// Tailwind.") plus padding, so that row never wraps — a wrapped line with
// text-balance looks intentional (roughly even lines) only when there IS a
// second line to balance against; forcing this one to stay single-line
// avoids the alternative of a short balanced first line trailing off with a
// visible gap before the panel's edge.
const PANEL_WIDTH = 352
const PANEL_VIEWPORT_MARGIN = 16

// Renders any single-color icon from public/icons via a mask, so it
// inherits `currentColor` like a native SVG stroke/fill would. Shared by the
// time-of-day icon in LiveClock and the eye icon in ViewCounter below.
function MaskIcon({ src }: { src: string }) {
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
  if (hour >= 5  && hour < 8)  return <MaskIcon src="/icons/sun-foggy-fill.svg" /> // dawn
  if (hour >= 8  && hour < 18) return <MaskIcon src="/icons/sun-fill.svg" />       // day
  if (hour >= 18 && hour < 21) return <MaskIcon src="/icons/sun-foggy-fill.svg" /> // dusk
  return <MaskIcon src="/icons/moon-clear-fill.svg" />                            // night
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

function EyeIcon() {
  return <MaskIcon src="/icons/eye-fill.svg" />
}

// Sitewide total, persisted server-side (see app/api/views/route.ts) — the
// footer is a fixture in the root layout, so there's one count, not a
// per-page one. Counted at most once per browser session: a fresh session
// POSTs (increment + return new total) and flags itself in sessionStorage;
// any later read in the same session just GETs the current total instead of
// re-incrementing it.
const VIEW_SESSION_FLAG = "site-view-counted"

function ViewCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const alreadyCounted = sessionStorage.getItem(VIEW_SESSION_FLAG) === "1"

    fetch("/api/views", { method: alreadyCounted ? "GET" : "POST" })
      .then((res) => res.json())
      .then((data: { count: number }) => {
        if (cancelled) return
        setCount(data.count)
        if (!alreadyCounted) sessionStorage.setItem(VIEW_SESSION_FLAG, "1")
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  if (count === null) return null

  return (
    // Same invisible padded hit area as FOOTER_LINK_CLASS above, minus the
    // hover/interactive styling — this isn't a button, just a stat.
    <span className="relative inline-flex items-center gap-1.5 text-sm font-normal text-neutral-400 before:absolute before:inset-x-[-16px] before:inset-y-[-10px] before:content-['']">
      <EyeIcon />
      {count} {count === 1 ? "visitor" : "visitors"}
    </span>
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
  const [coords, setCoords] = useState<{ bottom: number; left?: number; right?: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  function openPanel() {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return
    // The trigger sits at the left edge of its column on mobile
    // (`items-start`) but the right edge on desktop (`sm:items-end`) — below
    // `sm`, anchor the panel's left edge to the button's left edge like
    // before; from `sm` up, anchor its *right* edge to the button's right
    // edge instead, so the panel lines up with the column's right edge
    // (every child in the column shares that edge) rather than trailing off
    // whichever `left` the word "Colophon" itself happens to start at.
    const isDesktop = window.innerWidth >= 640 // Tailwind `sm`
    const bottom = window.innerHeight - rect.top + 12
    if (isDesktop) {
      const right = Math.max(window.innerWidth - rect.right, PANEL_VIEWPORT_MARGIN)
      setCoords({ bottom, right })
    } else {
      const left = Math.min(
        Math.max(rect.left, PANEL_VIEWPORT_MARGIN),
        window.innerWidth - PANEL_WIDTH - PANEL_VIEWPORT_MARGIN
      )
      setCoords({ bottom, left })
    }
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
              style={{
                position: "fixed",
                bottom: coords.bottom,
                left: coords.left,
                right: coords.right,
                width: PANEL_WIDTH,
              }}
              className="z-50 rounded-lg bg-surface p-4 text-sm text-secondary shadow-[0_12px_32px_-18px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.06)]"
            >
              <p className="mb-2 font-mono text-sm uppercase leading-[1.2] text-neutral-400">Colophon</p>
              <div className="flex flex-col gap-1">
                <p className="text-balance font-normal text-base">
                  Designed in{" "}
                  <TertiaryLink href="https://www.figma.com/" target="_blank" rel="noopener noreferrer">
                    Figma
                  </TertiaryLink>
                  .
                </p>
                <p className="text-balance font-normal text-base">
                  Motion from{" "}
                  <TertiaryLink href="https://www.lottielab.com/" target="_blank" rel="noopener noreferrer">
                    LottieLab
                  </TertiaryLink>
                  .
                </p>
                <p className="text-balance font-normal text-base">
                  Built on{" "}
                  <TertiaryLink href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
                    Next.js
                  </TertiaryLink>
                  ,{" "}
                  <TertiaryLink href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">
                    TypeScript
                  </TertiaryLink>
                  , and{" "}
                  <TertiaryLink href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
                    Tailwind
                  </TertiaryLink>
                  .
                </p>
                <p className="text-balance font-normal text-base">
                  Hosted on{" "}
                  <TertiaryLink href="https://vercel.com/" target="_blank" rel="noopener noreferrer">
                    Vercel
                  </TertiaryLink>
                  .
                </p>
                <p className="text-balance font-normal text-base">
                  Source on{" "}
                  <TertiaryLink href="https://github.com/" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </TertiaryLink>
                  .
                </p>
                <p className="text-balance font-normal text-base">
                  With help from{" "}
                  <TertiaryLink href="https://claude.com/product/claude-code" target="_blank" rel="noopener noreferrer">
                    Claude Code
                  </TertiaryLink>
                  .
                </p>
              </div>
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
      {/* First three columns hug their own content (`max-content`) instead
          of stretching to an equal 1/4 of container-chrome's 120rem cap —
          on a wide screen that stretch was what made "Work" and "Email"
          read as stranded in mostly-empty tracks. The last column keeps
          `1fr`, absorbing the leftover space so Colophon/view count stay
          anchored to the right edge as before. Column gap also trimmed
          from the row gap's 32px (gap-8) down to 24px (gap-x-6), now that
          it's the only thing separating adjacent columns. */}
      <div className="container-chrome grid grid-cols-1 gap-8 pt-9 pb-12 sm:grid-cols-[max-content_max-content_max-content_1fr] sm:gap-x-24">
        {/* Name + clock */}
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="relative w-fit text-[18px] font-medium text-neutral-900 hover:text-nav-link-hover transition-colors duration-150 before:absolute before:inset-x-[-16px] before:inset-y-[-10px] before:content-['']"
          >
            Jessica Wang
          </Link>
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

        {/* Colophon, design system teaser, view count */}
        <div className="flex flex-col items-start gap-1 sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <ColophonButton />
            {/* Design system link — hidden for now, adding this back later. Route stays live. */}
            {/* <Link href="/design" className={FOOTER_LINK_CLASS}>
              Design system
            </Link> */}
          </div>
          <ViewCounter />
        </div>
      </div>
    </footer>
  )
}
