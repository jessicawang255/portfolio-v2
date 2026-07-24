"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const MAX_RADIUS = 36 // px — corner radius when header/footer is fully visible

// Must match the `sm:` breakpoint Footer.tsx/HeroShell.tsx use to switch
// between fixed (peels from behind #main-frame) and static (normal flow).
const DESKTOP_QUERY = "(min-width: 640px)"

// Animation starts only once the frame's top edge reaches the nav bottom.
// triggerAt = scroll distance required to bring #main-frame to the nav.
// After that, the radius collapses over MAX_RADIUS pixels of additional scroll.
function headerRatio(scrollY: number, triggerAt: number) {
  return Math.max(0, Math.min(1, 1 - (scrollY - triggerAt) / MAX_RADIUS))
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

      // Below `sm`, Footer.tsx is a normal in-flow element, not fixed — there's
      // nothing behind #main-frame to reveal, so skip the padding-bottom hack
      // and leave the bottom corners flat.
      const footerFixed = mql.matches
      const footerH      = footer!.offsetHeight
      document.body.style.paddingBottom = footerFixed ? `${footerH}px` : ""
      const footerAbsTop = document.documentElement.scrollHeight - footerH

      function applyRadius(y: number) {
        const el  = document.getElementById("main-frame") ?? main!
        const top = headerRatio(y, triggerAt) * MAX_RADIUS
        el.style.borderTopLeftRadius  = `${top}px`
        el.style.borderTopRightRadius = `${top}px`

        if (footerFixed) {
          const bottom = footerRatio(y, footerAbsTop, footerH, window.innerHeight) * MAX_RADIUS
          el.style.borderBottomLeftRadius  = `${bottom}px`
          el.style.borderBottomRightRadius = `${bottom}px`
        } else {
          el.style.borderBottomLeftRadius  = ""
          el.style.borderBottomRightRadius = ""
        }
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
