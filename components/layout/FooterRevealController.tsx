"use client"

import { useEffect } from "react"

// ─── Tuning ───────────────────────────────────────────────────────────────────
// ESCAPE_VELOCITY: px/ms — if instant or smoothed velocity exceeds this at zone
//   entry, the snap is skipped. Raise to require a harder flick; lower to make
//   escape easier. Typical slow scroll ~0.1–0.4; deliberate flick ~2.0+.
// SNAP_DURATION:  animation length ms. 400 = snappy, 600 = cinematic.
// COOLDOWN_MS:    silence window after a snap completes. Prevents re-trigger from
//   lingering scroll events immediately after the animation ends.
const MAX_RADIUS      = 48    // px — corner radius when element is fully visible
const SNAP_DURATION   = 500   // ms
const ESCAPE_VELOCITY = 1.0   // px/ms
const COOLDOWN_MS     = 300   // ms

// ─── Easing: cubic-bezier(0.16, 1, 0.3, 1) ── matches --ease-out token ────────
function makeCubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const A = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1
  const B = (a1: number, a2: number) => 3 * a2 - 6 * a1
  const C = (a1: number)             => 3 * a1
  const calc  = (t: number, a1: number, a2: number) => ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t
  const slope = (t: number, a1: number, a2: number) => 3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1)
  function tForX(x: number) {
    let t = x
    for (let i = 0; i < 8; i++) {
      const s = slope(t, p1x, p2x)
      if (!s) return t
      t -= (calc(t, p1x, p2x) - x) / s
    }
    return t
  }
  return (x: number) => x === 0 || x === 1 ? x : calc(tForX(x), p1y, p2y)
}
const ease = makeCubicBezier(0.16, 1, 0.3, 1)

// ─── Scroll-driven radius ─────────────────────────────────────────────────────
// Pure function of scrollY — always in sync with actual page position.
// Not used to determine snap direction.

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

// ─── Snap animation ───────────────────────────────────────────────────────────

function animateSnap(
  target: number,
  onFrame: (y: number) => void,
  onDone: () => void
): () => void {
  const start = window.scrollY
  const dist  = target - start
  const t0    = performance.now()
  let raf: number

  function step(now: number) {
    const p = Math.min((now - t0) / SNAP_DURATION, 1)
    const y = start + dist * ease(p)
    window.scrollTo(0, y)
    onFrame(y)
    if (p < 1) raf = requestAnimationFrame(step)
    else onDone()
  }

  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

// ─── Controller ───────────────────────────────────────────────────────────────

export function FooterRevealController() {
  useEffect(() => {
    const main   = document.getElementById("main-frame")
    const footer = document.getElementById("site-footer")
    if (!main || !footer) return

    const reduced      = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const headerH      = parseFloat(getComputedStyle(document.body).paddingTop) || 68
    const footerH      = footer.offsetHeight
    const footerAbsTop = footer.getBoundingClientRect().top + window.scrollY

    const r = (y: number) => setRadius(main!, y, headerH, footerAbsTop, footerH, window.innerHeight)

    let snapping      = false
    let cooldownUntil = 0
    let scrollDir     = 0   // +1 = down, -1 = up (last user-initiated direction)
    let velocity      = 0   // px/ms EMA — smoothed signal for sustained scrolling
    let instant       = 0   // px/ms raw    — catches fast first events before EMA builds up
    let lastY         = window.scrollY
    let lastT         = performance.now()
    let cancelAnim: () => void = () => {}

    // Initialise zone-active flags from current scroll position so we don't
    // immediately snap if the page is loaded mid-zone (e.g. browser restore).
    const initHr = headerRatio(window.scrollY, headerH)
    const initFr = footerRatio(window.scrollY, footerAbsTop, footerH, window.innerHeight)
    let headerZoneActive = initHr > 0.01 && initHr < 0.99
    let footerZoneActive = initFr > 0.01 && initFr < 0.99

    r(window.scrollY)

    function snap(target: number) {
      if (Math.abs(target - window.scrollY) < 1) return // already there
      cancelAnim()
      if (reduced) { window.scrollTo({ top: target }); return }
      snapping = true
      cancelAnim = animateSnap(target, r, () => {
        snapping      = false
        cooldownUntil = performance.now() + COOLDOWN_MS
      })
    }

    function onScroll() {
      const now = performance.now()
      const y   = window.scrollY
      const dy  = y - lastY
      const dt  = now - lastT

      // Only update direction/velocity from user-initiated scroll events.
      // The RAF snap also fires scroll events via window.scrollTo — those must
      // not corrupt scrollDir, instant, or velocity.
      if (!snapping) {
        if (dy !== 0) scrollDir = dy > 0 ? 1 : -1
        if (dt > 0) {
          instant  = Math.abs(dy) / dt
          velocity = 0.6 * velocity + 0.4 * instant
        }
      }

      lastY = y
      lastT = now

      // Radius always tracks actual scroll position (not snap state)
      r(y)

      // ── Zone exit: reset active flag ──────────────────────────────────────────
      // Runs unconditionally — even during snap/cooldown — so flags are always
      // accurate when snap decisions are evaluated.
      const hr = headerRatio(y, headerH)
      const fr = footerRatio(y, footerAbsTop, footerH, window.innerHeight)
      const inHeaderZone = hr > 0.01 && hr < 0.99
      const inFooterZone = fr > 0.01 && fr < 0.99

      if (!inHeaderZone) headerZoneActive = false
      if (!inFooterZone) footerZoneActive = false

      if (snapping || performance.now() < cooldownUntil) return

      // ── Zone entry: snap immediately ──────────────────────────────────────────
      // Snap fires on the first scroll event that enters the zone.
      // Direction (not visibility ratio) determines the snap target.
      // Fast-scroll bypass: instant catches the first fast event; velocity catches
      // sustained fast scrolling that EMA hasn't fully built up yet.
      const isFast = instant > ESCAPE_VELOCITY || velocity > ESCAPE_VELOCITY

      if (inHeaderZone && !headerZoneActive) {
        headerZoneActive = true
        if (!isFast) {
          // scrollDir > 0 → scrolling down → leaving header → snap CLOSED (hide)
          // scrollDir < 0 → scrolling up   → entering header → snap OPEN (show)
          snap(scrollDir > 0 ? headerH : 0)
          return
        }
      }

      if (inFooterZone && !footerZoneActive) {
        footerZoneActive = true
        if (!isFast) {
          // scrollDir > 0 → scrolling down → entering footer → snap OPEN (show)
          // scrollDir < 0 → scrolling up   → leaving footer  → snap CLOSED (hide)
          const maxY = document.documentElement.scrollHeight - window.innerHeight
          snap(scrollDir > 0 ? maxY : footerAbsTop - window.innerHeight)
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnim()
    }
  }, [])

  return null
}
