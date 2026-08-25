"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { spring } from "@/lib/motion"
import { projects } from "@/content/work"

// The site's only mobile nav (see Nav.tsx, which renders nothing below `md`,
// and Footer.tsx, whose own Work/About/Resume links only surface once you've
// scrolled all the way to the true end of the page). Persistent and fixed so
// it's reachable from anywhere, including case study pages, which otherwise
// have no way back to /work short of the browser's own back gesture (now
// also a dedicated back button — see below).
//
// The chip shows whichever page you're actually on — "Work" for `/`, "About"
// for `/about`, and the case study's own short name (its `name` field, e.g.
// "Hack Western" — not the full `title`, which runs too long for a pill) for
// `/work/[slug]`. The panel behind it lists everywhere else: on a case
// study that's all three top-level links, since none of them is literally
// the page you're on — unlike Work/About's own panels, which exclude
// whichever of the two you're currently standing on.
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

// Deliberately breaks from the calm ease shared by Footer.tsx's Colophon
// popover and TableOfContents' subsection reveal — this panel is the one
// place on the site a visitor is likely to trigger repeatedly while
// navigating, so it gets `spring.snappy` (a mild bounce) instead, to feel
// more energetic on open.

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

function BackArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 6L4 12L10 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  // Press-scale is set here, on the shared chip+panel wrapper, rather than
  // on the chip div itself — see the .mobile-nav-shell comment below for why.
  const shellRef = useRef<HTMLDivElement>(null)

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

  // Case studies get their own dedicated back button (see below) instead of
  // folding "go back" into the chip itself — the chip's whole job everywhere
  // else on the site is just to open/close the panel, and a case study
  // shouldn't be the one place that tap does something else instead.
  const isCaseStudy = pathname.startsWith("/work/")
  const activeProject = isCaseStudy
    ? projects.find(p => pathname === `/work/${p.slug}`)
    : undefined
  // Falls back to "Work" (current.label) if the slug doesn't match a known
  // project — shouldn't happen since routes are only ever generated for
  // real projects, but a stale label beats a blank one.
  const chipLabel = activeProject?.name ?? current.label

  // On a case study, "Work" is no longer what the chip claims to be (see
  // chipLabel above), so it belongs back in the panel alongside About/Resume
  // rather than being excluded the way it is on `/` itself.
  const secondaryLinks = isCaseStudy ? navLinks : navLinks.filter(l => l !== current)

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

  // The chip floats over page content so it's reachable from anywhere, but
  // #site-footer has its own Work/About/Resume links (see Footer.tsx) — once
  // the footer is actually on screen the chip is redundant and just sits on
  // top of it, so it retreats the same way it arrived (see the
  // AnimatePresence exit below) rather than staying stacked there. Threshold
  // 0 with no rootMargin so this fires at the literal moment any part of the
  // footer crosses into the viewport, not before or after.
  const [footerVisible, setFooterVisible] = useState(false)
  useEffect(() => {
    const footer = document.getElementById("site-footer")
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting)
        if (entry.isIntersecting) setOpen(false)
      },
      { threshold: 0 }
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  // Reused as-is for exit too (see the `exit` prop below) — the chip should
  // fly down exactly as it flew up, same spring and same distance, not a
  // quicker/different one, so the motion reads as one path played in
  // reverse rather than two different gestures.
  const transition = reduce ? { duration: 0 } : spring.snappy

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
    <div ref={rootRef} className="fixed inset-x-5 bottom-5 z-40 md:hidden">
      {/* Keyed by pathname so the whole unit (back button + chip + panel)
          treats every route change as a fresh mount/unmount instead of the
          persistent single instance it actually is — MobileNav lives in
          app/layout.tsx and would otherwise never remount on client-side
          nav, so the old chip would just sit there unchanged instead of
          flying out. `mode="wait"` holds the old chip's exit until it's
          fully gone before the new one starts flying in — this is one
          fixed slot with a single label in it, not a list, so overlapping
          the two (default `sync` mode) would show both labels stacked on
          top of each other mid-transition.
          Exit and enter both use `transition` (`spring.snappy`, the same one
          the panel toggle below already uses) and the same translateY(24px)
          distance — the fly-down is deliberately the fly-up in reverse, not
          a separate, quicker exit.
          `!footerVisible` reuses this exact same enter/exit pair for a
          second trigger: rendering `null` while the footer is on screen
          unmounts the current pathname-keyed child just like a route change
          would, playing the same exit, then remounts (replaying the same
          entrance) once it's scrolled back out of view — one animation
          vocabulary, two triggers, instead of a second bespoke transition. */}
      <AnimatePresence mode="wait">
        {!footerVisible && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, transform: "translateY(24px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)", transition }}
            exit={{ opacity: 0, transform: "translateY(24px)", transition }}
            // Two-track grid only when there's a back button to lay out beside
            // the chip — with a single child (every page but a case study),
            // `grid-cols-[auto_1fr]` would still auto-place the shell into just
            // the first (content-sized) track, leaving the second `1fr` track as
            // dead empty space instead of the chip spanning the full width like
            // it always has.
            className={`gap-2 ${
              isCaseStudy ? "grid grid-cols-[auto_1fr] items-stretch" : "block"
            }`}
          >
            {/* Back button — case studies only. Sits beside the chip rather than
                inside it. The outer container is `grid` (not `flex`), specifically
                so this can be a reliable circle: `aspect-square` on a *flex* item
                doesn't transfer its stretched cross-size into the main-axis width
                (browsers size flex-basis:auto from content first, so it stayed
                icon-width narrow) — as a *grid* item, `items-stretch` gives it a
                definite row height first, and `aspect-square` then derives width
                from that correctly. This still means it picks up the chip's
                rendered height automatically, no hardcoded pixel value to drift
                out of sync if the chip's own padding/type ever changes.
                Always goes to "/" (Work) — case study routes only ever nest one
                level deep, so there's no ambiguity about what "back" means here.
                Same press-scale technique as the chip (see .mobile-nav-shell's
                own comment below), but set via `e.currentTarget` on the pointer
                handlers directly rather than a ref — this button is a single
                element with nothing else that needs to move in lockstep with
                it, so there's no need for the indirection the chip's shared
                wrapper requires. */}
            {isCaseStudy && (
              <Link
                href="/"
                aria-label="Back to work"
                onPointerDown={(e) => e.currentTarget.style.setProperty("--back-press", "0.97")}
                onPointerUp={(e) => e.currentTarget.style.removeProperty("--back-press")}
                onPointerLeave={(e) => e.currentTarget.style.removeProperty("--back-press")}
                className="mobile-nav-back flex aspect-square items-center justify-center rounded-full bg-surface text-neutral-500 transition-colors duration-150 hover:text-neutral-900"
                style={{ boxShadow: mainShadow }}
              >
                <BackArrowIcon />
              </Link>
            )}

            {/* Wrapper's own size is defined purely by the chip below (a normal
                flow child) — the panel is `absolute`, so it never resizes this
                wrapper or moves the chip. That's the whole point: the chip is a
                fixed component that never changes, exactly like the Figma setup
                this mirrors (a fixed chip frame in front, a separate frame behind
                it that fades and settles into place).
                .mobile-nav-shell (globals.css) is where the press-scale actually
                applies — scaling *this* wrapper rather than just the chip div
                means the panel (an absolutely-positioned descendant, anchored to
                this same box) scales down in perfect lockstep with the chip
                instead of staying full-size while the chip shrinks around its own
                center. That mismatch is exactly what showed up as a visible seam/
                cut-off corner right where they meet during the press-to-close
                animation — scaling them as one rigid unit removes it entirely,
                since a transform never changes an element's position relative to
                its own descendants, no matter how the descendant is positioned. */}
            <div ref={shellRef} className="mobile-nav-shell relative min-w-0">
              {/* Secondary links panel — neutral-75, anchored `PANEL_OVERLAP`px
                  below the chip's own top edge (see the calc() comment above) so
                  it's always tucked just behind the chip's top regardless of
                  height. z-0, under the chip's z-10.
                  Enters via transform + opacity, not height — the panel is laid
                  out at its real height the moment it mounts (AnimatePresence
                  keeps it out of the DOM entirely while closed) and just fades in
                  while rising the last bit up from near the chip into its resting
                  spot, rather than growing its whole height from zero. (Positive
                  translateY here means *closer to the chip*, since the panel's
                  resting position is already anchored well above it — animating
                  down to 0 is what reads as rising up out of the chip.) Two
                  reasons for transform over height: (1) `height` is a
                  layout-triggering property, so animating it forces a reflow
                  every frame — transform/opacity are compositor-only and stay off
                  the main thread; (2) the previous grow-from-nothing had a long
                  travel distance for a spring to cover, so its overshoot was
                  large enough in absolute pixels to read as stutter instead of a
                  tight settle. `translateY` is written as a literal `transform`
                  string, not Framer's `y` shorthand — `x`/`y`/`scale` fall back
                  to main-thread rAF and lose the hardware acceleration this is
                  meant to gain. */}
              <AnimatePresence initial={false}>
                {open && (
                  <motion.nav
                    key="secondary"
                    aria-label="Secondary navigation"
                    initial={{ opacity: 0, transform: "translateY(12px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    exit={{ opacity: 0, transform: "translateY(12px)" }}
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
                        Link below instead, so every row's actual hitbox spans
                        (almost) the full panel width — 4px shy on each side, to
                        match the press-state pill's own inset, see below —
                        rather than just the text glyphs (tapping the empty space
                        to the right of the label still hits it). Text still reads
                        left-aligned because that's just how a block element's own
                        text flows, so "Work" and every secondary link still share
                        one left edge. */}
                    <ul
                      className="flex flex-col gap-9 list-none m-0 pt-4.5"
                      style={{ paddingBottom: PANEL_OVERLAP + 18 }}
                    >
                      {secondaryLinks.map(({ label, href, target }) => (
                        <li key={label} className="m-0">
                          {/* Press state — a neutral-100 pill fades in behind the
                              label on tap, same --var-driven technique as the
                              chip/back button (see .mobile-nav-link), not `:active`
                              — iOS Safari won't reliably apply `:active` styles on a
                              plain tap without extra workarounds, and this codebase
                              already standardized on explicit pointer handlers for
                              exactly that reason.
                              `py-3.5` + `-my-3.5` gives the pill 14px of padding
                              above/below the label while netting out to zero extra
                              height in the list's own flow — the pill visually
                              bleeds into the `gap-9` whitespace on press instead of
                              pushing neighboring rows apart. rounded-full on a row
                              this short (versus the panel's width) reads as a
                              stadium/capsule shape, same family as the chip and
                              back button.
                              `mx-1` insets the pill 4px from the panel's own edges
                              — `block` (not `w-full`) so that inset comes purely
                              from the margin the way a normal block box works,
                              rather than `w-full`'s 100% + margin overflowing the
                              panel by 8px. This does narrow the tap target by the
                              same 4px each side — an acceptable trade since the
                              pill *is* now the visual hit target. */}
                          <Link
                            href={href}
                            target={target}
                            rel={target === "_blank" ? "noopener noreferrer" : undefined}
                            onPointerDown={(e) => e.currentTarget.style.setProperty("--link-press-bg", "#ECEDEF")}
                            onPointerUp={(e) => e.currentTarget.style.removeProperty("--link-press-bg")}
                            onPointerLeave={(e) => e.currentTarget.style.removeProperty("--link-press-bg")}
                            className="mobile-nav-link -my-3.5 mx-1 block rounded-full px-6 py-3.5 text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-150"
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
                  this exact same shape whether the panel is open or closed. 14px
                  above and below the label — see spacing redline.
                  The whole chip toggles the panel, nothing else — the label is
                  always plain text, never a link. Case studies get a dedicated
                  back button beside the chip instead (see above) for "go back to
                  work"; folding that into the label here would make this one tap
                  target do two different things depending on which page you're
                  on, which is exactly what the separate button avoids.
                  Pressing the chip scales it down slightly — same --var-driven
                  technique as the About hero photos — but the property is set on
                  shellRef (the shared wrapper above), not this element, so the
                  panel scales down with it in lockstep; see the wrapper's own
                  comment for why. Still scoped to presses on the chip specifically
                  (not the panel/links) since the listeners stay here. pointerLeave
                  covers a press that drags off the chip before release (no
                  matching pointerup fires there). */}
              <div
                onClick={() => setOpen((v) => !v)}
                onPointerDown={() => shellRef.current?.style.setProperty("--chip-press", "0.97")}
                onPointerUp={() => shellRef.current?.style.removeProperty("--chip-press")}
                onPointerLeave={() => shellRef.current?.style.removeProperty("--chip-press")}
                className="relative z-10 flex cursor-pointer items-center justify-between rounded-full bg-surface pl-6 pr-5 py-3.5"
                style={{ boxShadow: open ? `${chipLiftShadow}, ${mainShadow}` : mainShadow }}
              >
                <span className="text-base font-medium text-primary">{chipLabel}</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
