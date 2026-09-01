"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { spring } from "@/lib/motion"
import { projects } from "@/content/work"

// The site's only mobile nav (see Nav.tsx, which renders nothing below `sm`).
// Persistent and fixed so it's reachable from anywhere, including case study
// pages, which get a dedicated back button too (see below).
//
// The chip shows whichever page you're on — "Work", "About", or a case
// study's short `name` (not the full `title`, too long for a pill). The
// panel behind it lists everywhere else: on a case study that's all three
// top-level links, since none of them is the current page.
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
  // on the chip div itself — see .mobile-nav-shell below.
  const shellRef = useRef<HTMLDivElement>(null)

  // Close the panel on route change (React's reset-state-during-render
  // pattern) rather than leaving it open over the new page.
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  // Falls back to Work if nothing matches — the closest thing to a home section.
  const current = navLinks.find(l => isCurrentSection(pathname, l.href)) ?? navLinks[0]

  const isCaseStudy = pathname.startsWith("/work/")
  const activeProject = isCaseStudy
    ? projects.find(p => pathname === `/work/${p.slug}`)
    : undefined
  const chipLabel = activeProject?.name ?? current.label

  // On a case study the chip no longer says "Work", so it belongs back in
  // the panel alongside About/Resume.
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

  // #site-footer has its own Work/About/Resume links, so once it's on screen
  // the floating chip is redundant — hide it the same way it arrived.
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

  // Reused for exit too — the chip flies down the same spring and distance
  // it flew up, so the motion reads as one path played in reverse.
  const transition = reduce ? { duration: 0 } : spring.snappy

  // Applied to both layers identically so it reads as one shadow wrapping
  // the combined shape (panel + chip). Plain inline style, not a Tailwind
  // class, since the chip also layers in chip-lift conditionally on `open`.
  const mainShadow = "0 12px 32px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)"
  // Separates the white chip from the neutral-75 panel tucked behind it.
  const chipLiftShadow = "0 0 10px 0 rgba(0,0,0,0.04)"

  // How far down from the chip's own top edge the panel's bottom edge is
  // anchored. `bottom` on an absolute box measures from the container's
  // bottom, and this wrapper's height is exactly the chip's height — so a
  // plain `bottom: 24px` would anchor the panel deep inside the chip's own
  // span instead of just behind its top.
  const PANEL_OVERLAP = 24

  return (
    // `sm:hidden` — hands off to Nav.tsx's top bar at `sm`.
    <div ref={rootRef} className="fixed inset-x-5 bottom-5 z-40 sm:hidden">
      {/* Keyed by pathname so the whole unit remounts (flies out/in) on every
          route change — MobileNav lives in app/layout.tsx and otherwise
          never remounts on client-side nav. `mode="wait"` holds the old
          chip's exit until it's fully gone before the new one flies in.
          `!footerVisible` reuses the same enter/exit pair as a second
          trigger: rendering `null` while the footer is on screen unmounts
          the child (same exit), then remounts it once scrolled back out of
          view (same entrance). */}
      <AnimatePresence mode="wait">
        {!footerVisible && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, transform: "translateY(24px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)", transition }}
            exit={{ opacity: 0, transform: "translateY(24px)", transition }}
            // Two-track grid only when there's a back button beside the chip;
            // otherwise the chip spans the full width on its own.
            className={`gap-2 ${
              isCaseStudy ? "grid grid-cols-[auto_1fr] items-stretch" : "block"
            }`}
          >
            {/* Back button — case studies only, sits beside the chip. The outer
                container is `grid` (not `flex`) so `items-stretch` gives this a
                definite row height and `aspect-square` derives a correct width
                from it — a flex item's aspect-square doesn't get that, since
                flex-basis:auto sizes from content first. Always goes to "/"
                since case study routes only ever nest one level deep. */}
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

            {/* Wrapper's own size comes purely from the chip below — the panel
                is `absolute`, so it never resizes the wrapper or moves the chip.
                .mobile-nav-shell (globals.css) applies the press-scale here
                rather than on the chip div directly, so the panel (anchored to
                this same box) scales down in lockstep with the chip instead of
                staying full-size while the chip shrinks around its own center. */}
            <div ref={shellRef} className="mobile-nav-shell relative min-w-0">
              {/* Secondary links panel — anchored `PANEL_OVERLAP`px below the
                  chip's top edge, tucked behind it regardless of height. z-0,
                  under the chip's z-10. Enters via transform + opacity (not
                  height, which is layout-triggering and forces a reflow every
                  frame) — it fades in while rising the last bit into its
                  resting spot. `translateY` is a literal `transform` string,
                  not Framer's `y` shorthand, to keep it on the compositor. */}
              <AnimatePresence initial={false}>
                {open && (
                  <motion.nav
                    key="secondary"
                    aria-label="Secondary navigation"
                    initial={{ opacity: 0, transform: "translateY(12px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    exit={{ opacity: 0, transform: "translateY(12px)" }}
                    transition={transition}
                    // Bottom corners stay square — this edge is hidden behind the chip.
                    className="absolute inset-x-0 z-0 overflow-hidden rounded-t-[32px] bg-neutral-75"
                    style={{ bottom: `calc(100% - ${PANEL_OVERLAP}px)`, boxShadow: mainShadow }}
                  >
                    {/* Bottom padding is 18 + PANEL_OVERLAP: the panel's own bottom
                        edge sits PANEL_OVERLAP behind the chip's visible top, so
                        reaching an 18px gap from the last link to the chip needs
                        that much extra. Row insets live on each Link below (not
                        `px-6` here) so each row's tap target spans nearly the full
                        panel width, not just the text glyphs. */}
                    <ul
                      className="flex flex-col gap-9 list-none m-0 pt-4.5"
                      style={{ paddingBottom: PANEL_OVERLAP + 18 }}
                    >
                      {secondaryLinks.map(({ label, href, target }) => (
                        <li key={label} className="m-0">
                          {/* Press state — a neutral-100 pill fades in behind the
                              label on tap. Uses pointer handlers rather than
                              `:active`, since iOS Safari won't reliably apply
                              `:active` on a plain tap. `py-3.5` + `-my-3.5` gives
                              the pill padding while netting zero extra height in
                              the list's flow. `mx-1` + `block` insets the pill 4px
                              from the panel's edges via margin, narrowing the tap
                              target slightly since the pill is now the hit target. */}
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

              {/* Current-page chip. The whole chip toggles the panel — the label
                  is always plain text, never a link; case studies get a
                  dedicated back button instead. Pressing it scales shellRef (the
                  shared wrapper), not this element, so the panel scales in
                  lockstep. pointerLeave covers a press dragged off before release. */}
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
