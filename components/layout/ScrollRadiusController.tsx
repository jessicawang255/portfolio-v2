"use client"

import { useEffect } from "react"

const MAX_RADIUS = 36 // px — corner radius when header/footer is fully visible

function headerRatio(scrollY: number, headerH: number) {
  return Math.max(0, Math.min(1, 1 - scrollY / headerH))
}

function footerRatio(scrollY: number, footerAbsTop: number, footerH: number, winH: number) {
  return Math.max(0, Math.min(1, (scrollY + winH - footerAbsTop) / footerH))
}

function setRadius(
  el: HTMLElement,
  scrollY: number,
  headerH: number,
  footerAbsTop: number,
  footerH: number,
  winH: number
) {
  const top    = headerRatio(scrollY, headerH) * MAX_RADIUS
  const bottom = footerRatio(scrollY, footerAbsTop, footerH, winH) * MAX_RADIUS
  el.style.borderTopLeftRadius     = `${top}px`
  el.style.borderTopRightRadius    = `${top}px`
  el.style.borderBottomLeftRadius  = `${bottom}px`
  el.style.borderBottomRightRadius = `${bottom}px`
}

export function ScrollRadiusController() {
  useEffect(() => {
    const main   = document.getElementById("main-frame")
    const footer = document.getElementById("site-footer")
    if (!main || !footer) return

    const headerH = parseFloat(getComputedStyle(document.body).paddingTop) || 68
    const footerH = footer.offsetHeight

    // Footer is fixed (out of document flow). Add padding-bottom so the page
    // has enough scroll range to fully reveal the footer behind #main-frame.
    // mb-2 (8px) on #main-frame provides the same gap as the header side.
    document.body.style.paddingBottom = `${footerH}px`

    // Reading scrollHeight after the style mutation forces a reflow, so this
    // correctly reflects the new padding-bottom.
    // footerAbsTop is the virtual document position where the reveal begins:
    // scrollHeight - footerH  =  headerH + mainHeight + mb2  (the bottom of #main-frame)
    const footerAbsTop = document.documentElement.scrollHeight - footerH

    // Re-query on every event so a freshly-mounted #main-frame (after
    // client-side navigation back to home) is always the live target.
    function applyRadius(y: number) {
      const el = document.getElementById("main-frame") ?? main!
      setRadius(el, y, headerH, footerAbsTop, footerH, window.innerHeight)
    }

    applyRadius(window.scrollY)

    function onScroll() { applyRadius(window.scrollY) }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      document.body.style.paddingBottom = ""
    }
  }, [])

  return null
}
