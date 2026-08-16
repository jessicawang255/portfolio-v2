"use client"

import { useEffect, useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

// Next's own "scroll the new page into view" heuristic (layout-router.js)
// walks the new page's DOM for the first non-fixed/sticky element and only
// scrolls if that element's top edge isn't already somewhere in the
// viewport — a check made against whatever scroll position the *previous*
// page left behind. On About, #hero-content (HeroShell.tsx) is `static` on
// mobile rather than `fixed`, so it's never skipped, and that leftover
// scroll position satisfies the check often enough that Next just leaves
// the page wherever it was instead of resetting to top. Belt-and-suspenders
// override: force every route change to the very top, on every breakpoint.
//
// Runs as a useLayoutEffect (not useEffect) so it lands in the same commit
// as — and after — Next's internal scroll handler, which uses
// componentDidMount/componentDidUpdate timing on a component higher in the
// tree (children commit before parents). Mounted after `{children}` in
// app/layout.tsx for the same reason. No visible flash: it resolves before
// the browser paints, not after.
export function ScrollToTop() {
  const pathname = usePathname()

  // Stop the browser's own scroll restoration (e.g. on back/forward) from
  // racing this — it can otherwise re-apply a stale position after we've
  // already reset to top.
  useEffect(() => {
    const prev = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"
    return () => {
      window.history.scrollRestoration = prev
    }
  }, [])

  useLayoutEffect(() => {
    // Respect a real in-page anchor (none in use today, but don't fight one
    // if it shows up later) — only force-top when navigating to a plain URL.
    if (window.location.hash) return
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
