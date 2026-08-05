// Shared header-side reveal math, used by both instances of
// ScrollRevealController (Work/About's #hero-content, case studies'
// #cs-hero-content). The curve and floor/ceiling values are identical
// everywhere; each instance applies them to its own hero element via a
// plain CSS transform-origin, since each only ever has one target.

export const FADE_FLOOR = 0.05
export const MIN_SCALE = 0.98
export const FADE_EASE_POWER = 1
export const SCALE_EASE_POWER = 1

// Ease-in power for the frame/card's own border-radius collapse — #main-frame
// on Work/About, #cs-content on case study pages. Shared here (not just the
// constant, but the actual formula below) so the two ScrollRevealController
// instances can't drift out of timing sync with each other — the case study
// one used to run its own short, fixed-pixel-window peel instead of this
// curve, before it was unified into a single component.
export const RADIUS_EASE_POWER = 3

export function easeInReveal(p: number, power: number) {
  return 1 - p ** power
}

export function headerRadius(p: number, maxRadius: number) {
  return easeInReveal(p, RADIUS_EASE_POWER) * maxRadius
}

// Raw scroll progress from an element's resting position (scrollY = 0,
// p = 0) until it reaches the true top of the viewport (scrollY =
// triggerAt, p = 1). Driven purely by scroll position, not direction, so
// scrolling back up retraces the exact same curve in reverse.
export function headerProgress(scrollY: number, triggerAt: number) {
  if (triggerAt <= 0) return 1
  return Math.max(0, Math.min(1, scrollY / triggerAt))
}

export function fadeOpacity(p: number) {
  return FADE_FLOOR + easeInReveal(p, FADE_EASE_POWER) * (1 - FADE_FLOOR)
}

export function fadeScale(p: number) {
  return MIN_SCALE + easeInReveal(p, SCALE_EASE_POWER) * (1 - MIN_SCALE)
}
