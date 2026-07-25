"use client"

import { useEffect } from "react"

// Matches --radius-frame in globals.css: 20px on mobile, 36px from `sm` up.
const MOBILE_RADIUS  = 20
const DESKTOP_RADIUS = 36

// Matches the `sm:` breakpoint --radius-frame in globals.css uses for its
// 20px/36px swap.
const DESKTOP_QUERY = "(min-width: 640px)"

function footerRatio(scrollY: number, footerAbsTop: number, footerH: number, winH: number) {
  return Math.max(0, Math.min(1, (scrollY + winH - footerAbsTop) / footerH))
}

export function CaseStudyRadiusController() {
  useEffect(() => {
    const content = document.getElementById("cs-content")
    const footer  = document.getElementById("site-footer")
    if (!content || !footer) return

    const navH = parseFloat(getComputedStyle(document.body).paddingTop) || 56
    const mql  = window.matchMedia(DESKTOP_QUERY)

    let cleanupScroll = () => {}

    // Re-run whenever the fixed/static breakpoint is crossed (resize, rotation)
    // so the footer math never goes stale relative to Footer.tsx's own layout.
    function setup() {
      cleanupScroll()

      // Footer is fixed at every breakpoint, so it always needs the
      // padding-bottom reservation to make room for its reveal.
      const maxRadius     = mql.matches ? DESKTOP_RADIUS : MOBILE_RADIUS
      const footerH       = footer!.offsetHeight
      document.body.style.paddingBottom = `${footerH}px`
      const footerAbsTop  = document.documentElement.scrollHeight - footerH

      function update() {
        const scrollY = window.scrollY

        // Top corners: peel starts when card top touches nav bottom (contentTop = navH),
        // finishes maxRadius pixels later as card slides under nav.
        const contentTop = content!.getBoundingClientRect().top
        const topRadius  = Math.max(0, Math.min(maxRadius, contentTop - navH + maxRadius))
        content!.style.borderTopLeftRadius  = `${topRadius}px`
        content!.style.borderTopRightRadius = `${topRadius}px`

        const botRadius = footerRatio(scrollY, footerAbsTop, footerH, window.innerHeight) * maxRadius
        content!.style.borderBottomLeftRadius  = `${botRadius}px`
        content!.style.borderBottomRightRadius = `${botRadius}px`
      }

      update()
      window.addEventListener("scroll", update, { passive: true })
      cleanupScroll = () => window.removeEventListener("scroll", update)
    }

    setup()
    mql.addEventListener("change", setup)

    return () => {
      mql.removeEventListener("change", setup)
      cleanupScroll()
      document.body.style.paddingBottom = ""
    }
  }, [])

  return null
}
