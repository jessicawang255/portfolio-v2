"use client"

import { useEffect } from "react"

const MAX_RADIUS = 48 // matches --radius-frame in globals.css

function headerRatio(scrollY: number, headerH: number) {
  return Math.max(0, Math.min(1, 1 - scrollY / headerH))
}

function footerRatio(scrollY: number, footerAbsTop: number, footerH: number, winH: number) {
  return Math.max(0, Math.min(1, (scrollY + winH - footerAbsTop) / footerH))
}

// 1 = full radius, 0 = flat; transitions over MAX_RADIUS px as content top meets y=0.
// The nav is z-0 (behind main), so the visual top of the viewport is y=0, not the nav bottom.
function contentTopRatio(viewportTop: number) {
  return Math.max(0, Math.min(1, viewportTop / MAX_RADIUS))
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
      const top        = headerRatio(scrollY, headerH) * MAX_RADIUS
      const bottom     = footerRatio(scrollY, footerAbsTop, footerH, window.innerHeight) * MAX_RADIUS
      const contentTop = contentTopRatio(content!.getBoundingClientRect().top) * MAX_RADIUS

      // Hero: only top corners animate (bottom corners stay rounded, set by CSS)
      hero!.style.borderTopLeftRadius  = `${top}px`
      hero!.style.borderTopRightRadius = `${top}px`

      // Content card top corners: 48px → 0 as content top meets the viewport top (y=0)
      content!.style.borderTopLeftRadius  = `${contentTop}px`
      content!.style.borderTopRightRadius = `${contentTop}px`

      // Content card bottom corners: 0 → 48px as footer comes into view
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
