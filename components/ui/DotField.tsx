"use client"

import { useEffect, useRef, type RefObject } from "react"
import { useReducedMotion } from "framer-motion"

// ─── Config ────────────────────────────────────────────────────────────────────
const GRID            = 20
const DOT             = 1
const GREY            = [190, 190, 190] as const
// Light sage — same hue as site accent but desaturated and lifted
const GREEN           = [23, 180, 90] as const
const INFLUENCE       = 140    // px — illumination radius
const SIZE_BOOST      = .3   // max extra radius added at full proximity
const STIFFNESS       = .9   // primary spring (lower = more lag) (how snappy the cursor tracking feels)
const DAMPING         = 0.1   // primary spring (lower = more oscillation) (boioioing)
const TRAIL_STIFFNESS = 0.15  // trail lags ~2× more than primary
const TRAIL_DAMPING   = .5
const TRAIL_STRENGTH  = .6   // trail halo intensity relative to primary

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function DotField({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced   = useReducedMotion()

  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // ── Layout state ──────────────────────────────────────────────────────────

    let W = 0, H = 0, dpr = 1
    let dots: { x: number; y: number; baseAlpha: number }[] = []
    let staticLayer: HTMLCanvasElement | null = null
    let eCX = 0, eCY = 0, eRX = 0, eRY = 0  // ellipse params — shared with drawFrame

    function buildDots() {
      dots = []
      // Centre is off-screen top-right so the canvas shows the bottom-left
      // quadrant of the ellipse. Arc enters left edge ~40% down and exits the
      // bottom edge ~40% from the left — dots concentrate in the upper-right,
      // absent from the lower-left.
      eCX = W * 1    // ellipse X axis position
      eCY = -H * .8   // ellipse Y axis position
      eRX = W * 1.2     // ellipse width
      eRY = H * 1.85    // ellipse height
      const cx = eCX, cy = eCY, rx = eRX, ry = eRY

      // Fade only in the outer 20% of the ellipse radius — dots stay at full
      // opacity across most of the interior, with a narrow softening band at
      // the edge. This keeps the vignette subtle rather than gradient-heavy.
      const fadeZone = 0.30

      for (let y = 0; y <= H; y += GRID) {
        for (let x = 0; x <= W; x += GRID) {
          const dx   = (x - cx) / rx
          const dy   = (y - cy) / ry
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist >= 1) continue
          const inner     = Math.max(0, dist - (1 - fadeZone)) / fadeZone
          const t         = smoothstep(1 - inner)
          const baseAlpha = t * 0.38
          if (baseAlpha < 0.015) continue
          dots.push({ x, y, baseAlpha })
        }
      }
    }

    // Pre-render static grey field once; blitted each frame as a single GPU copy.
    function buildStaticLayer() {
      const sl   = document.createElement("canvas")
      sl.width   = canvas!.width
      sl.height  = canvas!.height
      const sCtx = sl.getContext("2d")!
      sCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const { x, y, baseAlpha } of dots) {
        sCtx.fillStyle = `rgba(${GREY[0]},${GREY[1]},${GREY[2]},${baseAlpha.toFixed(2)})`
        sCtx.beginPath()
        sCtx.arc(x, y, DOT, 0, Math.PI * 2)
        sCtx.fill()
      }
      staticLayer = sl
    }

    function resize() {
      const rect = container!.getBoundingClientRect()
      W   = rect.width
      H   = rect.height
      dpr = window.devicePixelRatio || 1
      canvas!.width  = Math.round(W * dpr)
      canvas!.height = Math.round(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildDots()
      buildStaticLayer()
      drawFrame()
    }

    // ── Springs ───────────────────────────────────────────────────────────────

    let cursorX = 0, cursorY = 0                          // raw mouse target
    let springX = 0, springY = 0, springVX = 0, springVY = 0  // primary
    let trailX  = 0, trailY  = 0, trailVX  = 0, trailVY  = 0  // lags behind primary
    let influence  = 0
    let infTarget  = 0
    let rafId      = 0
    let prevT      = 0

    function isSettled() {
      return (
        Math.abs(springVX)           < 0.08 &&
        Math.abs(springVY)           < 0.08 &&
        Math.abs(trailVX)            < 0.08 &&
        Math.abs(trailVY)            < 0.08 &&
        Math.abs(cursorX - springX)  < 0.5  &&
        Math.abs(cursorY - springY)  < 0.5  &&
        Math.abs(springX - trailX)   < 0.5  &&
        Math.abs(springY - trailY)   < 0.5  &&
        Math.abs(infTarget - influence) < 0.005
      )
    }

    // ── Render ────────────────────────────────────────────────────────────────

    function drawFrame() {
      if (!staticLayer || W === 0) return

      ctx!.clearRect(0, 0, W, H)
      ctx!.drawImage(staticLayer, 0, 0, W, H)

      // DEBUG: red ellipse border — remove when done tuning
      // ctx!.save()
      // ctx!.strokeStyle = "rgba(255,0,0,0.85)"
      // ctx!.lineWidth = 1.5
      // ctx!.beginPath()
      // ctx!.ellipse(eCX, eCY, eRX, eRY, 0, 0, Math.PI * 2)
      // ctx!.stroke()
      // ctx!.restore()

      if (influence < 0.002) return

      for (const { x, y, baseAlpha } of dots) {
        // Primary halo
        const dx1   = x - springX
        const dy1   = y - springY
        const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
        const prox1 = dist1 < INFLUENCE
          ? smoothstep(1 - dist1 / INFLUENCE) * influence
          : 0

        // Trail halo — same radius, reduced intensity, spatially offset
        const dx2   = x - trailX
        const dy2   = y - trailY
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
        const prox2 = dist2 < INFLUENCE
          ? smoothstep(1 - dist2 / INFLUENCE) * influence * TRAIL_STRENGTH
          : 0

        // Dominant contribution per dot — primary wins in its zone, trail glows
        // in the wake. Single fill call per dot keeps the loop tight.
        const prox = Math.max(prox1, prox2)
        if (prox < 0.005) continue

        const r = (GREY[0] + (GREEN[0] - GREY[0]) * prox) | 0
        const g = (GREY[1] + (GREEN[1] - GREY[1]) * prox) | 0
        const b = (GREY[2] + (GREEN[2] - GREY[2]) * prox) | 0
        const a = (baseAlpha + (1 - baseAlpha) * prox).toFixed(2)

        const radius = DOT + SIZE_BOOST * prox
        ctx!.fillStyle = `rgba(${r},${g},${b},${a})`
        ctx!.beginPath()
        ctx!.arc(x, y, radius, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    // ── Animation loop ────────────────────────────────────────────────────────

    function tick(t: number) {
      const dt    = Math.min(t - prevT, 64)
      prevT       = t
      const steps = Math.max(1, Math.min(4, Math.round(dt / 16)))

      for (let i = 0; i < steps; i++) {
        springVX += (cursorX - springX) * STIFFNESS
        springVX *= DAMPING
        springX  += springVX

        springVY += (cursorY - springY) * STIFFNESS
        springVY *= DAMPING
        springY  += springVY

        // Trail chases the primary spring, not the cursor
        trailVX += (springX - trailX) * TRAIL_STIFFNESS
        trailVX *= TRAIL_DAMPING
        trailX  += trailVX

        trailVY += (springY - trailY) * TRAIL_STIFFNESS
        trailVY *= TRAIL_DAMPING
        trailY  += trailVY
      }

      influence += (infTarget - influence) * 0.1

      drawFrame()

      rafId = isSettled() ? 0 : requestAnimationFrame(tick)
    }

    function startRAF() {
      if (!rafId) {
        prevT = performance.now()
        rafId = requestAnimationFrame(tick)
      }
    }

    // ── Events ────────────────────────────────────────────────────────────────

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      cursorX = e.clientX - rect.left
      cursorY = e.clientY - rect.top
      startRAF()
    }

    function onEnter(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      cursorX = e.clientX - rect.left
      cursorY = e.clientY - rect.top
      // Teleport both springs to entry point — trail develops organically from movement
      springX = cursorX; springY = cursorY; springVX = 0; springVY = 0
      trailX  = cursorX; trailY  = cursorY; trailVX  = 0; trailVY  = 0
      infTarget = 1
      startRAF()
    }

    function onLeave() {
      infTarget = 0
      startRAF()
    }

    // ── Mount ─────────────────────────────────────────────────────────────────

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    if (!reduced) {
      container.addEventListener("mousemove",  onMove)
      container.addEventListener("mouseenter", onEnter)
      container.addEventListener("mouseleave", onLeave)
    }

    return () => {
      container.removeEventListener("mousemove",  onMove)
      container.removeEventListener("mouseenter", onEnter)
      container.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(rafId)
      ro.disconnect()
      staticLayer = null
    }
  }, [reduced, containerRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none" }}
    />
  )
}
