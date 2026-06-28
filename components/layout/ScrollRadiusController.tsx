"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const MAX_RADIUS = 36 // px — corner radius when header/footer is fully visible

// Animation starts only once the frame's top edge reaches the nav bottom.
// triggerAt = scroll distance required to bring #main-frame to the nav.
// After that, the radius collapses over MAX_RADIUS pixels of additional scroll.
function headerRatio(scrollY: number, triggerAt: number) {
  return Math.max(0, Math.min(1, 1 - (scrollY - triggerAt) / MAX_RADIUS))
}

function footerRatio(scrollY: number, footerAbsTop: number, footerH: number, winH: number) {
  return Math.max(0, Math.min(1, (scrollY + winH - footerAbsTop) / footerH))
}

function setRadius(
  el: HTMLElement,
  scrollY: number,
  triggerAt: number,
  footerAbsTop: number,
  footerH: number,
  winH: number
) {
  const top    = headerRatio(scrollY, triggerAt) * MAX_RADIUS
  const bottom = footerRatio(scrollY, footerAbsTop, footerH, winH) * MAX_RADIUS
  el.style.borderTopLeftRadius     = `${top}px`
  el.style.borderTopRightRadius    = `${top}px`
  el.style.borderBottomLeftRadius  = `${bottom}px`
  el.style.borderBottomRightRadius = `${bottom}px`
}

export function ScrollRadiusController() {
  const pathname = usePathname()

  useEffect(() => {
    const main   = document.getElementById("main-frame")
    const footer = document.getElementById("site-footer")
    if (!main || !footer) return

    // triggerAt = scroll distance needed to bring #main-frame's top edge to
    // the nav bottom. On the home page this equals the sticky hero height;
    // on other pages main.offsetTop ≈ navH so triggerAt ≈ 0 and the corners
    // collapse immediately over the first MAX_RADIUS pixels of scroll.
    const navH     = parseFloat(getComputedStyle(document.body).paddingTop) || 56
    const triggerAt = Math.max(main.offsetTop - navH, 0)
    const footerH  = footer.offsetHeight

    // Footer is fixed (out of document flow). Add padding-bottom so the page
    // has enough scroll range to fully reveal the footer behind #main-frame.
    document.body.style.paddingBottom = `${footerH}px`

    const footerAbsTop = document.documentElement.scrollHeight - footerH

    function applyRadius(y: number) {
      const el = document.getElementById("main-frame") ?? main!
      setRadius(el, y, triggerAt, footerAbsTop, footerH, window.innerHeight)
    }

    applyRadius(window.scrollY)

    function onScroll() { applyRadius(window.scrollY) }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      document.body.style.paddingBottom = ""
    }
  }, [pathname])

  return null
}
