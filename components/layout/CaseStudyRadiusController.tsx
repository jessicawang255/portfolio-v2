"use client"

import { useEffect } from "react"

const MAX_RADIUS = 36 // matches ScrollRadiusController on home page

function headerRatio(scrollY: number, headerH: number) {
  return Math.max(0, Math.min(1, 1 - scrollY / headerH))
}

function footerRatio(scrollY: number, footerAbsTop: number, footerH: number, winH: number) {
  return Math.max(0, Math.min(1, (scrollY + winH - footerAbsTop) / footerH))
}

export function CaseStudyRadiusController() {
  useEffect(() => {
    const hero    = document.getElementById("cs-hero")
    const content = document.getElementById("cs-content")
    const footer  = document.getElementById("site-footer")
    if (!hero || !content || !footer) return

    const headerH = parseFloat(getComputedStyle(document.body).paddingTop) || 56
    const footerH = footer.offsetHeight

    // Same technique as ScrollRadiusController: add body padding so the page
    // has enough scroll range to fully reveal the fixed footer.
    document.body.style.paddingBottom = `${footerH}px`

    // Reading scrollHeight after the mutation forces a reflow so we get the
    // updated value (same pattern as the home-page controller).
    const footerAbsTop = document.documentElement.scrollHeight - footerH

    function update(scrollY: number) {
      const top    = headerRatio(scrollY, headerH) * MAX_RADIUS
      const bottom = footerRatio(scrollY, footerAbsTop, footerH, window.innerHeight) * MAX_RADIUS

      // Hero: only top corners animate (bottom corners stay rounded, set by CSS)
      hero!.style.borderTopLeftRadius  = `${top}px`
      hero!.style.borderTopRightRadius = `${top}px`

      // Content card: only bottom corners animate (top corners stay rounded, set by CSS)
      content!.style.borderBottomLeftRadius  = `${bottom}px`
      content!.style.borderBottomRightRadius = `${bottom}px`
    }

    update(window.scrollY)

    function onScroll() { update(window.scrollY) }
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return null
}
