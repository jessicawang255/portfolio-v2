"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { Variants } from "framer-motion"
import { IPhoneFrame, IPHONE_SCREEN_WIDTH, IPHONE_SCREEN_HEIGHT, IPHONE_FRAME_HEIGHT } from "./IPhoneFrame"

type Screen = {
  src: string
  // Real exported pixel dimensions of this crop — not all crops share one
  // aspect ratio (the Home screen's is a different export than the rest),
  // so next/image needs the true value per screen rather than one shared
  // constant. Only used as next/image's intrinsic size hint; the rendered
  // size is pinned by the fixed height:474/width:auto below regardless.
  width: number
  height: number
  alt: string
  body: string
  note?: string
}

type FlowSet = {
  label: string
  screens: Screen[]
}

type Flow = {
  id: string
  label: string
  sets: FlowSet[]
}

type ScreenSpotlightProps = {
  flows: Flow[]
  className?: string
}

// The phone screen's own fixed window — constant across every crop
// regardless of its real aspect ratio (see the scroll container below).
// Reuses IPhoneFrame's own screen-cutout size rather than a second,
// possibly-drifting constant, since the two have to match exactly.
const PHONE_WIDTH = IPHONE_SCREEN_WIDTH
const PHONE_HEIGHT = IPHONE_SCREEN_HEIGHT

// The card wrapping IPhoneFrame — frame height plus this card's own
// vertical padding (see its py-[34px] below, mirrored here as a constant
// so the two can't drift apart). Everything inside that card (frame image,
// status bar, screen window) is laid out in real px against this exact
// 316-wide design, not percentages — so shrinking the card's own CSS width
// alone wouldn't shrink any of them, just clip or overflow past it. The
// fluid-scale effect below instead measures how much narrower the card is
// rendering than this native size and scales the whole card down by that
// same factor via `transform`, so frame/status-bar/screen-window all shrink
// together, in proportion, exactly like the fixed 316px version just
// smaller — rather than the card scrolling, wrapping, or clipping past a
// column too narrow for its designed size.
const PHONE_CARD_WIDTH = 316
const PHONE_CARD_VERTICAL_PADDING = 34
const PHONE_CARD_HEIGHT = IPHONE_FRAME_HEIGHT + PHONE_CARD_VERTICAL_PADDING * 2

function clampIndex(i: number, length: number) {
  if (length <= 0) return 0
  return Math.max(0, Math.min(length - 1, i))
}

type ScreenPosition = { flow: number; set: number; idx: number }

// Prev/next don't stop at the current set's edge — they walk forward/back
// across sets, then across flows, landing on the next (or previous) set
// that actually has screens (Songs/Audio bytes/etc. are still empty
// placeholders and get stepped over rather than landed on, same as they
// already aren't reachable via their own thumbnail row).
function nextScreenPosition(flows: Flow[], pos: ScreenPosition): ScreenPosition | null {
  const currentSets = flows[pos.flow].sets
  if (pos.idx < currentSets[pos.set].screens.length - 1) {
    return { flow: pos.flow, set: pos.set, idx: pos.idx + 1 }
  }
  for (let s = pos.set + 1; s < currentSets.length; s++) {
    if (currentSets[s].screens.length > 0) return { flow: pos.flow, set: s, idx: 0 }
  }
  for (let f = pos.flow + 1; f < flows.length; f++) {
    for (let s = 0; s < flows[f].sets.length; s++) {
      if (flows[f].sets[s].screens.length > 0) return { flow: f, set: s, idx: 0 }
    }
  }
  return null
}

function prevScreenPosition(flows: Flow[], pos: ScreenPosition): ScreenPosition | null {
  if (pos.idx > 0) {
    return { flow: pos.flow, set: pos.set, idx: pos.idx - 1 }
  }
  const currentSets = flows[pos.flow].sets
  for (let s = pos.set - 1; s >= 0; s--) {
    const length = currentSets[s].screens.length
    if (length > 0) return { flow: pos.flow, set: s, idx: length - 1 }
  }
  for (let f = pos.flow - 1; f >= 0; f--) {
    const sets = flows[f].sets
    for (let s = sets.length - 1; s >= 0; s--) {
      const length = sets[s].screens.length
      if (length > 0) return { flow: f, set: s, idx: length - 1 }
    }
  }
  return null
}

// The swappable screen + rationale copy cross-fade with the same blur
// AboutContent.tsx's hover sticky panel uses for its own content swap —
// blur(2px)<->blur(0px), 100ms, easeOut, identical in and out — for every
// trigger (tab, chip, thumbnail, prev/next) rather than singling out tab
// switches for something more prominent. (A second, "bigger" tier for tab
// switches — first a directional slide, then a section-entrance lift — was
// tried and dropped in favor of one consistent transition everywhere.)
// The rationale copy skips this transition specifically when consecutive
// screens share the same body text — see rationaleKey below.
const screenTransitionVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(2px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.1, ease: "easeOut" } },
  exit: { opacity: 0, filter: "blur(2px)", transition: { duration: 0.1, ease: "easeOut" } },
}

