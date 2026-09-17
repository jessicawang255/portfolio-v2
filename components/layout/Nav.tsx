"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { samePageReload } from "@/lib/samePageNav"
import { navLinks } from "@/lib/navLinks"

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

// Neutral-75 (#FBFCFD). Flat 100% opacity for the first 48px, then eases
// down to 0% along an ease-out curve (same cubic-bezier as --ease-out). The
// ease is sampled into explicit px stops since CSS gradients only
// interpolate linearly between stops. Hex hardcoded per Tailwind v4
// tree-shaking (@theme color vars only reach :root via a Tailwind utility
// class).
const SCRIM_GRADIENT = `linear-gradient(to bottom,
  rgba(251, 252, 253, 1) 0px,
  rgba(251, 252, 253, 1) 48px,
  rgba(251, 252, 253, 0.506) 62.4px,
  rgba(251, 252, 253, 0.248) 76.8px,
  rgba(251, 252, 253, 0.123) 91.2px,
  rgba(251, 252, 253, 0.06) 105.6px,
  rgba(251, 252, 253, 0.028) 120px,
  rgba(251, 252, 253, 0.012) 134.4px,
  rgba(251, 252, 253, 0.004) 148.8px,
  rgba(251, 252, 253, 0.001) 163.2px,
  rgba(251, 252, 253, 0) 177.6px,
  rgba(251, 252, 253, 0) 192px)`

// Cursor distance (px) from the top of the viewport at which the scrim
// switches on; it's a flat on/off toggle, not proportional to distance.
const REVEAL_THRESHOLD = 140

// Horizontal slack (px) added on either side of the logo and the link list —
// the cursor only needs to be within this radius of one of them, not
// hovering it exactly. Dead space between the two (e.g. mid-screen) never
// reveals the scrim.
const REVEAL_RADIUS_X = 80

export function Nav() {
  const pathname = usePathname()
  const scrimRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const linksRef = useRef<HTMLUListElement>(null)
  const revealedRef = useRef(false)
  const zonesRef = useRef<{ left: number; right: number }[]>([])

  useEffect(() => {
    function updateZones() {
      zonesRef.current = [logoRef.current, linksRef.current]
        .filter((el): el is HTMLElement => el !== null)
        .map((el) => {
          const rect = el.getBoundingClientRect()
          return { left: rect.left - REVEAL_RADIUS_X, right: rect.right + REVEAL_RADIUS_X }
        })
    }
    function setRevealed(revealed: boolean) {
      if (revealedRef.current === revealed) return
      revealedRef.current = revealed
      scrimRef.current?.style.setProperty("--nav-reveal", revealed ? "1" : "0")
    }
    function nearNavX(x: number) {
      return zonesRef.current.some((zone) => x >= zone.left && x <= zone.right)
    }
    function handleMove(e: MouseEvent) {
      setRevealed(e.clientY < REVEAL_THRESHOLD && nearNavX(e.clientX))
    }
    function handleLeave() {
      setRevealed(false)
    }
    updateZones()
    window.addEventListener("resize", updateZones)
    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseleave", handleLeave)
    return () => {
      window.removeEventListener("resize", updateZones)
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  // Case study pages render their own nav overlay (see CaseStudyLayout).
  if (pathname.startsWith("/work/")) return null

  return (
    // Bottom pill nav takes over below `sm`; matches HeroShell's fixed-position
    // breakpoint so this bar never sits above a still-scrolling hero.
    <header id="site-nav" className="fixed inset-x-0 top-0 z-[2] hidden sm:block">
      {/* Reveals as the cursor approaches the top of the screen, masking the
          dot grid behind the logo/links instead of sitting there at rest. */}
      <div
        ref={scrimRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[192px] transition-opacity duration-300 ease-out"
        style={{ background: SCRIM_GRADIENT, opacity: "var(--nav-reveal, 0)" }}
      />

      <nav
        className="container-chrome relative flex items-center justify-between py-4"
        aria-label="Primary navigation"
      >
        <Link
          ref={logoRef}
          href="/"
          onClick={samePageReload(pathname, "/")}
          className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-150"
        >
          Jessica Wang
        </Link>

        <ul ref={linksRef} className="flex items-center gap-7 list-none m-0 p-0">
          {navLinks.map(({ label, href, target }) => (
            <li key={label}>
              <Link
                href={href}
                target={target}
                rel={target === "_blank" ? "noopener noreferrer" : undefined}
                onClick={samePageReload(pathname, href)}
                className={`text-base font-normal transition-colors duration-150 hover:text-nav-link-hover ${
                  isActive(pathname, href) ? "text-neutral-900" : "text-nav-link"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
