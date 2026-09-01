"use client"

import { useEffect, useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

// Next's own scroll-to-top-on-navigate heuristic can be skipped if the
// previous page's leftover scroll position happens to still satisfy its
// check (e.g. on About, where #hero-content is `static` rather than `fixed`
// on mobile). This forces every route change to the top regardless.
//
// Runs as useLayoutEffect, mounted after `{children}` in app/layout.tsx, so
// it commits after Next's internal scroll handler and resolves before paint
// (no visible flash).
export function ScrollToTop() {
  const pathname = usePathname()

  // Prevent the browser's own scroll restoration (e.g. back/forward) from
  // racing this and re-applying a stale position.
  useEffect(() => {
    const prev = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"
    return () => {
      window.history.scrollRestoration = prev
    }
  }, [])

  useLayoutEffect(() => {
    // Don't force-top over a real in-page anchor.
    if (window.location.hash) return
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
