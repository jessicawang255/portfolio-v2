"use client"

import { useEffect } from "react"

const MAX_RADIUS = 36 // matches --radius-frame in globals.css

// Must match the `sm:` breakpoint Footer.tsx/CaseStudyLayout.tsx use to switch
// between fixed (peels from behind #cs-content) and static (normal flow).
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

      // Below `sm`, Footer.tsx is a normal in-flow element, not fixed — there's
      // nothing behind #cs-content to reveal, so skip the padding-bottom hack
      // and leave the bottom corners flat.
      const footerFixed = mql.matches
      const footerH      = footer!.offsetHeight
      document.body.style.paddingBottom = footerFixed ? `${footerH}px` : ""
      const footerAbsTop = document.documentElement.scrollHeight - footerH

      function update() {
        const scrollY = window.scrollY

        // Top corners: peel starts when card top touches nav bottom (contentTop = navH),
        // finishes MAX_RADIUS pixels later as card slides under nav.
        const contentTop = content!.getBoundingClientRect().top
        const topRadius  = Math.max(0, Math.min(MAX_RADIUS, contentTop - navH + MAX_RADIUS))
        content!.style.borderTopLeftRadius  = `${topRadius}px`
        content!.style.borderTopRightRadius = `${topRadius}px`

        if (footerFixed) {
          const botRadius = footerRatio(scrollY, footerAbsTop, footerH, window.innerHeight) * MAX_RADIUS
          content!.style.borderBottomLeftRadius  = `${botRadius}px`
          content!.style.borderBottomRightRadius = `${botRadius}px`
        } else {
          content!.style.borderBottomLeftRadius  = ""
          content!.style.borderBottomRightRadius = ""
        }
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
