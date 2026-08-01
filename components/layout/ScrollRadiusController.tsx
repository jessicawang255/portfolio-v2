"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

// px — corner radius when header/footer is fully visible. Matches
// --radius-frame in globals.css: 20px on mobile, 36px from `sm` up.
const MOBILE_RADIUS  = 20
const DESKTOP_RADIUS = 36

// Minimum opacity #hero-content and #site-nav fade to once fully covered by
// #main-frame — never disappears completely. Desktop only: on mobile the
// hero sits in normal static flow (see HeroShell.tsx) and has typically
// already scrolled out of view by the time this trigger fires, so fading it
// there would have no visible effect (and the nav itself isn't rendered on
// mobile at all — see Nav.tsx).
const FADE_FLOOR = 0.1

// Scale #hero-content/#site-nav/#site-footer shrink to once fully hidden —
// anchored at the top/bottom of the viewport respectively (see applyRadius).
const MIN_SCALE = 0.99

// Elements that fade + scale in step with the header reveal ratio, alongside
// the border-radius above.
const FADE_TARGET_IDS = ["hero-content", "site-nav"]

// Must match the `sm:` breakpoint HeroShell.tsx uses to switch between fixed
// (peels from behind #main-frame) and static (normal flow), and the one
// --radius-frame in globals.css uses for its 20px/36px swap.
const DESKTOP_QUERY = "(min-width: 640px)"

// Ease-in powers for the three header-side animations. Higher = stays
// flatter for longer before collapsing quickly near the end (see
// easeInReveal below). Kept separate so the radius, fade, and scale can each
// diverge — e.g. the fade reading as more linear than the radius/scale snap.
const RADIUS_EASE_POWER = 3
const FADE_EASE_POWER   = 1
const SCALE_EASE_POWER  = 2

// Raw scroll progress from the moment the page starts scrolling (scrollY =
// 0, #main-frame at its resting position, p = 0) until its top edge reaches
// the true top of the viewport (scrollY = triggerAt, p = 1) — the point at
// which #main-frame (z-10) has fully painted over #site-nav and
// #hero-content (both z-2), which live in that same covered region, not
// above it. Since triggerAt is the per-page distance to that point, the
// animation rate naturally differs between pages with taller vs. shorter
// heroes.
function headerProgress(scrollY: number, triggerAt: number) {
  if (triggerAt <= 0) return 1
  return Math.max(0, Math.min(1, scrollY / triggerAt))
}

// Reveal ratio (1 = fully visible/rounded, 0 = fully covered/square) for a
// given ease-in power, applied to the raw progress above. This is driven
// purely by scroll position, not direction, so scrolling back up retraces
// the exact same curve in reverse — fast right as the frame pulls back from
// the top, slowing to a stop as it returns to rest — with no separate
// up/down logic.
function easeInReveal(p: number, power: number) {
  return 1 - p ** power
}

function footerRatio(scrollY: number, footerAbsTop: number, footerH: number, winH: number) {
  return Math.max(0, Math.min(1, (scrollY + winH - footerAbsTop) / footerH))
}

// Layout-box position/size for a `position: fixed` element, in viewport
// coordinates. Deliberately not getBoundingClientRect(): that reflects the
// box *after* any CSS transform is applied, so reading it back once we're
// writing a scale() transform every frame would measure last frame's
// already-scaled box and compound into drift. offsetTop/offsetLeft are pure
// layout measurements that transforms never touch, and for fixed-position
// elements they're already viewport-relative.
function fixedRect(el: HTMLElement) {
  return { top: el.offsetTop, left: el.offsetLeft, width: el.offsetWidth, height: el.offsetHeight }
}

// transform-origin, as a px offset from `el`'s own top-left, that lands on
// `center` — a shared viewport point computed from a *different* element.
// This is how #site-nav and #site-footer can appear to scale from the
// hero's center even though they're unrelated DOM nodes with no common
// parent to anchor a single shared transform on.
function originTowards(el: HTMLElement, center: { x: number; y: number }) {
  const rect = fixedRect(el)
  return `${center.x - rect.left}px ${center.y - rect.top}px`
}

