"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { useReducedMotion } from "framer-motion"
import Matter from "matter-js"
import type { Project } from "@/content/work"
import { headerProgress } from "@/components/layout/headerFade"
import { COMPACT_HERO_HEIGHT } from "@/components/layout/heroCompactHeight"
import hack from "./stickers/hack.svg"
import western from "./stickers/western.svg"
import twelve from "./stickers/twelve.svg"
import cs from "./stickers/cs.svg"
import major from "./stickers/major.svg"
import seasoned from "./stickers/seasoned-hacker.svg"
import submit from "./stickers/submit-button.svg"
import draw from "./stickers/draw.svg"
import drawButton from "./stickers/draw-button.svg"
import basics from "./stickers/basics.svg"
import returnee from "./stickers/returnee.svg"

// Figma frame coordinates. Physics decides final position — x/y here only
// seed each item's drop column, rotate only seeds its starting tilt.
const CANVAS_WIDTH = 3000
const CANVAS_HEIGHT = 1200

type Item = {
  src: typeof hack
  x: number
  y: number
  rotate: number
}

// Array order is both paint order (later = stacks on top) and drop order
// (later items start higher — see DROP_GAP), so the pile lands bottom-first
// like someone actually dropping these in one at a time.
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

// Fixed simulation step, run in substeps so a big real-time gap (a fast
// scroll fling between two rAF frames) doesn't let a fast body tunnel
// through another.
const FIXED_DT = 1000 / 60
const MAX_SUBSTEPS_PER_TICK = 8
// Safety net in case something never sleeps (e.g. the pusher jittering on
// numerical noise at a sticker's edge forever). ~20s of simulated time.
const MAX_RUN_STEPS = 1200

// Case studies only pin the hero and let #cs-content slide over it from
// `sm` up (see CaseStudyHero) — matches its DESKTOP_QUERY.
const DESKTOP_QUERY = "(min-width: 640px)"

// Matches `--breakpoint-lg` in globals.css — below it a flattened mobileImg
// replaces the sim entirely (same convention as HeroForeground's mobileSrc),
// since CANVAS_WIDTH's wide composition has stickers pinned at edges that
// don't exist on a phone-width screen. No point running Matter.js for that.
const LG_QUERY = "(min-width: 60rem)"

// Height (in mobileImg's own px) of the translucent white bar along its
// bottom edge, measured from the top of the bar's rounded corners.
const MOBILE_BAR_HEIGHT = 440

// The pusher representing #cs-content's leading edge — thick so a fast
// fling can't tunnel a sticker through it, heavy so the stickers never
// budge *it*, no bounce (it's a wall, not another sticker).
const PUSHER_THICKNESS = 60
const PUSHER_MASS = 9000
// Matter combines a colliding pair's restitution as max(a, b), so giving the
// pusher restitution: 0 doesn't soften anything — the sticker's own 0.35
// still wins. Instead, any sticker touching the pusher gets its upward
// (launch) velocity cut directly, every substep it's in contact — the drop's
// bounce (sticker vs. floor/sticker) is untouched.
const PUSHER_BOUNCE_DAMPING = 0.15

// Collision groups: the pusher only ever touches stickers, never the static
// floor/walls it starts out coincident with (see its rest position below) —
// without this, two immovable-ish bodies overlapping at rest fight the
// solver every step.
const CATEGORY_ITEM = 0x0001
const CATEGORY_BOUNDARY = 0x0002
const CATEGORY_PUSHER = 0x0004

// Hand-tuned "feel" of the drop.
const GRAVITY_Y = 1.5
const RESTITUTION = 0.35
const FRICTION = 0.6
const FRICTION_AIR = 0.005
// Matter's default (0.001) scaled up — doesn't affect the drop (gravity
// accelerates every mass equally) but a heavier sticker gains less velocity
// from the pusher's collision impulse, so it launches a shorter distance.
const ITEM_DENSITY = 0.01
const DROP_BASE = 400 // px above the canvas the back-most item starts from
const DROP_GAP = 220 // extra px per array index on top of DROP_BASE
const JITTER_X = 120 // max random horizontal offset added to each item's drop column
const JITTER_SEED = 11023 // seeds the jitter RNG so the pile replays identically every load

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

