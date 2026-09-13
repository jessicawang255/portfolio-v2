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

// Fixed simulation step — stability, not determinism now that the pusher
// (see below) is driven by live scroll input: a tick can run several of
// these substeps back to back to cover a big real-time gap (a fast fling
// between two rAF frames) without a single oversized step letting a fast
// body tunnel through another.
const FIXED_DT = 1000 / 60
const MAX_SUBSTEPS_PER_TICK = 8
// Resets every time the loop (re)starts (the initial drop, or a scroll/
// resize wake) — a safety net in case something never sleeps, e.g. the
// pusher resting exactly at a sticker's edge and jittering on numerical
// noise forever. ~20s of simulated time per run.
const MAX_RUN_STEPS = 1200

// Case studies only pin the hero and let #cs-content slide over it from
// `sm` up (see CaseStudyHero) — matches its DESKTOP_QUERY.
const DESKTOP_QUERY = "(min-width: 640px)"

// Matches the `lg` breakpoint CaseStudyHero switches its own height formula
// at (see heroCompactHeight.ts) — unrelated to DESKTOP_QUERY above (that one
// gates the cover/pin physics). This one only decides which "true" height
// the composition below should visually fill; see the `sync` effect below.
const COMPACT_TIER_QUERY = "(max-width: 1023.98px)"

// The settled pile's lowest sticker consistently rests ~3-4% short of the
// canvas's own floor line at every viewport width tested (rotated rectangles
// resting on a floor/each other don't tile it edge-to-edge) — this closes
// that gap with margin to spare. Safe to be generous: the excess is always
// clipped by itemsClipRef's own overflow-hidden, never visible.
const PILE_OVERSCAN = 1.06

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

// "Feel" of the drop, picked by comparing several candidates against each
// other (bounce/friction/gravity) and then several drop columns at that same
// feel (JITTER_X/JITTER_SEED) — see the git history for the rejected ones.
const GRAVITY_Y = 1.5
const RESTITUTION = 0.35
const FRICTION = 0.6
const FRICTION_AIR = 0.005
// Matter's default (0.001) scaled up — gravity accelerates every mass
// equally, so this doesn't change how the initial drop looks or feels, but
// a heavier sticker gains less velocity from the *same* collision impulse,
// so the pusher launches them a shorter distance on contact.
const ITEM_DENSITY = 0.01
const DROP_BASE = 400 // px above the canvas the back-most item starts from
const DROP_GAP = 220 // extra px per array index on top of DROP_BASE
const JITTER_X = 120 // max random horizontal offset added to each item's drop column
const JITTER_SEED = 11023 // seeds the jitter RNG so the pile replays identically every load

