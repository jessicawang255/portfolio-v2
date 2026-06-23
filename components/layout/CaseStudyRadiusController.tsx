"use client"

import { useEffect } from "react"

const MAX_RADIUS = 36 // matches --radius-frame in globals.css

function footerRatio(scrollY: number, footerAbsTop: number, footerH: number, winH: number) {
  return Math.max(0, Math.min(1, (scrollY + winH - footerAbsTop) / footerH))
}

export function CaseStudyRadiusController() {
  useEffect(() => {
    const content = document.getElementById("cs-content")
    const footer  = document.getElementById("site-footer")
    if (!content || !footer) return

    const footerH = footer.offsetHeight
    document.body.style.paddingBottom = `${footerH}px`
    const footerAbsTop = document.documentElement.scrollHeight - footerH

    function update() {
      const scrollY = window.scrollY

      // Top corners: shrink to 0 as content card reaches the viewport top.
      // getBoundingClientRect().top gives exact pixel distance from viewport top.
      const contentTop = content!.getBoundingClientRect().top
      const topRadius  = Math.max(0, Math.min(MAX_RADIUS, contentTop))

      // Bottom corners: grow as fixed footer comes into view behind the card.
      const botRadius = footerRatio(scrollY, footerAbsTop, footerH, window.innerHeight) * MAX_RADIUS

      content!.style.borderTopLeftRadius    = `${topRadius}px`
      content!.style.borderTopRightRadius   = `${topRadius}px`
      content!.style.borderBottomLeftRadius  = `${botRadius}px`
      content!.style.borderBottomRightRadius = `${botRadius}px`
    }

    update()
    window.addEventListener("scroll", update, { passive: true })

    return () => {
      window.removeEventListener("scroll", update)
      document.body.style.paddingBottom = ""
    }
  }, [])

  return null
}
