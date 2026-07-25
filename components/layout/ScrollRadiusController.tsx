"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

// px — corner radius when header/footer is fully visible. Matches
// --radius-frame in globals.css: 20px on mobile, 36px from `sm` up.
const MOBILE_RADIUS  = 20
const DESKTOP_RADIUS = 36

// Must match the `sm:` breakpoint HeroShell.tsx uses to switch between fixed
// (peels from behind #main-frame) and static (normal flow), and the one
// --radius-frame in globals.css uses for its 20px/36px swap.
const DESKTOP_QUERY = "(min-width: 640px)"

// Animation starts only once the frame's top edge reaches the nav bottom.
// triggerAt = scroll distance required to bring #main-frame to the nav.
// After that, the radius collapses over maxRadius pixels of additional scroll.
function headerRatio(scrollY: number, triggerAt: number, maxRadius: number) {
  return Math.max(0, Math.min(1, 1 - (scrollY - triggerAt) / maxRadius))
}

function footerRatio(scrollY: number, footerAbsTop: number, footerH: number, winH: number) {
  return Math.max(0, Math.min(1, (scrollY + winH - footerAbsTop) / footerH))
}

export function ScrollRadiusController() {
  const pathname = usePathname()

  useEffect(() => {
    const main   = document.getElementById("main-frame")
    const footer = document.getElementById("site-footer")
    if (!main || !footer) return

    const navH = parseFloat(getComputedStyle(document.body).paddingTop) || 56
    const mql  = window.matchMedia(DESKTOP_QUERY)

    let cleanupScroll = () => {}

    // Re-run whenever the fixed/static breakpoint is crossed (resize, rotation)
    // so the footer math never goes stale relative to Footer.tsx's own layout.
    function setup() {
      cleanupScroll()

      // triggerAt = scroll distance needed to bring #main-frame's top edge to
      // the nav bottom. On the home page this equals the sticky hero height;
      // on other pages main.offsetTop ≈ navH so triggerAt ≈ 0 and the corners
      // collapse immediately over the first MAX_RADIUS pixels of scroll.
      const triggerAt = Math.max(main!.offsetTop - navH, 0)

      // Footer is fixed at every breakpoint, so it always needs the
      // padding-bottom reservation to make room for its reveal.
      const maxRadius     = mql.matches ? DESKTOP_RADIUS : MOBILE_RADIUS
      const footerH       = footer!.offsetHeight
      document.body.style.paddingBottom = `${footerH}px`
      const footerAbsTop  = document.documentElement.scrollHeight - footerH

      function applyRadius(y: number) {
        const el  = document.getElementById("main-frame") ?? main!
        const top = headerRatio(y, triggerAt, maxRadius) * maxRadius
        el.style.borderTopLeftRadius  = `${top}px`
        el.style.borderTopRightRadius = `${top}px`

        const bottom = footerRatio(y, footerAbsTop, footerH, window.innerHeight) * maxRadius
        el.style.borderBottomLeftRadius  = `${bottom}px`
        el.style.borderBottomRightRadius = `${bottom}px`
      }

      applyRadius(window.scrollY)

      function onScroll() { applyRadius(window.scrollY) }
      window.addEventListener("scroll", onScroll, { passive: true })
      cleanupScroll = () => window.removeEventListener("scroll", onScroll)
    }

    setup()
    mql.addEventListener("change", setup)

    return () => {
      mql.removeEventListener("change", setup)
      cleanupScroll()
      document.body.style.paddingBottom = ""
    }
  }, [pathname])

  return null
}
