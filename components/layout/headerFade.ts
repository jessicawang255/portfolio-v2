// Shared header-side reveal math, used by both instances of
// ScrollRevealController (Work/About's #hero-content, case studies'
// #cs-hero-content).

export const FADE_FLOOR = 0.05
export const MIN_SCALE = 0.98
export const FADE_EASE_POWER = 1
export const SCALE_EASE_POWER = 1

// Ease-in power for the frame/card's own border-radius collapse — #main-frame
// on Work/About, #cs-content on case study pages. Shared so the two
// ScrollRevealController instances stay in timing sync with each other.
export const RADIUS_EASE_POWER = 3

export function easeInReveal(p: number, power: number) {
  return 1 - p ** power
}

export function headerRadius(p: number, maxRadius: number) {
  return easeInReveal(p, RADIUS_EASE_POWER) * maxRadius
}

// Scroll progress from an element's resting position (p = 0) to the top of
// the viewport (p = 1). Driven by position, not direction, so scrolling
// back up retraces the same curve in reverse.
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
