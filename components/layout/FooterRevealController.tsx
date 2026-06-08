"use client"

import { useEffect } from "react"

const PEEL_DELAY     = 100  // ms — peeling leads the scroll by this amount
const SCROLL_DURATION = 650 // ms — scroll animation duration (peeling is same length, starts earlier)

// Exact JS implementation of CSS cubic-bezier(0.16, 1, 0.3, 1) — strong ease-out
function makeCubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  function calcBezier(t: number, a1: number, a2: number) {
    return ((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t * t + 3 * a1 * t
  }
  function getSlope(t: number, a1: number, a2: number) {
    return 3 * (1 - 3 * a2 + 3 * a1) * t * t + 2 * (3 * a2 - 6 * a1) * t + 3 * a1
  }
  function getTForX(x: number) {
    let t = x
    for (let i = 0; i < 8; i++) {
      const slope = getSlope(t, p1x, p2x)
      if (slope === 0) return t
      t -= (calcBezier(t, p1x, p2x) - x) / slope
    }
    return t
  }
  return (x: number) => x === 0 || x === 1 ? x : calcBezier(getTForX(x), p1y, p2y)
}

const easeOut = makeCubicBezier(0.16, 1, 0.3, 1)

function animateScroll(target: number, onComplete: () => void): () => void {
  const start     = window.scrollY
  const distance  = target - start
  const startTime = performance.now()
  let rafId: number

  function step(now: number) {
    const t = Math.min((now - startTime) / SCROLL_DURATION, 1)
    window.scrollTo(0, start + distance * easeOut(t))
    if (t < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      onComplete()
    }
  }

  rafId = requestAnimationFrame(step)
  return () => cancelAnimationFrame(rafId)
}

export function FooterRevealController() {
  useEffect(() => {
    const main   = document.getElementById("main-frame")
    const footer = document.getElementById("site-footer")
    if (!main || !footer) return

    const headerSnapThreshold = parseFloat(getComputedStyle(document.body).paddingTop) || 68

    let isSnapping       = false
    let headerRevealed   = window.scrollY < headerSnapThreshold
    let footerRevealed   = footer.getBoundingClientRect().top < window.innerHeight
    let lastScrollY      = window.scrollY
    let cancelSnap: () => void = () => {}

    main.dataset.headerVisible = String(headerRevealed)
    main.dataset.footerVisible = String(footerRevealed)

    function snap(target: number, onStart: () => void) {
      cancelSnap()
      isSnapping = true
      onStart() // peeling starts immediately via data attribute → CSS transition

      let cancelScroll: () => void = () => {}

      // scroll starts PEEL_DELAY ms after the peel, so the border-radius leads
      const delayId = setTimeout(() => {
        cancelScroll = animateScroll(target, () => {
          isSnapping = false
        })
      }, PEEL_DELAY)

      cancelSnap = () => {
        clearTimeout(delayId)
        cancelScroll()
        isSnapping = false
      }
    }

    function snapShowHeader() {
      snap(0, () => {
        headerRevealed = true
        main!.dataset.headerVisible = "true"
      })
    }

    function snapHideHeader() {
      snap(headerSnapThreshold, () => {
        headerRevealed = false
        main!.dataset.headerVisible = "false"
      })
    }

    function snapShowFooter() {
      snap(document.documentElement.scrollHeight - window.innerHeight, () => {
        footerRevealed = true
        main!.dataset.footerVisible = "true"
      })
    }

    function snapHideFooter() {
      const footerAbsTop = footer!.getBoundingClientRect().top + window.scrollY
      snap(footerAbsTop - window.innerHeight, () => {
        footerRevealed = false
        main!.dataset.footerVisible = "false"
      })
    }

    function handleScroll() {
      if (isSnapping) return

      const currentScrollY = window.scrollY
      const scrollingDown  = currentScrollY > lastScrollY
      const scrollingUp    = currentScrollY < lastScrollY
      lastScrollY          = currentScrollY

      // ── Header ──────────────────────────────────────────────────────────────
      if (headerRevealed && scrollingDown) {
        snapHideHeader()
        return
      }
      if (!headerRevealed && scrollingUp && currentScrollY < headerSnapThreshold) {
        snapShowHeader()
        return
      }

      // ── Footer ──────────────────────────────────────────────────────────────
      if (footerRevealed && scrollingUp) {
        snapHideFooter()
        return
      }
      if (!footerRevealed && footer!.getBoundingClientRect().top < window.innerHeight) {
        snapShowFooter()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelSnap()
    }
  }, [])

  return null
}
