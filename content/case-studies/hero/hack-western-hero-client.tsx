"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useReducedMotion } from "framer-motion"
import Matter from "matter-js"
import type { Project } from "@/content/work"
import hack from "./hw-hack.svg"
import western from "./hw-western.svg"
import twelve from "./hw-12.svg"
import cs from "./hw-cs.svg"
import major from "./hw-major.svg"
import seasoned from "./hw-seasoned-hacker.svg"
import submit from "./hw-submit-button.svg"
import draw from "./hw-draw.svg"
import drawButton from "./hw-draw-button.svg"
import basics from "./hw-basics.svg"
import returnee from "./hw-returnee.svg"

// The reference frame everything below is measured against (a Figma frame,
// left/top of each layer's unrotated bounding box). Real physics — not these
// numbers — decides where things actually land, so x/y here only seed each
// item's drop column and rotate only seeds its starting tilt; see ITEMS.
const CANVAS_WIDTH = 3000
const CANVAS_HEIGHT = 1200

type Item = {
  src: typeof hack
  x: number
  y: number
  rotate: number
}

// Back-to-front (reverse of the front-to-back z-index order we were handed).
// Array order is paint order (later = stacks on top, no explicit z-index
// needed) and drop order (see DROP_GAP below) — items later in the array
// start their fall from higher up, so the bottom of the pile mostly lands
// first and the topmost sticker drops in last, the way it would if someone
// actually dropped these in one at a time.
const ITEMS: Item[] = [
  { src: returnee,   x: 2381.08, y: 1052.85, rotate: 0.3 },
  { src: basics,     x: 1904.55, y: 608.13,  rotate: -22.35 },
  { src: drawButton, x: 1881.26, y: 1037.47, rotate: 37.26 },
  { src: draw,       x: 1327.53, y: 291.13,  rotate: 37.26 },
  { src: submit,     x: 1167.27, y: 598.78,  rotate: 46.86 },
  { src: seasoned,   x: 847.53,  y: 561,     rotate: -25 },
  { src: major,      x: 294.51,  y: 647.76,  rotate: 22.13 },
  { src: cs,         x: 258,     y: 925,     rotate: -12.06 },
  { src: twelve,     x: 2042.52, y: 496.35,  rotate: -10.36 },
  { src: western,    x: 1085.49, y: 789.53,  rotate: 18.28 },
  { src: hack,       x: 461.61,  y: 462.93,  rotate: -7.33 },
]

// Thick enough that nothing tunnels through at these body sizes/speeds.
const WALL_THICKNESS = 400

// Fixed simulation timestep (not real elapsed time) — the whole point is
// that this settles into the exact same pile every load, and coupling the
// step size to actual frame timing would make the outcome depend on how
// fast the device/browser happens to run.
const FIXED_DT = 1000 / 60
const MAX_STEPS = 300 // ~5s of simulated time — safety net if something never sleeps

// "Feel" of the drop, picked by comparing several candidates against each
// other (bounce/friction/gravity) and then several drop columns at that same
// feel (JITTER_X/JITTER_SEED) — see the git history for the rejected ones.
const GRAVITY_Y = 1.2
const RESTITUTION = 0.35
const FRICTION = 0.6
const FRICTION_AIR = 0.018
const DROP_BASE = 400 // px above the canvas the back-most item starts from
const DROP_GAP = 220 // extra px per array index on top of DROP_BASE
const JITTER_X = 120 // max random horizontal offset added to each item's drop column
const JITTER_SEED = 1 // seeds the jitter RNG so the pile replays identically every load

type Body = Matter.Body

