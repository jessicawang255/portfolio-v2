"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { footerRatio, applyFooterFade, resetFooterFade } from "./footerFade"
import { headerProgress, headerRadius, fadeOpacity, fadeScale } from "./headerFade"

// px — corner radius when header/footer is fully visible. Matches
// --radius-frame in globals.css: 20px on mobile, 36px from `sm` up.
const MOBILE_RADIUS  = 20
const DESKTOP_RADIUS = 36

// Must match the `sm:` breakpoint HeroShell.tsx/CaseStudyHero.tsx use to
// switch between fixed (peels from behind the frame) and static (normal
// flow), and the one --radius-frame in globals.css uses for its 20px/36px
// swap.
const DESKTOP_QUERY = "(min-width: 768px)"

type Props = {
  /** The card whose corners peel open as it slides toward the viewport top
   *  — #main-frame on Work/About, #cs-content on case study pages. */
  frameId: string
  /** The hero content that fades + scales as the frame covers it —
   *  #hero-content on Work/About, #cs-hero-content on case study pages. */
  heroId: string
  /** The hero's own outer fixed-position box, forced to `visibility: hidden`
   *  once the frame has fully covered it (`p >= 1` — see the check below).
   *  On Work/About this is the same element as `heroId` (a single box, no
   *  background/foreground split) — passed as its own prop rather than
   *  reused implicitly so the two concerns (continuous fade vs. the binary
   *  "fully covered, stop painting" cutoff) stay distinct even where they
   *  happen to share a target. Case studies split the two for real
   *  (CaseStudyHero.tsx/HeroForeground.tsx): `heroId` only covers the
   *  foreground image, which is what's meant to visibly fade + scale during
   *  a normal reveal, so the background — which never fades on its own —
   *  couldn't be reached through it otherwise. */
  heroFrameId?: string
}