// useSyncExternalStore, not matchMedia-in-an-effect + setState, to avoid a
// cascading render. getServerSnapshot fixes `false` for SSR; the real value
// is picked up client-side right after.
function subscribeToLgQuery(callback: () => void) {
  const mql = window.matchMedia(LG_QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}
function getLgSnapshot() {
  return window.matchMedia(LG_QUERY).matches
}
function getLgServerSnapshot() {
  return false
}

export default function HackWesternHeroClient({
  project,
  backgroundImg,
  mobileImg,
}: {
  project: Project
  backgroundImg: import("next/image").StaticImageData
  mobileImg: import("next/image").StaticImageData
}) {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const loadedCount = useRef(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [mobileLoaded, setMobileLoaded] = useState(false)

  // Only gates whether the sim gets built — the sim-vs-static-image markup
  // itself is CSS-only (`lg:` classes below), so no hydration mismatch risk.
  const isDesktopTier = useSyncExternalStore(subscribeToLgQuery, getLgSnapshot, getLgServerSnapshot)

  function handleItemLoad() {
    loadedCount.current += 1
    if (loadedCount.current >= ITEMS.length) setReady(true)
  }

  useEffect(() => {
    if (reduced || !ready || !isDesktopTier) return

    const mql = window.matchMedia(DESKTOP_QUERY)

    // Reassigned wholesale by buildSimulation() (on mount, and again on every
    // full-out-then-back scroll cycle — see onScrollOrResize); every function
    // below reads these live so a rebuild takes effect without re-registering
    // any listener.
    let engine: Matter.Engine
    let bodies: Body[]
    let pusher: Body
    let pusherY = 0
    let pusherTargetY = 0

    function syncDom() {
      bodies.forEach((body, i) => {
        const el = itemRefs.current[i]
        if (!el) return
        const width = ITEMS[i].src.width
        const height = ITEMS[i].src.height
        // vw, not %: the wrapper is taller than the hero's design height at
        // `sm`+ (see the wrapper comment below), so height-relative % would
        // land items too low. Width is already vw-based, so top uses the
        // same scale to keep both axes consistent.
        const leftVw = ((body.position.x - width / 2) / CANVAS_WIDTH) * 100
        const topVw = ((body.position.y - height / 2) / CANVAS_WIDTH) * 100
        const rotateDeg = (body.angle * 180) / Math.PI
        el.style.left = `${leftVw}vw`
        el.style.top = `${topVw}vw`
        el.style.transform = `rotate(${rotateDeg}deg)`
        el.style.visibility = "visible"
      })
    }

    // Rebuilds the entire drop from scratch with the same starting
    // conditions, so a reset genuinely looks like the page just loaded.
    function buildSimulation() {
      if (engine) {
        Matter.Composite.clear(engine.world, false)
        Matter.Engine.clear(engine)
      }

      const rng = mulberry32(JITTER_SEED)
      const jitterX = () => (rng() * 2 - 1) * JITTER_X

      engine = Matter.Engine.create()
      engine.gravity.y = GRAVITY_Y
      // Lets the loop stop between scrolls — sleeping bodies still wake
      // automatically the instant something touches them.
      engine.enableSleeping = true

      const bodyOptions: Matter.IChamferableBodyDefinition = {
        restitution: RESTITUTION,
        friction: FRICTION,
        frictionAir: FRICTION_AIR,
        density: ITEM_DENSITY,
      }

      const itemCollisionFilter = { category: CATEGORY_ITEM, mask: CATEGORY_ITEM | CATEGORY_BOUNDARY | CATEGORY_PUSHER }

      bodies = ITEMS.map((item, i) => {
        const width = item.src.width
        const height = item.src.height
        const centerX = item.x + width / 2 + jitterX()
        const startCenterY = -(DROP_BASE + i * DROP_GAP) - height / 2
        return Matter.Bodies.rectangle(centerX, startCenterY, width, height, {
          ...bodyOptions,
          angle: (item.rotate * Math.PI) / 180,
          collisionFilter: itemCollisionFilter,
        })
      })

      // Floor + walls keep the pile inside the hero instead of spilling past
      // where #cs-hero-frame clips it. Only collide with stickers, never the
      // pusher (which starts coincident with the floor at rest).
      const boundaryOptions: Matter.IChamferableBodyDefinition = {
        isStatic: true,
        collisionFilter: { category: CATEGORY_BOUNDARY, mask: CATEGORY_ITEM },
      }
      const floor = Matter.Bodies.rectangle(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT + WALL_THICKNESS / 2,
        CANVAS_WIDTH + WALL_THICKNESS * 2,
        WALL_THICKNESS,
        boundaryOptions
      )
      const leftWall = Matter.Bodies.rectangle(
        -WALL_THICKNESS / 2,
        CANVAS_HEIGHT / 2,
        WALL_THICKNESS,
        CANVAS_HEIGHT * 4,
        boundaryOptions
      )
      const rightWall = Matter.Bodies.rectangle(
        CANVAS_WIDTH + WALL_THICKNESS / 2,
        CANVAS_HEIGHT / 2,
        WALL_THICKNESS,
        CANVAS_HEIGHT * 4,
        boundaryOptions
      )

      // Stand-in for #cs-content's real top edge, repositioned every tick to
      // track it (see measurePusherTargetY), so scrolling the frame over the
      // hero physically shoves the pile instead of just covering it.
      pusher = Matter.Bodies.rectangle(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - PUSHER_THICKNESS / 2,
        CANVAS_WIDTH + WALL_THICKNESS * 2,
        PUSHER_THICKNESS,
        {
          // Low friction on purpose — a grippy full-width bar sliding under
          // a tilted sticker imparts torque, flipping it end over end. It
          // should shove stickers out of the way, not spin them.
          friction: 0.05,
          restitution: 0,
          collisionFilter: { category: CATEGORY_PUSHER, mask: CATEGORY_ITEM },
        }
      )
      Matter.Body.setMass(pusher, PUSHER_MASS)
      Matter.Body.setInertia(pusher, Infinity) // never rotates

      Matter.Composite.add(engine.world, [...bodies, floor, leftWall, rightWall, pusher])

      pusherY = pusher.position.y
      pusherTargetY = pusherY

      // Position everything at its off-screen starting spot before the first
      // paint, so items don't flash in at (0, 0) pre-drop.
      syncDom()
    }

    // #cs-content's real top edge, in canvas units, matching syncDom's
    // vw-based scale. Below `sm` there's no covering effect (see
    // CaseStudyHero), so the pusher just stays parked at the floor.
    function measurePusherTargetY() {
      if (!mql.matches) return CANVAS_HEIGHT - PUSHER_THICKNESS / 2
      const contentEl = document.getElementById("cs-content")
      if (!contentEl) return CANVAS_HEIGHT - PUSHER_THICKNESS / 2
      const screenTop = contentEl.getBoundingClientRect().top
      return (screenTop / window.innerWidth) * CANVAS_WIDTH - PUSHER_THICKNESS / 2
    }

    // Same 0–1 progress ScrollRevealController drives the frame's fade from,
    // so "out of screen" here stays in sync with when the hero actually
    // becomes invisible there.
    function coverProgress() {
      const contentEl = document.getElementById("cs-content")
      if (!contentEl) return 0
      const triggerAt = Math.max(contentEl.offsetTop, 0)
      return headerProgress(window.scrollY, triggerAt)
    }

    let rafId = 0
    let running = false
    let lastTickTime = 0
    let runSteps = 0
    // True from the moment the hero becomes fully covered until it's fully
    // visible again — the whole time, physics is paused (frozen wherever it
    // was), not just not-updating-the-pusher.
    let heroFullyOut = false

    function tick(now: number) {
      const realDt = lastTickTime ? Math.min(now - lastTickTime, 250) : FIXED_DT
      lastTickTime = now

      const substeps = Math.min(Math.max(Math.round(realDt / FIXED_DT), 1), MAX_SUBSTEPS_PER_TICK)
      const stepDelta = (pusherTargetY - pusherY) / substeps

      for (let i = 0; i < substeps; i++) {
        pusherY += stepDelta
        Matter.Body.setPosition(pusher, { x: pusher.position.x, y: pusherY })
        // Matter's velocity is "distance per Engine.update call" when delta
        // matches FIXED_DT, so the per-substep displacement doubles as the
        // velocity, letting contact response scale with real scroll speed.
        Matter.Body.setVelocity(pusher, { x: 0, y: stepDelta })
        Matter.Engine.update(engine, FIXED_DT)

        // Clamps only the overshoot past the pusher's own speed — a sticker
        // riding along at the pusher's speed isn't bouncing, it's being
        // pushed. Angular velocity is damped outright (see PUSHER friction).
        for (const collision of Matter.Query.collides(pusher, bodies)) {
          if (!collision.collided) continue
          const item = collision.bodyA === pusher ? collision.bodyB : collision.bodyA
          const overshoot = item.velocity.y - pusher.velocity.y
          if (overshoot < 0) {
            Matter.Body.setVelocity(item, { x: item.velocity.x, y: pusher.velocity.y + overshoot * PUSHER_BOUNCE_DAMPING })
          }
          Matter.Body.setAngularVelocity(item, item.angularVelocity * PUSHER_BOUNCE_DAMPING)
        }
      }
      syncDom()

      runSteps += substeps
      const pusherMoving = Math.abs(pusherTargetY - pusherY) > 0.05
      const allAsleep = !pusherMoving && bodies.every((b) => b.isSleeping)
      if (!allAsleep && runSteps < MAX_RUN_STEPS) {
        rafId = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }

    function wake() {
      if (running) return
      running = true
      runSteps = 0
      lastTickTime = 0
      rafId = requestAnimationFrame(tick)
    }

    // Batched to one rAF-scheduled read per frame instead of measuring
    // getBoundingClientRect synchronously on every native scroll event —
    // same pattern as ScrollRevealController's own scroll handling.
    let measureRafId = 0
    function onScrollOrResize() {
      if (measureRafId) return
      measureRafId = requestAnimationFrame(() => {
        measureRafId = 0

        // Mobile has no covering effect at all (see CaseStudyHero) — the
        // pusher just stays parked at the floor, nothing to pause or reset.
        if (!mql.matches) {
          pusherTargetY = measurePusherTargetY()
          wake()
          return
        }

        const p = coverProgress()

        if (p >= 1) {
          // Just became fully covered (or already was) — stop simulating
          // entirely. Frozen exactly as it was; nothing to see anyway.
          if (!heroFullyOut) {
            heroFullyOut = true
            running = false
            cancelAnimationFrame(rafId)
            // syncDom() forces each item's own inline `visibility: visible`
            // every tick (see below), which — being a more specific,
            // explicitly-set style — overrides the `visibility: hidden`
            // ScrollRevealController is about to apply to the ancestor
            // #cs-hero-frame. Clear it here so items actually inherit that
            // hidden state instead of staying stuck on screen, pinned by
            // the frame's `position: fixed`, over whatever scrolls under
            // it (e.g. the footer).
            itemRefs.current.forEach((el) => {
              if (el) el.style.visibility = ""
            })
          }
          return
        }

        if (heroFullyOut) {
          // On the way back, but not fully visible yet — stay frozen. Only
          // a full return resets, so a partial peek shows the same frozen
          // frame it did the instant it went fully out.
          if (p <= 0) {
            heroFullyOut = false
            buildSimulation()
            wake()
          }
          return
        }

        pusherTargetY = measurePusherTargetY()
        wake()
      })
    }

    buildSimulation()
    wake() // initial drop
    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize)
    mql.addEventListener("change", onScrollOrResize)

    return () => {
      cancelAnimationFrame(rafId)
      cancelAnimationFrame(measureRafId)
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
      mql.removeEventListener("change", onScrollOrResize)
      Matter.Composite.clear(engine.world, false)
      Matter.Engine.clear(engine)
    }
  }, [reduced, ready, isDesktopTier])

  // Wide enough to fill the frame's width, and for the part above the bar to
  // cover the visible hero's height — whichever is larger.
  const mobileWidth = `max(100cqw, var(--hw-visible-height) * ${mobileImg.width / (mobileImg.height - MOBILE_BAR_HEIGHT)})`

  return (
    // Matches #cs-hero-frame's own box, which is taller than the design
    // height by CaseStudyLayout's HERO_BG_EXTRA buffer — items don't inherit
    // that as a positioning error since their left/top are vw-based (see
    // syncDom), not relative to this box's resolved height.
    //
    // role="img" + aria-label describes the whole pile; each item image is
    // decorative (alt="") on its own.
    <div
      role="img"
      aria-label={project.title}
      className="absolute inset-x-0 top-0 h-full w-full"
    >
      <Image src={backgroundImg} alt="" fill className="object-cover" sizes="100vw" />

      {/* Below `lg` only — a flattened shot of the pile at rest, replacing
          the sim entirely (see LG_QUERY). Crossfades in on load.

          The image ends in a translucent white bar (its bottom
          MOBILE_BAR_HEIGHT px) that should never show. So instead of
          object-cover, the image is sized so just the part above the bar
          covers the visible hero, and the bar hangs off the bottom, clipped.
          The visible hero ends where #cs-content rests: COMPACT_HERO_HEIGHT
          from `sm` up (not this box, which also carries HERO_BG_EXTRA), and
          --radius-frame short of it below `sm`, where #cs-content's pull-up
          has no spacer giving it back. */}
      <div
        className={`absolute inset-x-0 top-0 overflow-hidden [container-type:inline-size] lg:hidden transition-opacity duration-500 ease-out ${
          mobileLoaded ? "opacity-100" : "opacity-0"
        } [--hw-visible-height:calc(var(--hw-compact-height)-var(--radius-frame))] sm:[--hw-visible-height:var(--hw-compact-height)] h-[var(--hw-visible-height)]`}
        style={{ ["--hw-compact-height" as string]: COMPACT_HERO_HEIGHT }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: mobileWidth,
            aspectRatio: `${mobileImg.width} / ${mobileImg.height}`,
            top: `calc(100% - ${mobileWidth} * ${(mobileImg.height - MOBILE_BAR_HEIGHT) / mobileImg.width})`,
          }}
        >
          <Image
            src={mobileImg}
            alt=""
            fill
            sizes="(min-width: 60rem) 0px, (max-aspect-ratio: 1/1) 100vh, 100vw"
            onLoad={() => setMobileLoaded(true)}
          />
        </div>
      </div>

      {ITEMS.map((item, i) => {
        const widthPct = (item.src.width / CANVAS_WIDTH) * 100
        // Reduced motion: skip the sim, render each item at its resting spot.
        const restLeftVw = (item.x / CANVAS_WIDTH) * 100
        const restTopVw = (item.y / CANVAS_WIDTH) * 100

        return (
          <div
            key={item.src.src}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            // hidden below `lg` (mobileImg stands in there); CSS-only so
            // these still start loading immediately on `lg`+.
            className="absolute hidden lg:block"
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
