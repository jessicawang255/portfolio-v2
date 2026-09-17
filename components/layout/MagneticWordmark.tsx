"use client"

import { useEffect, useRef } from "react"

const WORDMARK_SRC = "/Jessica-Wang-Vector.svg"
const SOURCE_WIDTH = 1111
const SOURCE_HEIGHT = 190
// The SVG's lowercase descenders finish at y=189.6; its shared text baseline
// sits at y=141.6. Anchoring the stretch there — not at the descenders —
// keeps every letter sitting on one fixed line, the way it reads on a page.
const SOURCE_BASELINE = 142
const WORDMARK_COLOR = "#AAAFB5"
// const WORDMARK_COLOR = "#BEC2C6"    // or AAAFB5
const BASE_OPACITY = 1

// Grid density and how the halftone dots are sampled from the source SVG.
const DOT_PITCH = 3.5   // or 5
// const DOT_PITCH = 5
const DOT_RADIUS = .8
const SAMPLE_SCALE = 3
const ALPHA_THRESHOLD = 100


// cool:
// const DOT_PITCH = 3
// const DOT_RADIUS = 0.6
// const SAMPLE_SCALE = 3
// const ALPHA_THRESHOLD = 100


// How much taller a fully-influenced column can stretch, anchored to the
// baseline — e.g. 1.5 lets the topmost dots reach 1.5x their rest distance
// above the (fixed) baseline. The canvas reserves headroom for this.
const MAX_STRETCH = 1.5

// The cursor can start pulling the mark well before it reaches the footer.
const VERTICAL_ACTIVATION_DISTANCE = 700
// The mark is already at full pull while the cursor is still approaching;
// only the outer part of the field is a gradual preview of the effect.
const FULL_STRENGTH_DISTANCE = 260
const HORIZONTAL_ACTIVATION_PADDING = 180

interface Dot {
  x: number
  y: number
  // Column index and its precomputed sample-space x — shared by every dot
  // in the column, since the stretch effect never moves a dot horizontally.
  col: number
  sampleX: number
}

/**
 * Renders the wordmark as a fixed grid of dots — like an LED matrix sign —
 * that never move. Each frame, every dot independently decides whether it's
 * lit by sampling the path-based wordmark as if its column were stretched
 * upward from the shared text baseline, like taffy, based on how close that
 * column is to the pointer. The shape animates through the fixed grid;
 * nothing on screen actually travels. Keeping the SVG as the source means
 * this never depends on a visitor having the design font.
 */
