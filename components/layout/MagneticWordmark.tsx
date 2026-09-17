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

// Repel, mirroring components/ui/DotField.tsx's cursor-push interaction: a
// lit dot within the halo gets shoved directly away from the (spring-
// smoothed) cursor, then springs back once the cursor moves on. It runs
// independently of the stretch effect — stretch decides which dots are lit
// (a large, obvious deformation), repel just nudges where a lit dot renders
// (a small flourish), so stretch reads as dominant by scale alone, with no
// suppression logic needed between the two.
const REPEL_HALO_RADIUS = 400
const REPEL_PUSH_STRENGTH = 12
const REPEL_STIFFNESS = .6
const REPEL_DAMPING = 0.3
// Smooths the raw pointer into a lagging position so the push itself feels
// fluid rather than snapping frame to frame.
const CURSOR_SPRING_STIFFNESS = 1
const CURSOR_SPRING_DAMPING = 0.1
const SETTLE_EPSILON = 0.05

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

interface Dot {
  x: number
  y: number
  // Column index and its precomputed sample-space x — shared by every dot
  // in the column, since the stretch effect never moves a dot horizontally.
  col: number
  sampleX: number
  // Repel's current displacement from (x, y) and its velocity — this is
  // the only thing that actually moves a dot; (x, y) itself never changes.
  pushX: number
  pushY: number
  pushVX: number
  pushVY: number
}

/**
 * Renders the wordmark as a fixed grid of dots — like an LED matrix sign —
 * that never move. Each frame, every dot independently decides whether it's
 * lit by sampling the path-based wordmark as if its column were stretched
 * upward from the shared text baseline, like taffy, based on how close that
 * column is to the pointer. The shape animates through the fixed grid;
 * nothing on screen actually travels. A lit dot can still be nudged away
 * from the cursor (see the repel constants above), layered independently on
 * top of the stretch. Keeping the SVG as the source means this never
 * depends on a visitor having the design font.
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
    // Raw pointer position (frame-relative) and the lagging spring that
    // chases it — repel pushes away from the spring, not the raw cursor,
    // so the motion reads as fluid rather than jumpy.
    let rawCursorX = 0
    let rawCursorY = 0
    let springX = 0
    let springY = 0
    let springVX = 0
    let springVY = 0
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
          dots.push({ x, y, col, sampleX, pushX: 0, pushY: 0, pushVX: 0, pushVY: 0 })
        }
      }
      columnCount = col
      influenceByColumn = new Float64Array(columnCount)
    }

    // Returns whether any dot's repel push is still settling, so the caller
    // knows whether it's safe to stop the animation loop.
    function draw() {
      if (!loaded || !cssWidth || !cssHeight || !sampleData) return false
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

      let pushUnsettled = false

      for (const dot of dots) {
        const influence = influenceByColumn[dot.col]

        // Stretch: ask what rest-state point would have landed on this
        // fixed dot if its column were stretched, then light the dot only
        // if that point actually has ink.
        let sourceY = dot.y
        if (influence > 0.0005 && dot.y < baselineY) {
          const stretch = 1 + (MAX_STRETCH - 1) * influence
          sourceY = baselineY - (baselineY - dot.y) / stretch
        }

        // Repel: push this dot's rendered position directly away from the
        // spring-smoothed cursor, spring-eased so it can overshoot slightly
        // and settle back once the cursor moves away.
        const dx1 = dot.x - springX
        const dy1 = dot.y - springY
        const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
        let targetPushX = 0
        let targetPushY = 0
        if (dist1 < REPEL_HALO_RADIUS && dist1 > 0.01) {
          const push = smoothstep(1 - dist1 / REPEL_HALO_RADIUS) * REPEL_PUSH_STRENGTH
          targetPushX = (dx1 / dist1) * push
          targetPushY = (dy1 / dist1) * push
        }

        dot.pushVX += (targetPushX - dot.pushX) * REPEL_STIFFNESS
        dot.pushVX *= REPEL_DAMPING
        dot.pushX += dot.pushVX
        dot.pushVY += (targetPushY - dot.pushY) * REPEL_STIFFNESS
        dot.pushVY *= REPEL_DAMPING
        dot.pushY += dot.pushVY

        if (
          Math.abs(dot.pushX) > SETTLE_EPSILON || Math.abs(dot.pushY) > SETTLE_EPSILON ||
          Math.abs(dot.pushVX) > SETTLE_EPSILON || Math.abs(dot.pushVY) > SETTLE_EPSILON
        ) {
          pushUnsettled = true
        }

        if (sourceY < restTop) continue
        const sampleY = Math.round(((sourceY - restTop) / scale) * SAMPLE_SCALE)
        if (dot.sampleX < 0 || dot.sampleX >= sampleWidth || sampleY < 0 || sampleY >= sampleHeight) continue

        const alpha = sampleData[(sampleY * sampleWidth + dot.sampleX) * 4 + 3]
        if (alpha < ALPHA_THRESHOLD) continue

        // Repel has no reserved headroom the way the stretch effect does —
        // a strong enough push (or spring overshoot) can send a dot past
        // the canvas edge, where it would just vanish. Clamp the final
        // render position so it presses up against the edge instead.
        const drawX = Math.min(cssWidth - DOT_RADIUS, Math.max(DOT_RADIUS, dot.x + dot.pushX))
        const drawY = Math.min(cssHeight - DOT_RADIUS, Math.max(DOT_RADIUS, dot.y + dot.pushY))

        ctx.beginPath()
        ctx.arc(drawX, drawY, DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      return pushUnsettled
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
      rawCursorX = springX = nextWidth / 2
      rawCursorY = springY = nextHeight / 2
      buildGrid()
      draw()
    }

    function tick() {
      currentX += (targetX - currentX) * 0.16
      currentStrength += (targetStrength - currentStrength) * 0.14

      springVX += (rawCursorX - springX) * CURSOR_SPRING_STIFFNESS
      springVX *= CURSOR_SPRING_DAMPING
      springX += springVX
      springVY += (rawCursorY - springY) * CURSOR_SPRING_STIFFNESS
      springVY *= CURSOR_SPRING_DAMPING
      springY += springVY

      const pushUnsettled = draw()

      const stillEasing =
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetStrength - currentStrength) > 0.002 ||
        Math.abs(rawCursorX - springX) > SETTLE_EPSILON ||
        Math.abs(rawCursorY - springY) > SETTLE_EPSILON ||
        Math.abs(springVX) > SETTLE_EPSILON ||
        Math.abs(springVY) > SETTLE_EPSILON ||
        pushUnsettled

      if (stillEasing) {
        animationFrame = requestAnimationFrame(tick)
      } else {
        currentX = targetX
        currentStrength = targetStrength
        springX = rawCursorX
        springY = rawCursorY
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
      // Tracked unconditionally — repel has its own, much tighter radius, so
      // it decides for itself when the cursor is close enough to matter,
      // independent of the stretch effect's activation field below.
      rawCursorX = event.clientX - rect.left
      rawCursorY = event.clientY - rect.top

      const relativeX = rawCursorX
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
    // pointer-events-none throughout: the effect tracks the cursor via a
    // window-level listener, not hover on these elements, and the canvas's
    // reserved headroom can visually overlap unrelated content above it
    // (see Footer.tsx's negative margin) that still needs to be clickable.
    <div ref={frameRef} className="relative w-full pointer-events-none" style={{ aspectRatio: `${SOURCE_WIDTH} / ${SOURCE_HEIGHT}` }}>
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
