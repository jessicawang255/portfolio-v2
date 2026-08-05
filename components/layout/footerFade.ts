// Shared footer fade/scale logic for #site-footer, used by every instance of
// ScrollRevealController (Work/About and case study pages alike).
// #site-footer is rendered once in the root layout and never unmounts
// between routes, so whichever instance is active must agree on exactly how
// it's styled — duplicating this logic per-instance is how it drifted out of
// sync before it was unified (case study pages never got the fade/scale at
// all, and neither instance reset it on cleanup, leaving stale opacity/
// transform stuck on it after navigating away).

const FADE_FLOOR = 0.05
const MIN_SCALE = 0.98
const FADE_EASE_POWER = 1
const SCALE_EASE_POWER = 1

function easeInReveal(p: number, power: number) {
  return 1 - p ** power
}

export function footerRatio(scrollY: number, footerAbsTop: number, footerH: number, winH: number) {
  return Math.max(0, Math.min(1, (scrollY + winH - footerAbsTop) / footerH))
}

// footerReveal: 0 = unrevealed (page top), 1 = fully revealed (scrolled to
// bottom) — see footerRatio above. anchorX: shared horizontal scale anchor,
// in viewport coordinates — the viewport's own horizontal center in
// practice, passed in by the caller rather than hardcoded here.
export function applyFooterFade(footerEl: HTMLElement, footerReveal: number, anchorX: number, desktop: boolean) {
  if (!desktop) {
    footerEl.style.opacity = ""
    footerEl.style.transform = ""
    return
  }

  const fadeRatio  = 1 - easeInReveal(footerReveal, FADE_EASE_POWER)
  const scaleRatio = 1 - easeInReveal(footerReveal, SCALE_EASE_POWER)
  const scale = MIN_SCALE + scaleRatio * (1 - MIN_SCALE)

  footerEl.style.opacity = `${FADE_FLOOR + fadeRatio * (1 - FADE_FLOOR)}`

  // Anchored at the bottom of the viewport (offsetTop/offsetLeft, not
  // getBoundingClientRect — see ScrollRevealController for why: transforms
  // don't affect layout-box measurements, so this stays drift-free across
  // repeated frames) so the footer scales in place from its own bottom edge
  // instead of receding toward a distant point.
  const originX = anchorX - footerEl.offsetLeft
  const originY = window.innerHeight - footerEl.offsetTop
  footerEl.style.transformOrigin = `${originX}px ${originY}px`
  footerEl.style.transform = `scale(${scale})`
}

// Reset #site-footer to its default appearance. Must be called from every
// ScrollRevealController instance's effect cleanup — since the footer
// persists across routes, whichever instance stops managing it (e.g.
// navigating from Work/About to a case study page) needs to hand it back in
// a neutral state rather than leaving it stuck mid-fade for the next
// instance to inherit.
export function resetFooterFade(footerEl: HTMLElement) {
  footerEl.style.opacity = ""
  footerEl.style.transform = ""
  footerEl.style.transformOrigin = ""
}