// Drives every scroll-tied animation shared between a page's content frame,
// its hero, and #site-footer: the frame's own border-radius peel (top edge
// as it's covered, bottom edge as the footer is revealed beneath it), the
// hero's fade + scale as it's covered, and the footer's matching fade +
// scale as it's revealed. One instance per page type (Work/About vs. case
// studies), parameterized by which frame/hero elements it targets — see
// headerFade.ts and footerFade.ts for the actual reveal math, shared here so
// both instances can't drift out of timing sync with each other again.
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

      // Footer is only fixed from `sm` up (see Footer.tsx) — below that it's
      // in normal flow, sitting directly after the frame with no overlap, so
      // there's no space to reserve for it. The frame's bottom-corner radius
      // still peels open as the footer is scrolled into view either way (see
      // footerReveal below) — only the footer's own fade/scale and this
      // padding reservation are desktop-only.
      const maxRadius = mql.matches ? DESKTOP_RADIUS : MOBILE_RADIUS
      document.body.style.paddingBottom = mql.matches ? `${footer!.offsetHeight}px` : ""

      function applyRadius(y: number) {
        const el = document.getElementById(frameId) ?? frame!

        // Recomputed every frame rather than cached: a hero's spacer can
        // render at an SSR-approximated height and correct itself once its
        // own ResizeObserver measures the real height, which would
        // otherwise leave a stale offsetTop baked into a one-time snapshot.
        // offsetTop alone (no nav-height subtraction) is the scroll distance
        // needed to bring the frame's top to true viewport y=0 — see
        // headerProgress/headerRadius in headerFade.ts.
        const triggerAt = Math.max(el.offsetTop, 0)
        const p = headerProgress(y, triggerAt)
        const top = headerRadius(p, maxRadius)
        el.style.borderTopLeftRadius  = `${top}px`
        el.style.borderTopRightRadius = `${top}px`

        // footerH/footerAbsTop recomputed every frame for the same reason as
        // triggerAt above: the page's total scrollHeight can still grow
        // after mount (e.g. a hero spacer correcting an SSR approximation
        // further up the page), which would otherwise leave footerAbsTop
        // pinned to a stale, too-small value — compressing the footer's
        // reveal/fade/scale window into a barely-visible sliver right at the
        // very end of the scroll instead of its full natural range.
        // footerReveal drives the frame's own bottom-corner radius below,
        // which is wanted at every breakpoint (mirrors the top radius above,
        // which is also unconditional) — only gated by `mql.matches` inside
        // applyFooterFade itself, which is the mobile-desktop split for
        // #site-footer's *own* fade/scale, not the frame's radius.
        const footerH = footer!.offsetHeight
        const footerAbsTop = document.documentElement.scrollHeight - footerH
        // The reveal's own scroll distance is widened by REVEAL_EXTRA beyond
        // just footerH (ramp starts REVEAL_EXTRA px earlier, still finishes
        // exactly at the same scroll-to-bottom point — see footerRatio's
        // math, this only shifts where it *starts*) — footerH alone (a
        // typical footer's ~190px) is a sliver against a page that can run
        // several thousand px tall, easy to stop a scroll gesture in the
        // middle of and land on a half-peeled corner over a half-opaque
        // footer, exactly the "stuck mid-transition" look this widens away
        // from. Case studies with a shorter total page (e.g. a wide tablet
        // column with little text wrap) make that narrow window a bigger
        // fraction of the scrollable distance, so a normal scroll is more
        // likely to land inside it — this isn't tablet-specific in the math,
        // just easier to hit there.
        const REVEAL_EXTRA = 400
        const footerReveal = footerRatio(y, footerAbsTop - REVEAL_EXTRA, footerH + REVEAL_EXTRA, window.innerHeight)
        const bottom = footerReveal * maxRadius
        el.style.borderBottomLeftRadius  = `${bottom}px`
        el.style.borderBottomRightRadius = `${bottom}px`

        // Hero content fades + scales in step with the same header progress
        // as the radius above, but on its own ease curve (see headerFade.ts)
        // so the two motions can read slightly differently. transform-origin
        // is a plain "center top" set once where the hero element is
        // rendered — no shared viewport-anchor math needed, since this is
        // the only element being scaled (nav is deliberately excluded, and
        // stays static regardless of scroll).
        const heroEl = document.getElementById(heroId)
        if (heroEl) {
          heroEl.style.opacity = mql.matches ? `${fadeOpacity(p)}` : ""
          heroEl.style.transform = mql.matches ? `scale(${fadeScale(p)})` : ""
        }

        // p reaching 1 means the frame has fully covered the hero from the
        // top and — since headerProgress is monotonic in scrollY — stays at
        // 1 for the rest of the downward scroll, including the footer-
        // reveal window at the very bottom. That makes it the exact signal
        // for "the hero can never legitimately be visible again until the
        // user scrolls back up past this point": forcing visibility:hidden
        // here removes the hero from painting *and* hit-testing for that
        // whole span, so it can neither bleed its background over the
        // footer nor steal clicks meant for it on a short viewport where the
        // two would otherwise overlap (see CaseStudyHero.tsx) — cheaper than
        // unmounting (no remount cost scrolling back and forth near the
        // threshold) and than animating height (visibility doesn't trigger
        // reflow). Gated to `mql.matches` like the fade/scale above: below
        // `sm` the hero is `static`, not `fixed` — it scrolls away in normal
        // flow and can't overlap the footer this way regardless.
        if (heroFrameId) {
          const heroFrame = document.getElementById(heroFrameId)
          if (heroFrame) heroFrame.style.visibility = mql.matches && p >= 1 ? "hidden" : ""
        }

        // Same fade + scale, shared via footerFade.ts, so #site-footer —
        // which persists across every route since it's rendered once in the
        // root layout — looks identical everywhere, regardless of which
        // instance of this controller is currently active. Anchored on the
        // viewport's own horizontal center.
        const footerEl = document.getElementById("site-footer") ?? footer!
        applyFooterFade(footerEl, footerReveal, window.innerWidth / 2, mql.matches)
      }

      applyRadius(window.scrollY)

      // Batched to one rAF-scheduled update per frame instead of running
      // applyRadius synchronously on every native scroll event — Safari in
      // particular dispatches scroll events more densely than a frame budget
      // during momentum scrolling, so unbatched, the forced-layout reads +
      // multi-element style writes inside applyRadius run several times per
      // frame instead of once. Measured ~2x scroll frame time in WebKit vs
      // Chromium before this (see DotField Safari investigation).
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
      // #site-footer persists across every route (rendered once in the root
      // layout) — hand it back in a neutral state so a page that doesn't use
      // this controller instance doesn't inherit whatever fade/scale was
      // last applied here.
      resetFooterFade(footer!)
    }
    // frameId/heroId are constant per call site (each layout always passes
    // the same pair) but are included here for correctness. pathname is what
    // actually matters: it re-runs setup on every navigation, including
    // between two different case studies (a dynamic /work/[slug] route,
    // where the frame/hero measurements genuinely need to be re-taken).
  }, [pathname, frameId, heroId])

  return null
}