export function ScrollRadiusController() {
  const pathname = usePathname()

  useEffect(() => {
    const main   = document.getElementById("main-frame")
    const footer = document.getElementById("site-footer")
    if (!main || !footer) return

    const mql = window.matchMedia(DESKTOP_QUERY)

    let cleanupScroll = () => {}

    // Re-run whenever the fixed/static breakpoint is crossed (resize, rotation)
    // so the footer math never goes stale relative to Footer.tsx's own layout.
    function setup() {
      cleanupScroll()

      // Footer is only fixed from `sm` up (see Footer.tsx) — below that it's
      // in normal flow, so there's nothing to reveal and no space to reserve.
      const maxRadius = mql.matches ? DESKTOP_RADIUS : MOBILE_RADIUS
      document.body.style.paddingBottom = mql.matches ? `${footer!.offsetHeight}px` : ""

      function applyRadius(y: number) {
        const el  = document.getElementById("main-frame") ?? main!

        // Recomputed every frame rather than cached: HeroShell's spacer
        // renders at an SSR-approximated height and corrects itself once its
        // own ResizeObserver measures the real hero height, which would
        // otherwise leave a stale offsetTop baked into a one-time snapshot.
        // offsetTop alone (no nav-height subtraction) is the scroll distance
        // needed to bring the frame's top to true viewport y=0 — see
        // headerProgress above.
        const triggerAt = Math.max(el.offsetTop, 0)
        const p = headerProgress(y, triggerAt)
        const radiusRatio = easeInReveal(p, RADIUS_EASE_POWER)
        const top = radiusRatio * maxRadius
        el.style.borderTopLeftRadius  = `${top}px`
        el.style.borderTopRightRadius = `${top}px`

        // footerH/footerAbsTop recomputed every frame for the same reason as
        // triggerAt above: the page's total scrollHeight can still grow
        // after mount (e.g. a hero spacer correcting an SSR approximation
        // further up the page), which would otherwise leave footerAbsTop
        // pinned to a stale, too-small value — compressing the footer's
        // reveal/fade/scale window into a barely-visible sliver right at the
        // very end of the scroll instead of its full natural range.
        const footerH = footer!.offsetHeight
        const footerAbsTop = document.documentElement.scrollHeight - footerH
        const footerReveal = mql.matches
          ? footerRatio(y, footerAbsTop, footerH, window.innerHeight)
          : 0
        const bottom = footerReveal * maxRadius
        el.style.borderBottomLeftRadius  = `${bottom}px`
        el.style.borderBottomRightRadius = `${bottom}px`

        // Hero content and the nav fade + scale in step with the same header
        // progress as the radius above, but on their own ease curve (see
        // FADE_EASE_POWER) so the two motions can read slightly differently.
        // Scale is anchored at the top of the viewport (not each element's
        // own center — see originTowards), horizontally centered on the
        // hero, so nav — which already sits at the top — visually scales in
        // place without shifting vertically, instead of receding toward a
        // point below it. The footer mirrors this at the bottom of the
        // viewport for the same reason.
        const heroCenterEl = document.getElementById("hero-content")
        const anchorX = mql.matches && heroCenterEl
          ? (() => {
              const r = fixedRect(heroCenterEl)
              return r.left + r.width / 2
            })()
          : null
        const headerAnchor = anchorX !== null ? { x: anchorX, y: 0 } : null
        const footerAnchor = anchorX !== null ? { x: anchorX, y: window.innerHeight } : null

        const fadeRatio = easeInReveal(p, FADE_EASE_POWER)
        const fadeOpacity = mql.matches
          ? `${FADE_FLOOR + fadeRatio * (1 - FADE_FLOOR)}`
          : ""
        const scaleRatio = easeInReveal(p, SCALE_EASE_POWER)
        const fadeScale = MIN_SCALE + scaleRatio * (1 - MIN_SCALE)
        for (const id of FADE_TARGET_IDS) {
          const target = document.getElementById(id)
          if (!target) continue
          target.style.opacity = fadeOpacity
          if (headerAnchor) {
            target.style.transformOrigin = originTowards(target, headerAnchor)
            target.style.transform = `scale(${fadeScale})`
          } else {
            target.style.transform = ""
          }
        }

        // Same fade + scale logic, mirrored for the footer: it fades/grows
        // IN as it's revealed beneath #main-frame's bottom corners instead
        // of OUT as the header is covered. 1 - easeInReveal(x, power) =
        // x^power — the same ease-in shape (slow start, fast finish) but for
        // a value growing 0→1 as scroll approaches the bottom, rather than
        // one shrinking 1→0 as scroll approaches the top. Anchored at the
        // bottom of the viewport (footerAnchor above) so the footer — which
        // already sits at the bottom — scales in place too.
        const footerFadeRatio = 1 - easeInReveal(footerReveal, FADE_EASE_POWER)
        const footerScaleRatio = 1 - easeInReveal(footerReveal, SCALE_EASE_POWER)
        const footerFadeScale = MIN_SCALE + footerScaleRatio * (1 - MIN_SCALE)
        const footerEl = document.getElementById("site-footer") ?? footer!
        footerEl.style.opacity = mql.matches
          ? `${FADE_FLOOR + footerFadeRatio * (1 - FADE_FLOOR)}`
          : ""
        if (footerAnchor) {
          footerEl.style.transformOrigin = originTowards(footerEl, footerAnchor)
          footerEl.style.transform = `scale(${footerFadeScale})`
        } else {
          footerEl.style.transform = ""
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