// Reused for both the chip row's own mount/unmount and the layout shift it
// causes below it — same --duration-base/--ease-out already driving the
// tab indicator's slide a few lines up in the DOM, so a flow switch that
// gains or loses the chip row moves at the same pace as the underline
// tracking it.
const LAYOUT_TRANSITION = { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }

// The chip row's own fade is a second, independent layer nested inside the
// height/margin slide above — not the same opacity value driving both.
// Tying one opacity keyframe to the same 0–1 progress as the height grow
// means the visible sliver is only ever as opaque as it is tall (13%
// opacity at 25% height, and so on), which reads as the box growing, not
// as anything fading. --duration-fast (already used for every other
// color/opacity transition in this component) finishes before the slide
// does, so the chips are at full opacity partway through and the rest of
// the slide reads as its own, separate motion.
const CHIP_FADE_TRANSITION = { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }

// ScreenSpotlight: a flow-tabbed screen spotlight for a case study's final-product section:
// pick a flow, optionally narrow to a set within it, and step through that
// set's screens one at a time with a phone-frame mockup + rationale copy.
// State is three raw indices (flow/set/idx) rather than resolved objects.
// A tab or chip click (goToFlow/goToSet below) resets idx (and, for a flow
// switch, set) back to 0 — each flow/set is its own story, so switching to
// one lands on its own start, the same way switching a browser or docs-site
// tab always shows that tab's own top rather than wherever a *different*
// tab happened to be scrolled to. This used to carry the raw idx over
// instead (stepping to screen 3 of one flow, then tabbing elsewhere, landed
// on whatever screen 3 clamped to over there) — technically never broken,
// since clampIndex always kept it in range, but landing on an arbitrary
// mid-flow screen with no relation to the new flow's own narrative read as
// janky rather than intentional. Direct stepping (goTo, prev/next) is
// unaffected — walking continuously across a flow/set boundary is a
// different action from jumping to a different one, and keeps landing on
// whatever specific screen that walk actually reaches.
export function ScreenSpotlight({ flows, className }: ScreenSpotlightProps) {
  const [flow, setFlow] = useState(0)
  const [set, setSet] = useState(0)
  const [idx, setIdx] = useState(0)

  const activeFlow = flows[clampIndex(flow, flows.length)]
  const activeSetIdx = clampIndex(set, activeFlow.sets.length)
  const activeSet = activeFlow.sets[activeSetIdx]
  const hasScreens = activeSet.screens.length > 0
  const activeIdx = clampIndex(idx, activeSet.screens.length)
  const activeScreen = hasScreens ? activeSet.screens[activeIdx] : undefined

  const reduce = useReducedMotion()
  // Changes exactly when the visible screen changes, regardless of which
  // index moved — what the screen-crop AnimatePresence below swaps on.
  const contentKey = `${flow}-${activeSetIdx}-${activeIdx}`

  // The rationale panel swaps on its own key instead: scoped to flow+set
  // (so it still resets on a tab/chip change even if two flows happen to
  // reuse the same sentence) but keyed on the body text itself rather than
  // the index. Several screens in a row that share one description — e.g.
  // photos-1/photos-2 both read "Add photos to your capsule." — resolve to
  // the same key, so React leaves that motion.div mounted across the step
  // instead of exiting and re-entering it; the copy just sits still while
  // the phone crop beside it still cross-fades on every step via
  // contentKey. Falls back to contentKey when there's no screen (the
  // "crop not exported yet" placeholder has no body to key on).
  const rationaleKey = activeScreen ? `${flow}-${activeSetIdx}-${activeScreen.body}` : contentKey

  // Resolved once per render off the *active* (clamped) position, not the
  // raw flow/set/idx state — prev/next should walk from what's actually on
  // screen. null means there's nothing further that way (start/end of the
  // whole spotlight), which is what disables each button.
  const activeFlowIdx = clampIndex(flow, flows.length)
  const activePosition: ScreenPosition = { flow: activeFlowIdx, set: activeSetIdx, idx: activeIdx }
  const nextPosition = nextScreenPosition(flows, activePosition)
  const prevPosition = prevScreenPosition(flows, activePosition)

  function goTo(position: ScreenPosition) {
    setFlow(position.flow)
    setSet(position.set)
    setIdx(position.idx)
  }

  // Tab/chip clicks — unlike goTo above, these deliberately don't carry the
  // current idx (or, for a flow switch, set) over: picking a different flow
  // or set is choosing a different story to look at, not stepping further
  // through the current one, so it should land on that story's own start —
  // same as switching a browser tab or a docs-site tab always shows that
  // tab's own top, never wherever a *different* tab happened to scroll to.
  // See the component doc comment above for why this isn't just "keep
  // whatever idx clamps to."
  function goToFlow(i: number) {
    setFlow(i)
    setSet(0)
    setIdx(0)
  }

  function goToSet(i: number) {
    setSet(i)
    setIdx(0)
  }

  // The device frame itself (bezel, status bar, Dynamic Island) is fixed —
  // it never re-renders let alone animates between screens, tabs, or flows.
  // Only screenContent, its children, swaps and gets the blur cross-fade;
  // everything about the physical phone stays exactly where it is the
  // entire time you're browsing the spotlight.
  const screenContent = activeScreen ? (
    // IPhoneFrame's own screen window is a fixed 219×474 area regardless of
    // the crop's own aspect ratio — most crops fill it exactly, but a few
    // (Home's, for one) are taller than a single phone screen. Rather than
    // shrinking those down to fit (which would render their text noticeably
    // smaller than every other screen), the image renders at the same
    // fixed width as the rest and that window scrolls to reveal the
    // remainder, so the frame itself never changes size between screens.
    <Image
      src={activeScreen.src}
      alt={activeScreen.alt}
      width={activeScreen.width}
      height={activeScreen.height}
      draggable={false}
      className="select-none"
      style={{ width: PHONE_WIDTH, height: "auto", display: "block" }}
    />
  ) : (
    // TEMPORARY: comes out once every screen in `flows` below has a real
    // exported crop — this branch only exists because Songs/Audio bytes
    // are placeholders for now. Sits inside the frame's own screen cutout
    // (hence the dark styling, not the light card it used to sit in as a
    // standalone box) now that the frame itself is always present.
    <div
      className="flex h-full items-center justify-center text-center font-mono text-[10px] uppercase text-neutral-500"
      style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT }}
    >
      Crop not exported yet
    </div>
  )

  // max-w-[370px]/[340px] only apply from `lg` up, where this text
  // shares a row with the phone card and the cap is doing real work — a
  // comfortable reading measure rather than however wide the leftover flex
  // space happens to be. Below `lg` the rationale sits in its own
  // full-width row under the phone (see the main row's lg:flex-row
  // below), so the same cap would just wrap it into a narrow column inside
  // an otherwise full-width case-study page for no reason — max-w-full
  // there lets it use the whole column instead.
  const rationaleContent = activeScreen ? (
    <>
      <p
        className="max-w-full text-base leading-normal text-neutral-600 lg:max-w-[370px]"
        style={{ textWrap: "pretty" }}
      >
        {activeScreen.body}
      </p>
      {activeScreen.note && (
        <p className="mt-[18px] max-w-full text-xs italic text-neutral-300 lg:max-w-[340px]">
          {activeScreen.note}
        </p>
      )}
    </>
  ) : null

  // Pulled out for the same reason as screenContent/rationaleContent above —
  // reused identically by the reduced-motion and animated branches of the
  // chip row below.
  const chipButtons = activeFlow.sets.map((s, i) => {
    const active = i === activeSetIdx
    return (
      <button
        key={s.label}
        type="button"
        onClick={() => goToSet(i)}
        aria-current={active}
        className={`screen-chip rounded-full border px-3.5 py-[7px] text-xs transition-colors duration-fast ease-out ${
          active
            ? "border-[var(--cs-accent)]/35 bg-[var(--cs-accent)]/6 text-[var(--cs-accent)]"
            : "border-transparent bg-neutral-75 text-neutral-500 hover:border-neutral-900/3 hover:text-primary"
        }`}
      >
        {s.label}
      </button>
    )
  })

  // A single shared underline that slides/resizes between tabs, rather than
  // each tab owning its own indicator that just appears/disappears — measured
  // off the actual button DOM (offsetLeft/offsetWidth are already relative to
  // the row below, since it's each button's positioned offsetParent) instead
  // of computed from index/label, since tab widths vary with their text.
  // useLayoutEffect (not useEffect) so the very first position is committed
  // before paint — otherwise the indicator would visibly slide in from 0 on
  // mount instead of just appearing already in place.
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    function measure() {
      const el = tabRefs.current[clampIndex(flow, flows.length)]
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [flow, flows.length])

  // Fluid-scale for the phone card — see PHONE_CARD_WIDTH above and the
  // width rules in the JSX below. Below `lg` the card is w-full
  // (capped at max-w-[316px]); from `lg` up it's flex-basis-driven,
  // shrinking below 316px only once the rationale column beside it has
  // already given up all it can (see that column's own note on the flex
  // priority) — so resizing a desktop window narrower visibly shrinks it
  // too, not just the rationale column.
  // A ResizeObserver on the card itself, not a window-resize listener like
  // the indicator above: this card's own rendered width also changes
  // whenever the *rationale column* beside it reflows (a longer/shorter
  // caption, the chip row appearing/disappearing) even when the window
  // itself hasn't been resized, and only a direct observer on the card
  // catches that.
  const phoneCardRef = useRef<HTMLDivElement>(null)
  const [frameScale, setFrameScale] = useState(1)

  useLayoutEffect(() => {
    const el = phoneCardRef.current
    if (!el) return
    function measure() {
      if (!el) return
      // No Math.min(1, …) clamp — below `md` the card is meant to scale up
      // on a wide phone too, not just down on a narrow one, so it always
      // reads as the same proportion of the column rather than a fixed
      // design size with a shrink-only escape hatch.
      setFrameScale(el.getBoundingClientRect().width / PHONE_CARD_WIDTH)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Screen-index thumbnail row, every breakpoint: fixed at its 52px design
  // width always, scrolling horizontally instead of shrinking. Unlike the
  // flow tabs (a small, finite set you want fully visible at once — that's
  // why *those* became wrapping pills, not a scroll, on mobile), this row is
  // a sequential filmstrip already paired with prev/next + a counter, and
  // this codebase already treats that shape as scroll-native
  // (IterationCarousel's own track).
  // This used to shrink-to-fit only at `lg`+ (staying fixed-and-
  // scrolling below it), with a THUMB_MIN_WIDTH floor protecting legibility
  // once squeezed. That floor was a *per-thumbnail* number, so the row's
  // total min-content width — and therefore how much room the phone card
  // beside it (see PHONE_CARD_WIDTH/frameScale above) had left to render
  // at — scaled with however many screens happened to be in the active
  // flow/set: a 6-screen flow left less room for the phone than a 2-screen
  // one at the exact same viewport width, so the same spotlight rendered a
  // different-sized phone depending only on which tab was open. Fixing the
  // row at its design width everywhere, and paired with an explicit
  // count-independent min-width on the rationale column around it (see
  // that column's own comment further down for why the row's own
  // overflow-x-auto isn't, by itself, enough to stop this width from
  // bubbling up), removes that dependency: the phone card's size becomes a
  // function of the row's own available width alone — proportional to the
  // container, not to the thumbnail count.
  // Two behaviors this needs that a shrink-to-fit version wouldn't:
  const thumbTrackRef = useRef<HTMLDivElement>(null)
  const thumbButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [thumbAtEnd, setThumbAtEnd] = useState(false)

  // 1. The right-edge fade (below, next to the track in the JSX) has to
  // know when to disappear — a real scrollable row, unlike IterationCarousel's
  // one-slide-always-peeking track, can genuinely run out of content to
  // hint at, and a fade with nothing left to fade into just reads as a
  // stuck smudge over the last thumbnail.
  useEffect(() => {
    const el = thumbTrackRef.current
    if (!el) return
    function update() {
      if (!el) return
      setThumbAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
    }
    update()
    el.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      el.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [activeFlowIdx, activeSetIdx])

  // 2. Stepping with prev/next (or a chip/tab switch) moves activeIdx
  // without touching this row's own scroll position — without this, the
  // active/highlighted thumbnail can silently scroll out of view, leaving
  // only the "n/total" counter to tell you where you are. Scrolls just far
  // enough to bring it back on-screen (not to the row's own start/center)
  // so stepping through several screens in a row doesn't jitter the strip
  // more than it has to.
  useEffect(() => {
    const track = thumbTrackRef.current
    const btn = thumbButtonRefs.current[activeIdx]
    if (!track || !btn) return
    const trackRect = track.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    if (btnRect.left < trackRect.left) {
      track.scrollBy({ left: btnRect.left - trackRect.left, behavior: "smooth" })
    } else if (btnRect.right > trackRect.right) {
      track.scrollBy({ left: btnRect.right - trackRect.right, behavior: "smooth" })
    }
  }, [activeIdx, activeFlowIdx, activeSetIdx])

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      {/* Tab row — one tab per flow, `lg`+ only (see that
          breakpoint's own comment in globals.css for why it's much later
          than `md`: tested live, this side-by-side treatment stays
          genuinely cramped — tab labels clipped past the viewport edge,
          the thumbnail row below running out of room — well past `md`
          itself). Used to be horizontally scrollable + no-scrollbar below
          `md`, but on a real mobile column the labels alone (~440px, four
          flows) run well past the ~336px available, and overflow-x-auto
          with no scrollbar leaves no on-screen cue there's more to drag to
          — see the wrapping pill row just below, which replaces this below
          `lg`.
          The gray divider is a separate absolute strip rather than a border
          on this container, and the purple indicator is one shared absolute
          div (positioned/sized off the measurement above) rather than each
          tab owning its own underline — a border-b-2 + -mb-px on the button
          only approximates the container's border position (it depends on
          the button's stretched height landing exactly on the container's
          own border box, which drifts by a couple px in practice), and a
          per-tab span could only ever fade in/out, not slide between tabs.
          All three — gray strip, purple indicator, buttons — share the same
          `bottom: 0` coordinate: the buttons stretch (default flex
          align-items) to the container's cross-size, so a button's own
          bottom edge is geometrically identical to the container's,
          guaranteeing every strip lands on the same pixel row. */}
      <div className="relative hidden gap-[18px] lg:flex">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-neutral-100" />
        {indicator && (
          <div
            aria-hidden="true"
            className="screen-tab-indicator pointer-events-none absolute bottom-0 h-[2px] bg-[var(--cs-accent)]"
            style={{
              left: indicator.left,
              width: indicator.width,
              transition: "left var(--duration-base) var(--ease-out), width var(--duration-base) var(--ease-out)",
            }}
          />
        )}
        {flows.map((f, i) => {
          const active = i === flow
          return (
            <button
              key={f.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              onClick={() => goToFlow(i)}
              aria-current={active}
              className={`screen-tab shrink-0 whitespace-nowrap px-0.5 pb-3 text-sm leading-[1.5] transition-colors duration-fast ease-out ${
                active ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Mobile flow nav, below `lg` — filled pills that wrap instead of
          scrolling, the same fix the chip row below already uses
          (flex-wrap, no scroll) for its own set-level nav, just applied one
          level up. text-sm/leading-[1.5] matches screen-tab's own font
          exactly — same top-level nav, just a pill on mobile instead of an
          underline, so the type should read as one nav rather than two
          differently-scaled ones. The active fill is solid
          bg-[var(--cs-accent)] (not the chip row's accent-*tint*) — still
          reads as its own, higher level than the chips on flows like
          "Creating a capsule" that show both rows at once, since a solid
          fill and a light tint are visually distinct even sharing one hue.
          No sliding indicator here — an active pill's own fill already
          marks it, so there's nothing for an underline to add. */}
      <div className="flex flex-wrap gap-2 lg:hidden">
        {flows.map((f, i) => {
          const active = i === flow
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => goToFlow(i)}
              aria-current={active}
              className={`rounded-full border px-3.5 py-[7px] text-sm leading-[1.5] transition-colors duration-fast ease-out ${
                active
                  ? "border-transparent bg-[var(--cs-accent)] text-neutral-50"
                  : "border-transparent bg-neutral-75 text-neutral-500 hover:border-neutral-900/3 hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Chip row — only when the active flow has more than one set. Every
          chip stays a filled pill (not just the active one) — a borderless
          treatment here would read as a continuation of the borderless tab
          row right above it, rather than its own distinct level of
          navigation. bg-[var(--cs-accent)]/6 reuses Callout's own tint
          rather than introducing a new opacity value. */}
      {reduce ? (
        activeFlow.sets.length > 1 && (
          <div className="mt-[22px] flex flex-wrap gap-2">{chipButtons}</div>
        )
      ) : (
        // AnimatePresence itself stays mounted continuously — only its
        // child is conditional — so it's still around to play the exit
        // animation on the render where a flow with chips loses them, not
        // just the enter animation on the render where one gains them.
        // `layout` (in addition to its own height/margin animation) plus
        // on the main row below lets both FLIP-animate to their new
        // position together instead of one popping while the other
        // slides. opacity gets its own, faster entry in the `transition`
        // map below rather than sharing height/marginTop's pace — nesting
        // a second AnimatePresence to stagger it doesn't work here: once
        // this element's removal is intercepted for its own exit,
        // AnimatePresence keeps re-rendering the exact JSX it captured at
        // that instant, so anything nested inside — including a second
        // conditional gating an inner AnimatePresence — is frozen at
        // whatever it evaluated to at capture time and never gets a
        // chance to re-evaluate to false. A single element with per-key
        // transitions doesn't have that problem, since it's the same
        // instance carrying its own exit the whole time, not something
        // relying on a fresh re-render to notice anything changed.
        <AnimatePresence initial={false}>
          {activeFlow.sets.length > 1 && (
            <motion.div
              key="chip-row"
              layout
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 22 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ ...LAYOUT_TRANSITION, opacity: CHIP_FADE_TRANSITION }}
              className="flex flex-wrap gap-2 overflow-hidden"
            >
              {chipButtons}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Main row — phone frame, then rationale/footnote/controls, the
          controls pinned to the frame's bottom edge via mt-auto — but only
          from `lg` up, where this column is stretched to match the
          phone card's own (often taller) height, so there's real leftover
          space for an auto margin to push into. Below `lg` this is
          a stacked column with no such extra height — mt-auto there
          resolves to 0 (no free space to distribute), which is what was
          collapsing the gap between the caption and the thumbnail row
          right down to nothing; mt-8 gives that pairing an explicit,
          real gap on mobile instead of leaning on a margin that only does
          anything in the side-by-side layout.
          `layout` (off under reduced motion) is what turns the chip row
          above appearing/disappearing into this row sliding to its new
          position instead of jumping there — the same mechanism also
          smooths out ordinary height differences between one screen's
          rationale copy and the next's. */}
      <motion.div
        layout={!reduce}
        transition={LAYOUT_TRANSITION}
        className="mt-[26px] flex flex-col items-stretch gap-10 lg:flex-row"
      >
        {/* Outer box — reserves the *scaled* footprint in the flow via
            aspect-ratio (locked to the card's true 316:PHONE_CARD_HEIGHT
            design ratio). No auto margins anywhere, so it's flush left at
            every breakpoint — below `lg` that lines it up with the
            flow pills above and the caption/thumbnails below (all flush
            left themselves), rather than centering it as its own,
            differently-aligned island in that stack; from `lg` up
            there's no leftover width to center within anyway, since the
            card's own flex-basis is what determines the row's width there.
            Below `lg` it's w-full (the sole content
            of its own row there, so max-w-[316px] is the only thing
            capping it). From `lg` up, width comes from flex
            instead — basis-[316px] grow-0 shrink: this card *wants* to
            render at the original
            316px design size and never grow past it, but it's not
            shrink-0 either, so ordinary flexbox lets it give up width once
            the row can't fit both it and the rationale column beside it.
            How much it gives up is meant to depend only on the row's own
            available width — proportional to the container as a whole —
            never on how many screens happen to be in the active flow/set.
            That's why the thumbnail row beside it (further down) is a
            fixed-width, always-scrolling filmstrip rather than something
            that shrinks with a per-item floor, *and* why the rationale
            column now carries its own explicit min-width instead of
            leaving that at the flex default (see that column's own
            comment for why the scrolling row alone doesn't stop its width
            from bubbling up): a shrink-to-fit thumbnail row's total
            min-content width scales with its screen count, and with no
            floor of its own the rationale column's automatic min-width
            just inherits that count-dependent number — a different floor
            for every flow/set, handing this card a different amount of
            leftover space at the same viewport width depending only on
            which tab was open. A fixed, explicit min-width instead pins
            that floor to one number regardless of count, so the only thing
            left setting the split between this card and that column is the
            row's own available width.
            lg:min-w-[150px] is this card's own floor, so that
            split has a bottom: this box's automatic min-width would
            otherwise resolve to something close to 0 (nothing inside it —
            an absolutely-positioned, transform-scaled IPhoneFrame — is the
            kind of content that normally forces a flex item to keep a
            sensible minimum, the way the rationale column's own text
            does), so without an explicit floor a genuinely cramped width
            right at `lg` — still inside the `md`–`xl` tier,
            where CaseStudyLayout reserves real space for the TOC — could
            shrink this all the way to an invisible sliver rather than a
            small-but-present phone.
            The ResizeObserver below just reads back whichever width this
            resolves to (design-size, mid-shrink, or fully squeezed) so the
            inner card can scale its real, fixed-px content to match.
            overflow-hidden matters here, not just for tidiness: the inner
            card below is transform-scaled, and transform never changes an
            element's own layout size — only its paint. So the inner card's
            true *layout* footprint stays the full, unscaled 316×PHONE_CARD_
            HEIGHT no matter how small it's visually rendering, and without
            overflow-hidden this box's own auto/aspect-ratio height gets
            pulled back up to fit that full-size content, same as any
            aspect-ratio box whose content doesn't actually fit it. Clipping
            here only ever removes that phantom reserved space below/right
            of the visibly-scaled card — nothing the scaled-down card
            actually paints falls outside its own scaled bounds.
            bg-neutral-75 — matching the inner card's own background below,
            not decorative — is what's actually behind the white strip that
            could briefly flash at the bottom edge on mobile: this box's
            aspect-ratio-computed height and the inner card's transform-
            scaled height both derive from the same width via the same
            math, but on different clocks (this box resolves synchronously
            in CSS the moment its width is known; frameScale only updates
            once the ResizeObserver's callback actually fires), so for a
            frame or two after something shifts this box's own width —
            most visibly right as the screen image finishes loading — the
            two can disagree by a hair. Un-backgrounded, that sliver showed
            the page's white surface through; matching the card's own color
            means any such gap just reads as slightly more of the same
            card instead of a visible seam.
            `layout` (off under reduced motion, same as the row below) is
            load-bearing, not decorative, below `lg`: this box's own true
            size never changes between screens (fixed aspect-ratio against a
            container width that isn't moving), but it sits inside the main
            row's own `layout` animation just below, stacked directly above
            the rationale column in that row's mobile flex-col. Rationale
            copy length varies screen to screen, so that row's total height
            genuinely does change on every step — and framer-motion's layout
            animation smooths *that* by scaling the row element itself from
            old height to new, a transform which, left uncorrected, paints
            every plain (non-`layout`) descendant squished/stretched right
            along with it — this card and its phone screen included. Giving
            this card `layout` of its own makes it a projection node in the
            same tree, so framer-motion applies the matching counter-scale
            that cancels the inherited distortion back out, the same
            correction it already applies between nested `layout` elements.
            From `lg` up the row is flex-row instead, so its height is
            whichever column is taller — almost always this fixed-height
            card, not the much shorter rationale text — which is why this
            never showed up on desktop: the row's height rarely actually
            changes there, so there's rarely a scale to correct in the first
            place. */}
        <motion.div
          layout={!reduce}
          ref={phoneCardRef}
          className="w-full max-w-[316px] shrink-0 overflow-hidden rounded-[8px] bg-neutral-75 lg:w-auto lg:min-w-[150px] lg:shrink lg:grow-0 lg:basis-[316px]"
          style={{ aspectRatio: `${PHONE_CARD_WIDTH} / ${PHONE_CARD_HEIGHT}` }}
        >
          {/* Inner card — always laid out at its true 316×PHONE_CARD_HEIGHT
              design size (so IPhoneFrame's own real-px children position
              correctly against it), then visually scaled — up or down — to
              match the outer box via `transform`. transform-origin: top
              left matches the outer box's own top-left-anchored
              aspect-ratio sizing, so the scaled card's edges land exactly
              on the reserved box's edges rather than the two disagreeing
              about which corner to grow/shrink from. */}
          <div
            className="rounded-[8px] border border-neutral-100 bg-neutral-75 py-[34px]"
            style={{
              width: PHONE_CARD_WIDTH,
              height: PHONE_CARD_HEIGHT,
              transform: `scale(${frameScale})`,
              transformOrigin: "top left",
            }}
          >
            <div className="flex h-full items-center justify-center">
              {/* IPhoneFrame itself — bezel, status bar, screen cutout — is
                  outside the AnimatePresence below and never keyed on
                  contentKey, so it's never unmounted/remounted between
                  screens; only its children (the actual crop) swap. */}
              <IPhoneFrame>
                {reduce ? (
                  screenContent
                ) : (
                  // key changes with the visible screen — AnimatePresence
                  // swaps the outgoing/incoming pair with the cross-fade
                  // above, scoped to just the crop inside the fixed frame.
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={contentKey}
                      variants={screenTransitionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {screenContent}
                    </motion.div>
                  </AnimatePresence>
                )}
              </IPhoneFrame>
            </div>
          </div>
        </motion.div>

        {/* min-w-0 here (used not to have one) plus an explicit
            lg:min-w-[180px] floor in its place. The old approach
            left this at the flex default (min-width: auto) and let the
            browser's own min-content calculation become this column's real
            floor — the assumption being that, with the thumbnail row now a
            scroll container (see its own comment below), that calculation
            would land on a fixed, count-independent number. It doesn't:
            the "an overflow:auto element reports an automatic minimum size
            of 0" rule is specifically about how *that element itself*
            behaves as a flex item along the shrinking axis — it does not
            zero out that element's min-content contribution to an
            *ancestor* several levels up (through the plain block/column-
            flex wrappers between the track and this column) that still has
            the default overflow: visible. So this column's automatic
            min-width kept bubbling up from the track's real content width
            — 52px × however many screens the active set has, plus gaps —
            which is exactly the count-dependent floor this whole fix is
            trying to remove. min-w-0 bypasses that calculation outright,
            and the explicit min-width takes its place as this column's
            floor instead: a fixed number, so the split between this column
            and the phone card beside it (flex-shrink enabled, see above)
            depends only on the row's own available width, never on how
            many thumbnails happen to be in whichever flow/set is open. */}
        <div className="flex min-w-0 flex-1 flex-col pt-1.5 lg:min-w-[180px]">
          {reduce ? (
            rationaleContent
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {rationaleContent && (
                <motion.div
                  key={rationaleKey}
                  variants={screenTransitionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {rationaleContent}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {hasScreens && (
            <div className="mt-8 flex flex-col gap-[18px] lg:mt-auto">
              <div className="relative">
                {/* w-[52px] shrink-0 fixes every thumbnail at its designed
                    size, at every breakpoint — overflow-x-auto lets the row
                    scroll instead of shrinking them to fit, with
                    snap-x/snap-start landing a drag on a thumbnail rather
                    than half between two. This used to revert to a
                    shrink-with-a-floor behavior from `lg` up
                    instead, but that made the row's min-content width (and
                    therefore how much the phone card beside it could keep,
                    see PHONE_CARD_WIDTH/frameScale above) scale with
                    however many screens were in the active flow/set. This
                    row's own overflow-x-auto only stops that width from
                    forcing *this row itself* wider than its container —
                    it doesn't, on its own, stop the width from bubbling up
                    to an ancestor several levels up that still has the
                    default overflow: visible (see the rationale column's
                    own comment further up for that half of the fix); this
                    fixed width is what makes the row's *content* itself
                    count-independent in the first place, which the
                    ancestor fix depends on.
                    -m-1.5 p-1.5: setting overflow-x here also computes
                    overflow-y to auto (a scroll container can only leave
                    one axis visible if the other is already clipped — the
                    UA can't clip x while leaving y genuinely unclipped), so
                    this became a real clipping box the moment it went from
                    overflow-visible (desktop's old shrink-to-fit version)
                    to overflow-x-auto everywhere. The active thumbnail's
                    outline-offset-2 (see screen-thumb below) — and the
                    focus-visible ring's own offset stacked on top of it —
                    paint outside the thumbnail's own border box, which
                    used to be fine with nothing clipping it but now gets
                    cut off at the scrollport edge: the top and bottom on
                    every thumbnail, and the left/right on whichever one is
                    flush against the track's own edge. Padding pushes the
                    scrollport edge out past that protrusion so it paints
                    fully; the matching negative margin (same trick
                    IterationCarousel's own track uses for its border) cancels
                    the padding back out of this element's contribution to
                    the surrounding layout, so the row's actual footprint —
                    and the width math the phone card's shrink split above
                    depends on — is unchanged.
                    scroll-p-1.5 matches that same padding: without it, snap
                    treats the padding as slack to eliminate rather than
                    space to preserve, so it settles at rest with scrollLeft
                    already 6px in — clipping the first thumbnail's own
                    outline against the scrollport edge exactly like an
                    unpadded track would, even though the padding is
                    present in the DOM the whole time. Declaring it as
                    scroll-padding tells snap that inset is intentional, so
                    it snaps the first thumbnail to the *padded* start
                    (scrollLeft: 0) instead of flush against the raw edge. */}
                <div
                  ref={thumbTrackRef}
                  className="no-scrollbar -m-1.5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto p-1.5 scroll-p-1.5"
                >
                  {activeSet.screens.map((s, i) => {
                    const active = i === activeIdx
                    return (
                      <button
                        key={s.src}
                        ref={(el) => {
                          thumbButtonRefs.current[i] = el
                        }}
                        type="button"
                        onClick={() => setIdx(i)}
                        aria-label={s.alt}
                        aria-current={active}
                        // aspect-[52/112] — the same 52:112 ratio the old
                        // fixed w-[52px] h-28 pair encoded — resolves off
                        // the fixed 52px width above at every breakpoint,
                        // there's no shrink left anywhere to distort it.
                        className="relative aspect-[52/112] w-[52px] shrink-0 snap-start"
                      >
                        <Image
                          src={s.src}
                          alt=""
                          fill
                          draggable={false}
                          sizes="52px"
                          className={`screen-thumb select-none rounded-[9px] object-cover object-top outline transition-opacity duration-200 ease-out focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                            active
                              ? "opacity-100 outline-[1.5px] outline-[var(--cs-accent)] outline-offset-2"
                              : "opacity-40 outline-1 outline-neutral-100 hover:opacity-70"
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>

                {/* Right-edge fade — outside the scrolling track, not a
                    child of it (a positioned descendant of an overflow-x
                    element still scrolls along with it — see
                    IterationCarousel's own version of this same note), and
                    reactive to actual scroll position (thumbAtEnd) rather
                    than always on: unlike IterationCarousel's track, this
                    one doesn't always have another item permanently
                    peeking past the edge, so a fade with nothing left to
                    hint at would just look like a stuck smudge over the
                    last thumbnail once you've scrolled all the way. No
                    longer hidden from `lg` up — the row scrolls at
                    every breakpoint now, see the track's own comment
                    above.
                    -right-1.5/-inset-y-1.5 (not right-0/inset-y-0): the
                    track's own -m-1.5/p-1.5 (see above) pushes its real,
                    clipped edge 6px past this wrapper's box on every side,
                    so a fade flush with the wrapper instead of the track
                    left that last 6px of thumbnail showing fully unfaded
                    past the gradient's white end — a hard seam right where
                    the fade should have finished dissolving into it. */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -inset-y-1.5 -right-1.5 w-10 transition-opacity duration-200 ease-out ${
                    thumbAtEnd ? "opacity-0" : "opacity-100"
                  }`}
                  style={{ background: "linear-gradient(to right, transparent, #FFFFFF)" }}
                />
              </div>

              <div className="flex items-center gap-[7px] shrink-0 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => prevPosition && goTo(prevPosition)}
                  disabled={!prevPosition}
                  aria-label="Previous screen"
                  className="relative flex cursor-pointer items-center justify-center text-neutral-400 transition-colors duration-150 before:absolute before:inset-[-11px] before:content-[''] hover:text-neutral-800 disabled:cursor-default disabled:pointer-events-none disabled:text-neutral-200"
                >
                  <span
                    aria-hidden="true"
                    className="block bg-current"
                    style={{
                      width: 16,
                      height: 16,
                      WebkitMaskImage: "url(/icons/arrow-left-s-line.svg)",
                      maskImage: "url(/icons/arrow-left-s-line.svg)",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                    }}
                  />
                </button>
                <span className="font-mono text-[11px] text-neutral-400">
                  {activeIdx + 1}/{activeSet.screens.length}
                </span>
                <button
                  type="button"
                  onClick={() => nextPosition && goTo(nextPosition)}
                  disabled={!nextPosition}
                  aria-label="Next screen"
                  className="relative flex cursor-pointer items-center justify-center text-neutral-400 transition-colors duration-150 before:absolute before:inset-[-11px] before:content-[''] hover:text-neutral-800 disabled:cursor-default disabled:pointer-events-none disabled:text-neutral-200"
                >
                  <span
                    aria-hidden="true"
                    className="block bg-current"
                    style={{
                      width: 16,
                      height: 16,
                      WebkitMaskImage: "url(/icons/arrow-right-s-line.svg)",
                      maskImage: "url(/icons/arrow-right-s-line.svg)",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                    }}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
