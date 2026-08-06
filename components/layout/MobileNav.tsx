"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

// The site's only mobile nav (see Nav.tsx, which renders nothing below `sm`,
// and Footer.tsx, whose own Work/About/Resume links only surface once you've
// scrolled all the way to the true end of the page). Persistent and fixed so
// it's reachable from anywhere, including case study pages, which otherwise
// have no way back to /work short of the browser's own back gesture.
//
// The chip shows whichever page you're actually on — "Work" for `/` and
// every `/work/[slug]` case study, "About" for `/about` — and the panel
// behind it lists everywhere else. This mirrors Nav.tsx's own isActive
// logic (see there) rather than reinventing it, just extended to also treat
// case study routes as part of the Work section, which desktop's Nav.tsx
// never needs to since it doesn't render on /work/* at all (CaseStudyLayout
// has its own header there).
type NavLink = { label: string; href: string; target?: string }

const navLinks: NavLink[] = [
  { label: "Work",   href: "/" },
  { label: "About",  href: "/about" },
  { label: "Resume", href: "/JessicaWang_Resume.pdf", target: "_blank" },
]

function isCurrentSection(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/work/")
  return pathname === href || pathname.startsWith(`${href}/`)
}

// Same on-screen-settle curve as Footer.tsx's Colophon popover and
// TableOfContents' subsection reveal, so every "panel appears" moment on the
// site shares one feel.
const PANEL_EASE: [number, number, number, number] = [0.33, 1, 0.68, 1]
const PANEL_DURATION = 0.3

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 5H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2.5 11H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12.5 3.5L3.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)

  // A route change means the panel's job is done — close it rather than
  // leaving it open over whatever page just loaded underneath it. Adjusting
  // state during render (not in an effect) per React's "reset state when a
  // prop changes" pattern — comparing against a ref'd previous pathname
  // would just re-implement what this already does more plainly.
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  // Falls back to the first entry (Work) if somehow nothing matches, rather
  // than showing no chip label at all — Work is the closest thing this site
  // has to a root/home section, so it's the sanest default.
  const current = navLinks.find(l => isCurrentSection(pathname, l.href)) ?? navLinks[0]
  const secondaryLinks = navLinks.filter(l => l !== current)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const transition = reduce ? { duration: 0 } : { duration: PANEL_DURATION, ease: PANEL_EASE }

  // Main ambient shadow — applied to both layers identically so it reads as
  // one shadow wrapping the whole combined shape (panel + chip) rather than
  // two separate floating cards. Plain inline style, not a Tailwind class,
  // because the chip's value also needs the chip-lift shadow layered in
  // conditionally on `open` — Tailwind can't merge two arbitrary shadow
  // utilities into one box-shadow property, so both are just composed here
  // as plain CSS strings instead.
  const mainShadow = "0 12px 32px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)"
  // Chip-lift shadow — separates the white chip from the neutral-75 panel
  // tucked behind it, only while that panel exists to be lifted off of.
  const chipLiftShadow = "0 0 10px 0 rgba(0,0,0,0.04)"

  // How far down, from the chip's own top edge, the panel's bottom edge is
  // anchored — i.e. how much of the chip's top the panel tucks behind.
  // Expressed as `bottom: calc(100% - Npx)` rather than a plain px value:
  // `bottom` on an absolutely-positioned box measures up from the
  // container's *bottom* edge, and the wrapper's height here is exactly the
  // chip's height (see below) — so a plain `bottom: 24px` would anchor the
  // panel 24px above the chip's *bottom*, i.e. deep inside the chip's own
  // span instead of just barely behind its top, burying whatever link ends
  // up in that zone behind the opaque chip.
  const PANEL_OVERLAP = 24

  return (
    <div ref={rootRef} className="fixed inset-x-5 bottom-5 z-40 sm:hidden">
      {/* Wrapper's own size is defined purely by the chip below (a normal
          flow child) — the panel is `absolute`, so growing it never resizes
          this wrapper or moves the chip. That's the whole point: the chip is
          a fixed component that never changes, exactly like the Figma setup
          this mirrors (a fixed chip frame in front, a separate hugging frame
          behind it whose height is the only thing that animates). */}
      <div className="relative">
        {/* Secondary links panel — neutral-75, anchored `PANEL_OVERLAP`px
            below the chip's own top edge (see the calc() comment above) so
            it's always tucked just behind the chip's top regardless of
            height, growing upward only. z-0, under the chip's z-10. */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              key="secondary"
              aria-label="Secondary navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={transition}
              // Bottom corners stay square — this edge is meant to be
              // hidden behind the chip; rounding it would let a curved
              // corner peek out past the chip's own rounded corner instead.
              className="absolute inset-x-0 z-0 overflow-hidden rounded-t-[32px] bg-neutral-75"
              style={{ bottom: `calc(100% - ${PANEL_OVERLAP}px)`, boxShadow: mainShadow }}
            >
              {/* 18px to the first link and from the last link to the
                  chip's visible top edge, 36px between links — see spacing
                  redline. The bottom padding isn't a plain 18px: the panel's
                  own bottom edge sits PANEL_OVERLAP (24px) *behind* the
                  chip's visible top (see the `bottom` calc() above), so
                  measuring 18px from Resume to the chip's top means padding
                  the panel's actual bottom edge by 18 + 24.
                  No `items-start`/`px-6` here — that inset now lives on each
                  Link below instead, so every row's actual hitbox spans the
                  full panel width (tapping the empty space to the right of
                  the label still hits it), not just the text glyphs. Text
                  still reads left-aligned because that's just how a block
                  element's own text flows, so "Work" and every secondary
                  link still share one left edge. */}
              <ul
                className="flex flex-col gap-9 list-none m-0 pt-4.5"
                style={{ paddingBottom: PANEL_OVERLAP + 18 }}
              >
                {secondaryLinks.map(({ label, href, target }) => (
                  <li key={label} className="m-0">
                    <Link
                      href={href}
                      target={target}
                      rel={target === "_blank" ? "noopener noreferrer" : undefined}
                      className="block w-full px-6 text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Current-page chip — always white, always `rounded-full`, always
            this exact same shape whether the panel is open or closed. 18px
            above and below the label — see spacing redline.
            The whole chip toggles the panel now, not just the icon — a much
            bigger, easier tap target.
            The label is only a real link when it's not literally the page
            you're already on — on a case study, the label reads "Work"
            while pathname is "/work/[slug]", not "/", so tapping it still
            needs to navigate home (that one-tap "back to work" is the whole
            reason the label tracks the current *section*, not the exact
            route). But on the Work or About page itself, pathname already
            equals current.href — linking there just re-navigates to the
            exact page you're standing on, which Next.js still treats as a
            real navigation (resets scroll, etc.) even though nothing
            actually changes. Plain text there instead, so a tap just
            bubbles to the chip's own toggle like tapping anywhere else on
            it would. */}
        <div
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 flex cursor-pointer items-center justify-between rounded-full bg-surface pl-6 pr-5 py-4.5"
          style={{ boxShadow: open ? `${chipLiftShadow}, ${mainShadow}` : mainShadow }}
        >
          {pathname === current.href ? (
            <span className="text-base font-medium text-primary">{current.label}</span>
          ) : (
            <Link
              href={current.href}
              onClick={(e) => e.stopPropagation()}
              className="text-base font-medium text-primary"
            >
              {current.label}
            </Link>
          )}
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="flex h-7 w-7 items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors duration-150"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </div>
  )
}
