// Shared footer fade/scale logic for #site-footer, used by every instance of
// ScrollRevealController (Work/About and case study pages alike).
// #site-footer is rendered once in the root layout and never unmounts
// between routes, so whichever instance is active must agree on exactly how
// it's styled.

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
// bottom). anchorX: shared horizontal scale anchor, in viewport coordinates.
export function applyFooterFade(footerEl: HTMLElement, footerReveal: number, anchorX: number, desktop: boolean) {
  if (!desktop) {
    footerEl.style.opacity = ""
    footerEl.style.transform = ""
    footerEl.style.visibility = ""
    return
  }

  // FADE_FLOOR below only ever fades the footer to 5% opacity, not 0 — on a
  // short viewport where the footer's fixed box overlaps the hero, that
  // reads as a visible ghost image rather than a hint of what's coming while
  // footerReveal is still at exactly 0. visibility:hidden removes it from
  // paint for that span, restored the instant footerReveal ticks up.
  footerEl.style.visibility = footerReveal > 0 ? "" : "hidden"

  const fadeRatio  = 1 - easeInReveal(footerReveal, FADE_EASE_POWER)
  const scaleRatio = 1 - easeInReveal(footerReveal, SCALE_EASE_POWER)
  const scale = MIN_SCALE + scaleRatio * (1 - MIN_SCALE)

  footerEl.style.opacity = `${FADE_FLOOR + fadeRatio * (1 - FADE_FLOOR)}`

  // offsetTop/offsetLeft, not getBoundingClientRect: transforms don't affect
  // layout-box measurements, so this stays drift-free across repeated frames.
  const originX = anchorX - footerEl.offsetLeft
  const originY = window.innerHeight - footerEl.offsetTop
  footerEl.style.transformOrigin = `${originX}px ${originY}px`
  footerEl.style.transform = `scale(${scale})`
}

// Reset #site-footer to its default appearance. Must be called from every
// ScrollRevealController instance's effect cleanup, since the footer
// persists across routes and would otherwise stay stuck mid-fade.
export function resetFooterFade(footerEl: HTMLElement) {
  footerEl.style.opacity = ""
  footerEl.style.transform = ""
  footerEl.style.transformOrigin = ""
  footerEl.style.visibility = ""
}
