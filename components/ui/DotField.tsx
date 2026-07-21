"use client"

import { useEffect, useMemo, useRef, type RefObject } from "react"
import { useReducedMotion } from "framer-motion"


// ─── Config ────────────────────────────────────────────────────────────────────
const GRID            = 28
const DOT             = 1.2
const GREY            = "#AAAFB5"  // base dot colour
const INFLUENCE       = 140    // px — illumination radius
const SIZE_BOOST      = .8   // max extra radius added at full proximity
const STIFFNESS       = 1   // primary spring (lower = more lag) (how snappy the cursor tracking feels)
const DAMPING         = 0.1   // primary spring (lower = more oscillation) (boioioing)
const TRAIL_STIFFNESS = 0.15  // trail lags ~2× more than primary
const TRAIL_DAMPING   = .5
const TRAIL_STRENGTH  = .6   // trail halo intensity relative to primary
const ACCENT_COLOR    = "#AAAFB5"  // default hover/glow colour

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

function hexToRgb(hex: string): readonly [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const GREY_RGB = hexToRgb(GREY)

// ─── Component ─────────────────────────────────────────────────────────────────

export function DotField({
  containerRef,
  accentColor = ACCENT_COLOR,
  viewport = false,
}: {
  containerRef?: RefObject<HTMLElement | null>
  // Hover/glow colour — hex string, e.g. "#C89867"
  accentColor?: string
  viewport?: boolean
}) {
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const reduced        = useReducedMotion()
  const accentRgb       = useMemo(() => hexToRgb(accentColor), [accentColor])
  // Always-fresh ref so the canvas loop can read the latest color without
  // the effect needing to re-run (which would reset all spring state).
  const accentColorRef = useRef(accentRgb)
  accentColorRef.current = accentRgb
  // Exposes startRAF from inside the effect so the nudge effect below
  // can kick the loop when the color changes while the cursor is idle.
  const startRAFRef = useRef<() => void>(() => {})

  // Kick the RAF whenever accentColor changes so the lerp runs even if
  // the cursor hasn't moved.
  useEffect(() => {
    startRAFRef.current()
  }, [accentRgb])

  useEffect(() => {
    const canvas    = canvasRef.current
    if (!canvas) return
    const container = containerRef?.current
    if (!viewport && !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // ── Layout state ──────────────────────────────────────────────────────────

    let W = 0, H = 0, dpr = 1
    let dots: { x: number; y: number; baseAlpha: number }[] = []
    let staticLayer: HTMLCanvasElement | null = null

    function buildDots() {
      dots = []
      for (let y = 0; y <= H; y += GRID) {
        for (let x = 0; x <= W; x += GRID) {
          dots.push({ x, y, baseAlpha: 0.38 })
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
        sCtx.fillStyle = `rgba(${GREY_RGB[0]},${GREY_RGB[1]},${GREY_RGB[2]},${baseAlpha.toFixed(2)})`
        sCtx.beginPath()
        sCtx.arc(x, y, DOT, 0, Math.PI * 2)
        sCtx.fill()
      }
      staticLayer = sl
    }

    function resize() {
      if (viewport) {
        W = window.innerWidth
        H = window.innerHeight
      } else {
        const rect = container!.getBoundingClientRect()
        W = rect.width
        H = rect.height
      }
      dpr = window.devicePixelRatio || 1
      canvas!.width  = Math.round(W * dpr)
      canvas!.height = Math.round(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildDots()
      buildStaticLayer()
      drawFrame()
    }

    // ── Animated accent colour ────────────────────────────────────────────────
    // Lerps toward accentColorRef.current each tick so colour transitions are
    // smooth rather than instant when the flower changes.

    let animR = accentColorRef.current[0]
    let animG = accentColorRef.current[1]
    let animB = accentColorRef.current[2]

    // ── Springs ───────────────────────────────────────────────────────────────

    let cursorX = 0, cursorY = 0                          // raw mouse target
    let springX = 0, springY = 0, springVX = 0, springVY = 0  // primary
    let trailX  = 0, trailY  = 0, trailVX  = 0, trailVY  = 0  // lags behind primary
    let influence  = 0
    let infTarget  = 0
    let rafId      = 0
    let prevT      = 0

    function isSettled() {
      const [tr, tg, tb] = accentColorRef.current
      return (
        Math.abs(springVX)           < 0.08 &&
        Math.abs(springVY)           < 0.08 &&
        Math.abs(trailVX)            < 0.08 &&
        Math.abs(trailVY)            < 0.08 &&
        Math.abs(cursorX - springX)  < 0.5  &&
        Math.abs(cursorY - springY)  < 0.5  &&
        Math.abs(springX - trailX)   < 0.5  &&
        Math.abs(springY - trailY)   < 0.5  &&
        Math.abs(infTarget - influence) < 0.005 &&
        Math.abs(tr - animR)         < 0.5  &&
        Math.abs(tg - animG)         < 0.5  &&
        Math.abs(tb - animB)         < 0.5
      )
    }

    // ── Render ────────────────────────────────────────────────────────────────

    function drawFrame() {
      if (!staticLayer || W === 0) return

      ctx!.clearRect(0, 0, W, H)
      ctx!.drawImage(staticLayer, 0, 0, W, H)

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

        const r = (GREY_RGB[0] + (animR - GREY_RGB[0]) * prox) | 0
        const g = (GREY_RGB[1] + (animG - GREY_RGB[1]) * prox) | 0
        const b = (GREY_RGB[2] + (animB - GREY_RGB[2]) * prox) | 0
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

      // Lerp animated colour toward the current target (~0.3 s to 95%)
      animR += (accentColorRef.current[0] - animR) * 0.06
      animG += (accentColorRef.current[1] - animG) * 0.06
      animB += (accentColorRef.current[2] - animB) * 0.06

      drawFrame()

      rafId = isSettled() ? 0 : requestAnimationFrame(tick)
    }

    function startRAF() {
      if (!rafId) {
        prevT = performance.now()
        rafId = requestAnimationFrame(tick)
      }
    }
    startRAFRef.current = startRAF

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

    if (viewport) {
      window.addEventListener("resize", resize)
      resize()
      if (!reduced) {
        document.addEventListener("mousemove",  onMove)
        document.addEventListener("mouseenter", onEnter)
        document.addEventListener("mouseleave", onLeave)
      }
      return () => {
        document.removeEventListener("mousemove",  onMove)
        document.removeEventListener("mouseenter", onEnter)
        document.removeEventListener("mouseleave", onLeave)
        window.removeEventListener("resize", resize)
        cancelAnimationFrame(rafId)
        staticLayer = null
      }
    } else {
      const ro = new ResizeObserver(resize)
      ro.observe(container!)

      if (!reduced) {
        container!.addEventListener("mousemove",  onMove)
        container!.addEventListener("mouseenter", onEnter)
        container!.addEventListener("mouseleave", onLeave)
      }

      return () => {
        container!.removeEventListener("mousemove",  onMove)
        container!.removeEventListener("mouseenter", onEnter)
        container!.removeEventListener("mouseleave", onLeave)
        cancelAnimationFrame(rafId)
        ro.disconnect()
        staticLayer = null
      }
    }
  }, [reduced, containerRef, viewport])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={viewport
        ? { position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }
        : { display: "block", width: "100%", height: "100%", pointerEvents: "none" }
      }
    />
  )
}
