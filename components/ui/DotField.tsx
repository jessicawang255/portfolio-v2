"use client"

import { useEffect, useRef, type RefObject } from "react"
import { useReducedMotion } from "framer-motion"

// ─── Config ────────────────────────────────────────────────────────────────────
const GRID      = 18                        // px between dot centres
const DOT       = 1                         // half-side of each dot → 2×2 CSS px
const GREY      = [223, 223, 223] as const  // #DFDFDF
const GREEN     = [46,  139,  87] as const  // #2E8B57 — site accent
const INFLUENCE = 130                       // px — illumination radius around spring
const STIFFNESS = 0.06                      // spring stiffness (lower = more lag)
const DAMPING   = 0.78                      // spring friction (lower = more oscillation)

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

    function buildDots() {
      dots = []
      // Vignette: centre-right. Dots near the focus are opaque; edges fade to near-transparent.
      const vigX = W * 0.72
      const vigY = H * 0.50
      const vigR  = Math.hypot(vigX, vigY) * 1.2

      for (let y = 0; y <= H; y += GRID) {
        for (let x = 0; x <= W; x += GRID) {
          const t         = smoothstep(Math.max(0, 1 - Math.hypot(x - vigX, y - vigY) / vigR))
          const baseAlpha = 0.07 + 0.33 * t   // 0.07 (far edge) → 0.40 (vignette centre)
          dots.push({ x, y, baseAlpha })
        }
      }
    }

    // Pre-render static grey vignette once. Blitted each frame via drawImage —
    // a single GPU texture copy, not 1500 individual fillRect calls.
    function buildStaticLayer() {
      const sl   = document.createElement("canvas")
      sl.width   = canvas!.width
      sl.height  = canvas!.height
      const sCtx = sl.getContext("2d")!
      sCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const { x, y, baseAlpha } of dots) {
        sCtx.fillStyle = `rgba(${GREY[0]},${GREY[1]},${GREY[2]},${baseAlpha.toFixed(2)})`
        sCtx.fillRect(x - DOT, y - DOT, DOT * 2, DOT * 2)
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

    // ── Spring & influence ────────────────────────────────────────────────────

    let sx = 0, sy = 0   // spring position (CSS px)
    let vx = 0, vy = 0   // spring velocity
    let tx = 0, ty = 0   // cursor target (CSS px)
    let influence   = 0  // 0..1 — glow intensity, fades in/out on enter/leave
    let infTarget   = 0
    let rafId       = 0
    let prevT       = 0

    function isSettled() {
      return (
        Math.abs(vx)      < 0.08 &&
        Math.abs(vy)      < 0.08 &&
        Math.abs(tx - sx) < 0.5  &&
        Math.abs(ty - sy) < 0.5  &&
        Math.abs(infTarget - influence) < 0.005
      )
    }

    // ── Render ────────────────────────────────────────────────────────────────

    function drawFrame() {
      if (!staticLayer || W === 0) return

      ctx!.clearRect(0, 0, W, H)
      ctx!.drawImage(staticLayer, 0, 0, W, H)  // blit static grey field

      if (influence < 0.002) return             // nothing illuminated

      // Iterate all dots; skip those outside the influence radius.
      // Only ~50–120 dots pass through at any cursor position.
      for (const { x, y, baseAlpha } of dots) {
        const dx   = x - sx
        const dy   = y - sy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist >= INFLUENCE) continue

        // smoothstep gives a soft cubic falloff (zero derivative at 0 and 1)
        const prox = smoothstep(1 - dist / INFLUENCE) * influence
        if (prox < 0.005) continue

        const r = (GREY[0] + (GREEN[0] - GREY[0]) * prox) | 0
        const g = (GREY[1] + (GREEN[1] - GREY[1]) * prox) | 0
        const b = (GREY[2] + (GREEN[2] - GREY[2]) * prox) | 0
        const a = (baseAlpha + prox * 0.25).toFixed(2)

        ctx!.fillStyle = `rgba(${r},${g},${b},${a})`
        ctx!.fillRect(x - DOT, y - DOT, DOT * 2, DOT * 2)
      }
    }

    // ── Animation loop ────────────────────────────────────────────────────────

    function tick(t: number) {
      const dt    = Math.min(t - prevT, 64)                     // guard against tab-switch gaps
      prevT       = t
      const steps = Math.max(1, Math.min(4, Math.round(dt / 16))) // fixed 16ms substeps

      for (let i = 0; i < steps; i++) {
        vx += (tx - sx) * STIFFNESS; vx *= DAMPING; sx += vx
        vy += (ty - sy) * STIFFNESS; vy *= DAMPING; sy += vy
      }

      influence += (infTarget - influence) * 0.1  // smooth fade in/out

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
      tx = e.clientX - rect.left
      ty = e.clientY - rect.top
      startRAF()
    }

    function onEnter(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      tx = e.clientX - rect.left
      ty = e.clientY - rect.top
      // Teleport spring to cursor on entry so the halo appears immediately
      // at the cursor position; lag only manifests as the cursor moves.
      sx = tx; sy = ty; vx = 0; vy = 0
      infTarget = 1
      startRAF()
    }

    function onLeave() {
      infTarget = 0
      startRAF()  // continue ticking until halo fully fades
    }

    // ── Mount ─────────────────────────────────────────────────────────────────

    const ro = new ResizeObserver(resize)
    ro.observe(container)   // fires immediately in all modern browsers → initial render

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