export function MagneticWordmark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const frame = frameRef.current
    const fallback = fallbackRef.current
    if (!canvas || !frame || !fallback) return

    // Freeze ref values as non-null locals before callbacks close over them.
    const canvasElement: HTMLCanvasElement = canvas
    const frameElement: HTMLDivElement = frame
    const fallbackElement: HTMLDivElement = fallback
    const context = canvasElement.getContext("2d")
    if (!context) return
    const ctx: CanvasRenderingContext2D = context

    const media = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const image = new Image()
    let animationFrame = 0
    let loaded = false
    let cssWidth = 0
    let cssHeight = 0
    let targetX = 0
    let currentX = 0
    let targetStrength = 0
    let currentStrength = 0
    let sampleData: Uint8ClampedArray | null = null
    let sampleWidth = 0
    let sampleHeight = 0
    let dots: Dot[] = []
    let columnCount = 0
    let influenceByColumn = new Float64Array(0)

    function canAnimate() {
      return media.matches && !reducedMotion.matches
    }

    function buildSampleData() {
      const sampleCanvas = document.createElement("canvas")
      sampleCanvas.width = SOURCE_WIDTH * SAMPLE_SCALE
      sampleCanvas.height = SOURCE_HEIGHT * SAMPLE_SCALE
      const sampleCtx = sampleCanvas.getContext("2d")
      if (!sampleCtx) return
      sampleCtx.drawImage(image, 0, 0, sampleCanvas.width, sampleCanvas.height)
      const imageData = sampleCtx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height)
      sampleData = imageData.data
      sampleWidth = sampleCanvas.width
      sampleHeight = sampleCanvas.height
    }

    // The grid itself is just a fixed lattice across the whole canvas — it
    // doesn't know or care where the wordmark's ink is. That's decided fresh
    // every frame in draw(), which is what makes dots appear/disappear
    // rather than travel.
    function buildGrid() {
      dots = []
      if (!cssWidth || !cssHeight) return
      const scale = cssWidth / SOURCE_WIDTH

      let col = 0
      for (let x = DOT_PITCH / 2; x < cssWidth; x += DOT_PITCH, col++) {
        const sampleX = Math.round((x / scale) * SAMPLE_SCALE)
        for (let y = DOT_PITCH / 2; y < cssHeight; y += DOT_PITCH) {
          dots.push({ x, y, col, sampleX })
        }
      }
      columnCount = col
      influenceByColumn = new Float64Array(columnCount)
    }

    function draw() {
      if (!loaded || !cssWidth || !cssHeight || !sampleData) return
      ctx.clearRect(0, 0, cssWidth, cssHeight)
      ctx.fillStyle = WORDMARK_COLOR
      ctx.globalAlpha = BASE_OPACITY

      const radius = Math.min(380, Math.max(200, cssWidth * 0.28))
      // Most letters have no descender, so their own bottom already sits
      // above the canvas's absolute bottom (which only "g" reaches) — using
      // that as the anchor would still shift them. Anchor at the shared
      // baseline instead: only points above it are ever asked to light up
      // from a stretched position, so descenders and baseline-sitting
      // letters both stay completely still.
      const scale = cssWidth / SOURCE_WIDTH
      const contentHeight = SOURCE_HEIGHT * scale
      const restTop = cssHeight - contentHeight
      const baselineY = restTop + SOURCE_BASELINE * scale

      // Stretch influence only ever varies by column, so compute it once
      // per column instead of once per dot.
      for (let col = 0; col < columnCount; col++) {
        const x = DOT_PITCH / 2 + col * DOT_PITCH
        const dx = x - currentX
        influenceByColumn[col] = Math.exp(-(dx * dx) / (radius * radius)) * currentStrength
      }

      for (const dot of dots) {
        const influence = influenceByColumn[dot.col]

        // Ask: if this column were stretched, what rest-state point would
        // have landed on this fixed dot? Then light the dot only if that
        // point actually has ink — this is what makes the shape reveal
        // itself through the grid instead of the grid moving to match it.
        let sourceY = dot.y
        if (influence > 0.0005 && dot.y < baselineY) {
          const stretch = 1 + (MAX_STRETCH - 1) * influence
          sourceY = baselineY - (baselineY - dot.y) / stretch
        }

        if (sourceY < restTop) continue
        const sampleY = Math.round(((sourceY - restTop) / scale) * SAMPLE_SCALE)
        if (dot.sampleX < 0 || dot.sampleX >= sampleWidth || sampleY < 0 || sampleY >= sampleHeight) continue

        const alpha = sampleData[(sampleY * sampleWidth + dot.sampleX) * 4 + 3]
        if (alpha < ALPHA_THRESHOLD) continue

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
    }

    function resize() {
      const rect = frameElement.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(rect.width))
      const nextContentHeight = Math.ceil((nextWidth * SOURCE_HEIGHT) / SOURCE_WIDTH)
      const nextHeight = Math.ceil(nextContentHeight * MAX_STRETCH)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      cssWidth = nextWidth
      cssHeight = nextHeight
      canvasElement.width = Math.round(nextWidth * dpr)
      canvasElement.height = Math.round(nextHeight * dpr)
      canvasElement.style.height = `${nextHeight}px`
      // The frame's own CSS aspect-ratio only sizes it before this runs (the
      // no-JS/pre-hydration fallback); once measured, grow it to match the
      // taller canvas so the reserved headroom isn't clipped by the footer's
      // overflow-hidden wrapper.
      frameElement.style.height = `${nextHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      targetX = currentX = nextWidth / 2
      buildGrid()
      draw()
    }

    function tick() {
      currentX += (targetX - currentX) * 0.16
      currentStrength += (targetStrength - currentStrength) * 0.14
      draw()

      const stillEasing =
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetStrength - currentStrength) > 0.002

      if (stillEasing) {
        animationFrame = requestAnimationFrame(tick)
      } else {
        currentX = targetX
        currentStrength = targetStrength
        animationFrame = 0
        draw()
      }
    }

    function schedule() {
      if (!animationFrame) animationFrame = requestAnimationFrame(tick)
    }

    function onPointerMove(event: PointerEvent) {
      if (!canAnimate()) return
      const rect = frameElement.getBoundingClientRect()
      const relativeX = event.clientX - rect.left
      const verticalDistance = Math.max(
        rect.top - event.clientY,
        0,
        event.clientY - rect.bottom
      )
      const isWithinMagneticField =
        relativeX >= -HORIZONTAL_ACTIVATION_PADDING &&
        relativeX <= cssWidth + HORIZONTAL_ACTIVATION_PADDING &&
        verticalDistance <= VERTICAL_ACTIVATION_DISTANCE

      if (!isWithinMagneticField) {
        targetStrength = 0
        schedule()
        return
      }

      targetX = Math.max(0, Math.min(cssWidth, relativeX))
      // A long, soft vertical falloff lets the type react high above the
      // footer, while full height is reached 260px before direct hover.
      targetStrength = verticalDistance <= FULL_STRENGTH_DISTANCE
        ? 1
        : ((VERTICAL_ACTIVATION_DISTANCE - verticalDistance) /
          (VERTICAL_ACTIVATION_DISTANCE - FULL_STRENGTH_DISTANCE)) ** 1.35
      schedule()
    }

    function onCapabilityChange() {
      if (!canAnimate()) targetStrength = 0
      schedule()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(frameElement)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    media.addEventListener("change", onCapabilityChange)
    reducedMotion.addEventListener("change", onCapabilityChange)

    image.onload = () => {
      loaded = true
      buildSampleData()
      canvasElement.style.opacity = "1"
      // The canvas is now drawing the same SVG itself; remove the static
      // no-JS fallback so it cannot show through beneath the dot grid.
      fallbackElement.style.opacity = "0"
      resize()
    }
    image.src = WORDMARK_SRC

    return () => {
      cancelAnimationFrame(animationFrame)
      observer.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      media.removeEventListener("change", onCapabilityChange)
      reducedMotion.removeEventListener("change", onCapabilityChange)
    }
  }, [])

  return (
    <div ref={frameRef} className="relative w-full" style={{ aspectRatio: `${SOURCE_WIDTH} / ${SOURCE_HEIGHT}` }}>
      {/* Visible immediately and also provides the accessible, no-JS state. */}
      <div
        ref={fallbackRef}
        role="img"
        aria-label="Jessica Wang"
        className="absolute inset-x-0 bottom-0 h-auto w-full bg-contain bg-bottom bg-no-repeat transition-opacity duration-150"
        style={{ backgroundImage: `url(${WORDMARK_SRC})`, aspectRatio: `${SOURCE_WIDTH} / ${SOURCE_HEIGHT}` }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-x-0 bottom-0 w-full opacity-0 transition-opacity duration-150" />
    </div>
  )
}