// Deterministic PRNG (mulberry32) — JITTER_X replays into the exact same
// pile every load, same as the rest of the simulation.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function HackWesternHeroClient({
  project,
  backgroundImg,
  aspectRatio,
}: {
  project: Project
  backgroundImg: import("next/image").StaticImageData
  aspectRatio: number
}) {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const loadedCount = useRef(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  function handleItemLoad() {
    loadedCount.current += 1
    if (loadedCount.current >= ITEMS.length) setReady(true)
  }

  useEffect(() => {
    if (reduced || !ready) return

    const rng = mulberry32(JITTER_SEED)
    const jitterX = () => (rng() * 2 - 1) * JITTER_X

    const engine = Matter.Engine.create()
    engine.gravity.y = GRAVITY_Y
    engine.enableSleeping = true

    const bodyOptions: Matter.IChamferableBodyDefinition = {
      restitution: RESTITUTION,
      friction: FRICTION,
      frictionAir: FRICTION_AIR,
    }

    const bodies: Body[] = ITEMS.map((item, i) => {
      const width = item.src.width
      const height = item.src.height
      const centerX = item.x + width / 2 + jitterX()
      const startCenterY = -(DROP_BASE + i * DROP_GAP) - height / 2
      return Matter.Bodies.rectangle(centerX, startCenterY, width, height, {
        ...bodyOptions,
        angle: (item.rotate * Math.PI) / 180,
      })
    })

    // Floor sits at the canvas's bottom edge; walls at its left/right edges —
    // together they keep the pile inside the hero instead of spilling past
    // where #cs-hero-frame clips it (overflow-hidden).
    const floor = Matter.Bodies.rectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT + WALL_THICKNESS / 2,
      CANVAS_WIDTH + WALL_THICKNESS * 2,
      WALL_THICKNESS,
      { isStatic: true }
    )
    const leftWall = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      CANVAS_HEIGHT / 2,
      WALL_THICKNESS,
      CANVAS_HEIGHT * 4,
      { isStatic: true }
    )
    const rightWall = Matter.Bodies.rectangle(
      CANVAS_WIDTH + WALL_THICKNESS / 2,
      CANVAS_HEIGHT / 2,
      WALL_THICKNESS,
      CANVAS_HEIGHT * 4,
      { isStatic: true }
    )

    Matter.Composite.add(engine.world, [...bodies, floor, leftWall, rightWall])

    function syncDom() {
      bodies.forEach((body, i) => {
        const el = itemRefs.current[i]
        if (!el) return
        const width = ITEMS[i].src.width
        const height = ITEMS[i].src.height
        // vw, not %: the wrapper's own box is taller than the hero's design
        // height at `sm`+ (see the comment on the wrapper below), so a
        // height-relative % would land items lower than intended. Every
        // item's width is already vw-based (CANVAS_WIDTH/100vw), so pinning
        // top to the same ratio keeps both axes on one consistent scale.
        const leftVw = ((body.position.x - width / 2) / CANVAS_WIDTH) * 100
        const topVw = ((body.position.y - height / 2) / CANVAS_WIDTH) * 100
        const rotateDeg = (body.angle * 180) / Math.PI
        el.style.left = `${leftVw}vw`
        el.style.top = `${topVw}vw`
        el.style.transform = `rotate(${rotateDeg}deg)`
        el.style.visibility = "visible"
      })
    }

    // Position everything at its off-screen starting spot before the first
    // paint, so there's no frame where items flash in at (0, 0) pre-drop.
    syncDom()

    let rafId = 0
    let steps = 0

    function tick() {
      Matter.Engine.update(engine, FIXED_DT)
      syncDom()
      steps += 1
      const allAsleep = bodies.every((b) => b.isSleeping)
      if (!allAsleep && steps < MAX_STEPS) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      Matter.Composite.clear(engine.world, false)
      Matter.Engine.clear(engine)
    }
  }, [reduced, ready])

  return (
    // In-flow (not absolute) and sized by aspect-ratio below `sm`, where
    // #cs-hero-frame is `static`/`h-auto` and has no other in-flow child to
    // size against. From `sm` up it switches to absolute/inset-0, matching
    // #cs-hero-frame's own fixed box exactly — which is taller than the
    // design height by CaseStudyLayout's HERO_BG_EXTRA buffer, so the
    // background still reaches the frame's true bottom edge instead of
    // leaving a gap that peeks through #cs-content's rounded corner. Items
    // don't inherit that extra height as a positioning error only because
    // their left/top are vw-based (see syncDom/rest values below), not
    // relative to this box's own resolved height.
    //
    // role="img" + aria-label carries the one description the old single
    // flattened image gave AT users — every item image below is decorative
    // (alt="") since none of them individually represents the case study.
    <div
      role="img"
      aria-label={project.title}
      className="relative w-full sm:absolute sm:inset-x-0 sm:top-0 sm:h-full"
      style={{ aspectRatio }}
    >
      <Image src={backgroundImg} alt="" fill className="object-cover" sizes="100vw" />
      {ITEMS.map((item, i) => {
        const widthPct = (item.src.width / CANVAS_WIDTH) * 100
        // Reduced motion: skip the simulation and render each item straight
        // at its designed resting spot, no drop. vw-based for the same
        // reason as syncDom's live positions above.
        const restLeftVw = (item.x / CANVAS_WIDTH) * 100
        const restTopVw = (item.y / CANVAS_WIDTH) * 100

        return (
          <div
            key={item.src.src}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className="absolute"
            style={
              reduced
                ? { left: `${restLeftVw}vw`, top: `${restTopVw}vw`, width: `${widthPct}%`, transform: `rotate(${item.rotate}deg)` }
                : { width: `${widthPct}%`, visibility: "hidden" }
            }
          >
            <Image src={item.src} alt="" className="w-full h-auto" onLoad={handleItemLoad} />
          </div>
        )
      })}
    </div>
  )
}
