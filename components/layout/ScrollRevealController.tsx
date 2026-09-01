"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { footerRatio, applyFooterFade, resetFooterFade } from "./footerFade"
import { headerProgress, headerRadius, fadeOpacity, fadeScale } from "./headerFade"

// px — corner radius when header/footer is fully visible. Matches
// --radius-frame in globals.css: 20px on mobile, 36px from `sm` up.
const MOBILE_RADIUS  = 20
const DESKTOP_RADIUS = 36

// Must match the `sm:` breakpoint HeroShell.tsx/CaseStudyHero.tsx/Footer.tsx
// use to switch between fixed (peels from behind the frame) and static
// (normal flow), and the one --radius-frame in globals.css uses for its
// 20px/36px swap.
const DESKTOP_QUERY = "(min-width: 640px)"

type Props = {
  /** The card whose corners peel open as it slides toward the viewport top
   *  — #main-frame on Work/About, #cs-content on case study pages. */
  frameId: string
  /** The hero content that fades + scales as the frame covers it —
   *  #hero-content on Work/About, #cs-hero-content on case study pages. */
  heroId: string
  /** The hero's own outer fixed-position box, forced to `visibility: hidden`
   *  once the frame has fully covered it (`p >= 1`, see below). On Work/About
   *  this is the same element as `heroId`. Case studies split the two:
   *  `heroId` covers only the foreground image, which is what fades + scales,
   *  while `heroFrameId` covers the background, which never fades on its own. */
  heroFrameId?: string
}

// Drives every scroll-tied animation shared between a page's content frame,
// its hero, and #site-footer: the frame's own border-radius peel (top edge
// as it's covered, bottom edge as the footer is revealed beneath it), the
// hero's fade + scale as it's covered, and the footer's matching fade +
// scale as it's revealed. One instance per page type (Work/About vs. case
// studies), parameterized by which frame/hero elements it targets — see
// headerFade.ts and footerFade.ts for the actual reveal math.
export function ScrollRevealController({ frameId, heroId, heroFrameId }: Props) {
  const pathname = usePathname()

  useEffect(() => {
    const frame  = document.getElementById(frameId)
    const footer = document.getElementById("site-footer")
    if (!frame || !footer) return

    const mql = window.matchMedia(DESKTOP_QUERY)

    let cleanupScroll = () => {}

    // Re-run whenever the fixed/static breakpoint is crossed (resize, rotation)
    // so the footer math never goes stale relative to Footer.tsx's own layout.
    function setup() {
      cleanupScroll()

      // Footer is only fixed from `sm` up — below that it's in normal flow
      // with no overlap to reserve padding for.
      const maxRadius = mql.matches ? DESKTOP_RADIUS : MOBILE_RADIUS
      document.body.style.paddingBottom = mql.matches ? `${footer!.offsetHeight}px` : ""

      function applyRadius(y: number) {
        const el = document.getElementById(frameId) ?? frame!

        // Recomputed every frame rather than cached: a hero's spacer can
        // correct its SSR-approximated height once its own ResizeObserver
        // measures the real one, which would otherwise leave offsetTop
        // stale. offsetTop alone is the scroll distance needed to bring the
        // frame's top to viewport y=0 — see headerProgress in headerFade.ts.
        const triggerAt = Math.max(el.offsetTop, 0)
        const p = headerProgress(y, triggerAt)
        const top = headerRadius(p, maxRadius)
        el.style.borderTopLeftRadius  = `${top}px`
        el.style.borderTopRightRadius = `${top}px`

        // footerH/footerAbsTop recomputed every frame for the same reason as
        // triggerAt above: total scrollHeight can still grow after mount,
        // which would otherwise pin footerAbsTop to a stale, too-small value.
        const footerH = footer!.offsetHeight
        const footerAbsTop = document.documentElement.scrollHeight - footerH
        // Widens the reveal's scroll distance beyond just footerH (ramp
        // starts REVEAL_EXTRA px earlier, still finishes at the same
        // scroll-to-bottom point) — footerH alone is a narrow window,
        // easy to stop a scroll gesture inside and land on a half-peeled,
        // half-opaque footer.
        const REVEAL_EXTRA = 400
        const footerReveal = footerRatio(y, footerAbsTop - REVEAL_EXTRA, footerH + REVEAL_EXTRA, window.innerHeight)
        const bottom = footerReveal * maxRadius
        el.style.borderBottomLeftRadius  = `${bottom}px`
        el.style.borderBottomRightRadius = `${bottom}px`

        // Hero content fades + scales in step with the same header progress
        // as the radius above, but on its own ease curve (see headerFade.ts).
        const heroEl = document.getElementById(heroId)
        if (heroEl) {
          heroEl.style.opacity = mql.matches ? `${fadeOpacity(p)}` : ""
          heroEl.style.transform = mql.matches ? `scale(${fadeScale(p)})` : ""
        }

        // p reaching 1 means the frame has fully covered the hero and (since
        // headerProgress is monotonic in scrollY) stays at 1 for the rest of
        // the scroll, so it's a safe signal to hide the hero entirely —
        // removing it from painting and hit-testing so it can't bleed its
        // background over the footer or steal clicks on a short viewport
        // where the two overlap (see CaseStudyHero.tsx).
        if (heroFrameId) {
          const heroFrame = document.getElementById(heroFrameId)
          if (heroFrame) heroFrame.style.visibility = mql.matches && p >= 1 ? "hidden" : ""
        }

        // Shared via footerFade.ts so #site-footer looks identical
        // regardless of which controller instance is active.
        const footerEl = document.getElementById("site-footer") ?? footer!
        applyFooterFade(footerEl, footerReveal, window.innerWidth / 2, mql.matches)
      }

      applyRadius(window.scrollY)

      // Batched to one rAF-scheduled update per frame instead of running
      // applyRadius synchronously on every native scroll event — Safari
      // dispatches scroll events more densely than a frame budget during
      // momentum scrolling.
      let scrollRafId = 0
      function onScroll() {
        if (scrollRafId) return
        scrollRafId = requestAnimationFrame(() => {
          scrollRafId = 0
          applyRadius(window.scrollY)
        })
      }
      window.addEventListener("scroll", onScroll, { passive: true })
      cleanupScroll = () => {
        window.removeEventListener("scroll", onScroll)
        cancelAnimationFrame(scrollRafId)
      }
    }

    setup()
    mql.addEventListener("change", setup)

    return () => {
      mql.removeEventListener("change", setup)
      cleanupScroll()
      document.body.style.paddingBottom = ""
      // #site-footer persists across every route — hand it back to a
      // neutral state for whichever instance takes over next.
      resetFooterFade(footer!)
    }
    // pathname re-runs setup on every navigation, including between two
    // different case studies, where the frame/hero measurements need
    // retaking.
  }, [pathname, frameId, heroId, heroFrameId])

  return null
}