// Reads "has this component finished its first client render" without a
// setState-in-effect (flagged by this repo's lint config) — the standard
// useSyncExternalStore shape for a value that's fixed at false on the server
// (see useReducedMotion's own hydration comment below) and becomes fixed at
// true once mounted; the empty subscribe is fine since this never changes
// again after that, so nothing ever needs to notify a re-render.
function subscribeNever() {
  return () => {}
}
function getMountedSnapshot() {
  return true
}
function getMountedServerSnapshot() {
  return false
}

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
}: {
  project: Project
  backgroundImg: import("next/image").StaticImageData
}) {
  // Gated behind `mounted` rather than used directly: framer-motion resolves
  // `prefers-reduced-motion` synchronously against the real browser on the
  // client, but the server always renders as if it were off — when a
  // visitor's OS actually has it on, that's a real markup mismatch on the
  // very first hydration pass (confirmed via a hydration-mismatch warning
  // naming this exact tree), which React doesn't patch up: everything below
  // got stuck showing its initial (invisible, unpositioned) state instead of
  // the reduced-motion one. Forcing `false` until `mounted` flips (see
  // useSyncExternalStore helpers above) matches the server on first paint no
  // matter what the OS setting is, then a normal (non-hydration) re-render
  // picks up the real value right after.
  const rawReducedMotion = useReducedMotion()
  const mounted = useSyncExternalStore(subscribeNever, getMountedSnapshot, getMountedServerSnapshot)
  const reduced = mounted ? Boolean(rawReducedMotion) : false
  const [ready, setReady] = useState(false)
  const loadedCount = useRef(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const itemsClipRef = useRef<HTMLDivElement>(null)
  const itemsLayerRef = useRef<HTMLDivElement>(null)
  const compactProbeRef = useRef<HTMLDivElement>(null)
  const aspectRatio = backgroundImg.width / backgroundImg.height

  function handleItemLoad() {
    loadedCount.current += 1
    if (loadedCount.current >= ITEMS.length) setReady(true)
  }

  // Below `lg`, CaseStudyHero gives the hero a flat COMPACT_HERO_HEIGHT
  // instead of the aspect-ratio formula (see heroCompactHeight.ts) — taller
  // than the sticker composition's own natural `100vw / aspectRatio` height,
  // which otherwise left it cramped at the top with empty background below.
  // Scales the whole composition (this component's items — not the
  // background image, which already fills the box correctly on its own via
  // `object-cover`) up to fill that real height instead, matching how
  // HeroForeground crops rather than shrinks its image at the same
  // breakpoint. Independent of the physics effect below (which no-ops
  // under reduced motion) — this has to keep working for reduced-motion
  // users too, since their static rest positions need the same fix.
  //
  // Also applies a small overscan at *every* breakpoint, including `lg`+:
  // the settled pile's lowest sticker rests a few percent short of the
  // canvas's own floor line (confirmed against the pre-compact-tier code —
  // rotated rectangles resting on a floor/each other just don't tile it
  // edge-to-edge), which otherwise reads as a gap between the pile and
  // #cs-content below it. `itemsClipRef` is the real target-height box
  // (`overflow-hidden`); `itemsLayerRef` is the natural-height content
  // inside it, scaled up enough to guarantee it reaches that box's bottom
  // with a little to spare — the spare gets clipped, never visible.
  //
  // `scaleY`, not `scale`: the pile's left/right walls already sit exactly
  // on itemsLayerRef's own edges (0 and 100% width — see the physics
  // effect's CANVAS_WIDTH mapping), so it needs zero horizontal correction
  // at any breakpoint. A uniform `scale()` here stretched both axes from
  // "center top", so any sticker resting near a wall (by design — several
  // are meant to sit flush against the pile's edge) got pushed sideways
  // past it, straight into itemsClipRef's clip — exactly the "stickers go
  // outside the frame" bug this was. `scaleY` grows only downward from the
  // same origin, leaving every item's x position untouched.
  useEffect(() => {
    const mql = window.matchMedia(COMPACT_TIER_QUERY)

    function sync() {
      const clip = itemsClipRef.current
      const layer = itemsLayerRef.current
      const probe = compactProbeRef.current
      if (!clip || !layer) return
      const naturalHeight = window.innerWidth / aspectRatio
      const targetHeight = mql.matches && probe ? probe.getBoundingClientRect().height : naturalHeight
      clip.style.height = `${targetHeight}px`
      layer.style.transform =
        naturalHeight > 0 ? `scaleY(${(targetHeight / naturalHeight) * PILE_OVERSCAN})` : ""
    }

    sync()
    window.addEventListener("resize", sync)
    mql.addEventListener("change", sync)
    // Covers viewport-height-only changes (e.g. mobile browser chrome
    // show/hide affecting `svh`) that don't always fire `resize`.
    const ro = new ResizeObserver(sync)
    if (compactProbeRef.current) ro.observe(compactProbeRef.current)

    return () => {
      window.removeEventListener("resize", sync)
      mql.removeEventListener("change", sync)
      ro.disconnect()
    }
  }, [aspectRatio])

  useEffect(() => {
    if (reduced || !ready) return

    const mql = window.matchMedia(DESKTOP_QUERY)

    // Reassigned wholesale by buildSimulation() (on mount, and again on
    // every "scrolled fully out, then fully back" cycle — see
    // onScrollOrResize) — every function below reads these live rather than
    // closing over a one-time snapshot, so a rebuild takes effect immediately
    // without re-registering any listener.
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
        // vw, not %: keeps both axes on the same CANVAS_WIDTH-derived scale
        // (item width below is already vw-based via widthPct). The parent
        // layer's own box is exactly the natural `100vw / aspectRatio`
        // height this math assumes — see itemsLayerRef below — so this
        // doesn't need to account for any taller compact-tier box itself;
        // that layer gets scaled up as a whole instead (see the useEffect
        // above), carrying every vw-positioned item along with it.
        const leftVw = ((body.position.x - width / 2) / CANVAS_WIDTH) * 100
        const topVw = ((body.position.y - height / 2) / CANVAS_WIDTH) * 100
        const rotateDeg = (body.angle * 180) / Math.PI
        el.style.left = `${leftVw}vw`
        el.style.top = `${topVw}vw`
        el.style.transform = `rotate(${rotateDeg}deg)`
        el.style.visibility = "visible"
      })
    }

    // Builds (or rebuilds, on a full-visibility reset) the entire drop from
    // scratch — same starting conditions every time, so a reset genuinely
    // looks like the page was just loaded.
    function buildSimulation() {
      if (engine) {
        Matter.Composite.clear(engine.world, false)
        Matter.Engine.clear(engine)
      }

      const rng = mulberry32(JITTER_SEED)
      const jitterX = () => (rng() * 2 - 1) * JITTER_X

      engine = Matter.Engine.create()
      engine.gravity.y = GRAVITY_Y
      // Lets the loop actually stop between scrolls instead of ticking
      // forever — sleeping bodies still wake automatically the instant the
      // pusher (or anything else awake) touches them.
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

      // Floor sits at the canvas's bottom edge; walls at its left/right
      // edges — together they keep the pile inside the hero instead of
      // spilling past where #cs-hero-frame clips it (overflow-hidden). Only
      // collide with stickers (see CATEGORY_BOUNDARY), never the pusher
      // below, which starts out coincident with the floor at rest.
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

      // Stand-in for #cs-content's real top edge — repositioned every tick
      // to track it (see measurePusherTargetY), so scrolling the actual
      // frame over the hero physically shoves the pile out of its way
      // instead of just visually covering it. Rests exactly on the floor's
      // top surface at scroll position 0 (see PUSHER_THICKNESS/2 offset),
      // matching where the real content card sits at rest.
      pusher = Matter.Bodies.rectangle(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - PUSHER_THICKNESS / 2,
        CANVAS_WIDTH + WALL_THICKNESS * 2,
        PUSHER_THICKNESS,
        {
          // Low friction on purpose — a grippy contact between a full-width
          // bar and a tilted sticker imparts a lot of torque as it slides
          // underneath, which is what was flipping stickers end over end on
          // even a small push. It should shove them out of the way, not
          // spin them.
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

      // Position everything at its off-screen starting spot before the
      // first paint, so there's no frame where items flash in at (0, 0)
      // pre-drop (or, on a reset, flash at wherever they'd settled before).
      syncDom()
    }

    // #cs-content's real top edge, in canvas units — matches the vw-based
    // mapping syncDom uses, so the pusher and the stickers agree on scale.
    // Below `sm` there's no pinned/covering effect at all (see
    // CaseStudyHero), so the pusher just stays parked at the floor.
    function measurePusherTargetY() {
      if (!mql.matches) return CANVAS_HEIGHT - PUSHER_THICKNESS / 2
      const contentEl = document.getElementById("cs-content")
      if (!contentEl) return CANVAS_HEIGHT - PUSHER_THICKNESS / 2
      const screenTop = contentEl.getBoundingClientRect().top
      return (screenTop / window.innerWidth) * CANVAS_WIDTH - PUSHER_THICKNESS / 2
    }

    // Same 0–1 scroll progress ScrollRevealController drives the frame's
    // radius/fade from (p=0 at rest, p=1 once #cs-content has fully covered
    // the hero) — reusing it, rather than deriving our own threshold from
    // pusherTargetY, keeps "out of screen" exactly in sync with the point
    // the hero actually becomes invisible (heroFrameId gets
    // visibility:hidden at p>=1 — see ScrollRevealController).
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

      // Substep so a big real-time gap (a fast fling between two rAF
      // frames) still moves the pusher through many small, collision-safe
      // increments instead of one large jump a fast sticker could tunnel
      // through — see PUSHER_THICKNESS/MAX_SUBSTEPS_PER_TICK above.
      const substeps = Math.min(Math.max(Math.round(realDt / FIXED_DT), 1), MAX_SUBSTEPS_PER_TICK)
      const stepDelta = (pusherTargetY - pusherY) / substeps

      for (let i = 0; i < substeps; i++) {
        pusherY += stepDelta
        Matter.Body.setPosition(pusher, { x: pusher.position.x, y: pusherY })
        // Matter's velocity is "distance per Engine.update call" when delta
        // matches Common._baseDelta (1000/60, which FIXED_DT is) — so the
        // per-substep displacement *is* the velocity value here, not a
        // per-second figure. Lets the solver's contact response scale with
        // how fast the real scroll is actually moving.
        Matter.Body.setVelocity(pusher, { x: 0, y: stepDelta })
        Matter.Engine.update(engine, FIXED_DT)

        // Only clamps the *overshoot* past the pusher's own speed (the
        // launch), not the carrying motion itself — a sticker riding along
        // at the pusher's own speed isn't bouncing, it's just being pushed.
        // Angular velocity gets damped outright (not just the overshoot) —
        // a full-width bar sliding under a tilted sticker imparts a lot of
        // torque, which is what was flipping stickers end over end.
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
  }, [reduced, ready])

  return (
    // Always absolute/inset-0/h-full, matching #cs-hero-frame's own box at
    // every breakpoint — which has an explicit height throughout (compact
    // below `lg`, aspect-ratio-driven at `lg`+ — see CaseStudyHero) and is
    // taller than the design height by CaseStudyLayout's HERO_BG_EXTRA
    // buffer, so the background still reaches the frame's true bottom edge
    // instead of leaving a gap that peeks through #cs-content's rounded
    // corner.
    //
    // role="img" + aria-label carries the one description the old single
    // flattened image gave AT users — every item image below is decorative
    // (alt="") since none of them individually represents the case study.
    <div
      role="img"
      aria-label={project.title}
      className="absolute inset-x-0 top-0 h-full w-full"
    >
      <Image src={backgroundImg} alt="" fill className="object-cover" sizes="100vw" />

      {/* Invisible — exists only so the `sync` effect above can read
          COMPACT_HERO_HEIGHT as real pixels via getBoundingClientRect,
          rather than parsing the CSS string by hand (stays correct even if
          that value's syntax changes, e.g. to a calc()). */}
      <div
        ref={compactProbeRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-0 w-px"
        style={{ height: COMPACT_HERO_HEIGHT }}
      />

      {/* itemsClipRef: the *real* target-height box — COMPACT_HERO_HEIGHT
          below `lg`, the natural `100vw / aspectRatio` formula at `lg`+ (both
          set imperatively by the useEffect above; the inline height here is
          only the SSR/pre-mount fallback, matching the `lg`+ value). Its
          `overflow-hidden` is what actually crops the composition — both the
          intentional side-crop below `lg` and PILE_OVERSCAN's intentional
          bottom overshoot at every breakpoint.

          itemsLayerRef inside it holds the actual items, at their natural
          (unscaled) height, transformed up by the useEffect. transform-origin
          is "center top", not "center center": this box's own top edge
          already coincides with itemsClipRef's top (both are 0), so scaling
          from there keeps that edge fixed and grows the box downward —
          landing flush with (and slightly past, by design — see
          PILE_OVERSCAN) itemsClipRef's bottom. "center center" scales around
          this box's own (much higher, since it's short pre-scale) center
          instead, which pushes the whole composition upward — clipped at the
          top, short at the bottom.

          Items' left/top stay vw-based (see syncDom/rest values below) —
          relative to itemsLayerRef's un-scaled box, not itemsClipRef's
          (taller) one. */}
      <div
        ref={itemsClipRef}
        className="absolute left-0 top-0 w-full overflow-hidden"
        style={{ height: `calc(100vw / ${aspectRatio})` }}
      >
        <div
          ref={itemsLayerRef}
          className="absolute left-0 top-0 w-full"
          style={{ height: `calc(100vw / ${aspectRatio})`, transformOrigin: "center top" }}
        >
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
      </div>
    </div>
  )
}
