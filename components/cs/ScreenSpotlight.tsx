"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { Variants } from "framer-motion"
import { IPhoneFrame, IPHONE_SCREEN_WIDTH, IPHONE_SCREEN_HEIGHT, IPHONE_FRAME_HEIGHT } from "./IPhoneFrame"

type Screen = {
  src: string
  // Real per-crop pixel dimensions — not every crop shares one aspect ratio,
  // so next/image needs the true value per screen. Only used as its
  // intrinsic-size hint; render size is pinned by the fixed height below.
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

// The phone screen's fixed window, constant across every crop regardless of
// its own aspect ratio. Reuses IPhoneFrame's own screen-cutout size so the
// two can't drift apart.
const PHONE_WIDTH = IPHONE_SCREEN_WIDTH
const PHONE_HEIGHT = IPHONE_SCREEN_HEIGHT

// The card wrapping IPhoneFrame — frame height plus this card's own vertical
// padding (py-[34px] below, mirrored here as a constant). Everything inside
// is laid out in real px against this fixed 316-wide design, so shrinking
// the card's CSS width alone would just clip it; frameScale below instead
// measures how much narrower the card renders than this native size and
// scales the whole card via `transform` by that same factor.
const PHONE_CARD_WIDTH = 316
const PHONE_CARD_VERTICAL_PADDING = 34
const PHONE_CARD_HEIGHT = IPHONE_FRAME_HEIGHT + PHONE_CARD_VERTICAL_PADDING * 2

function clampIndex(i: number, length: number) {
  if (length <= 0) return 0
  return Math.max(0, Math.min(length - 1, i))
}

type ScreenPosition = { flow: number; set: number; idx: number }

// Prev/next walk across sets, then flows, skipping empty placeholder sets
// (not directly reachable via their own thumbnail row either).
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

// Screen + rationale copy cross-fade with the same blur AboutContent's hover
// panel uses — blur(2px)<->blur(0px), 100ms, easeOut — for every trigger
// (tab, chip, thumbnail, prev/next). Rationale copy skips this when
// consecutive screens share the same body text (see rationaleKey below).
const screenTransitionVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(2px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.1, ease: "easeOut" } },
  exit: { opacity: 0, filter: "blur(2px)", transition: { duration: 0.1, ease: "easeOut" } },
}

// Shared by the chip row's mount/unmount and the layout shift it causes
// below — same easing as the tab indicator's slide, so a flow switch moves
// at the same pace as the underline tracking it.
const LAYOUT_TRANSITION = { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }

// The chip row's own fade, separate from the height/margin slide above it —
// tying one opacity keyframe to the same progress as the height grow would
// read as the box growing, not fading. Finishes before the slide does, so
// the rest of the slide reads as its own, separate motion.
const CHIP_FADE_TRANSITION = { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }

// A flow-tabbed screen spotlight for a case study's final-product section:
// pick a flow, optionally narrow to a set within it, and step through that
// set's screens with a phone-frame mockup + rationale copy. State is three
// raw indices (flow/set/idx) rather than resolved objects. A tab/chip click
// (goToFlow/goToSet) resets idx (and, for a flow switch, set) back to 0 —
// each flow/set lands on its own start, the same way switching a browser or
// docs-site tab always shows that tab's own top. Direct stepping (goTo,
// prev/next) is unaffected — it keeps landing on whatever screen the walk reaches.
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

  // The rationale panel swaps on its own key: scoped to flow+set but keyed
  // on the body text itself rather than the index. Consecutive screens that
  // share one description resolve to the same key, so that motion.div stays
  // mounted across the step instead of exiting and re-entering — the copy
  // sits still while the phone crop still cross-fades via contentKey. Falls
  // back to contentKey when there's no screen.
  const rationaleKey = activeScreen ? `${flow}-${activeSetIdx}-${activeScreen.body}` : contentKey

  // Resolved off the active (clamped) position so prev/next walk from
  // what's actually on screen; null means nothing further that way, which disables the button.
  const activeFlowIdx = clampIndex(flow, flows.length)
  const activePosition: ScreenPosition = { flow: activeFlowIdx, set: activeSetIdx, idx: activeIdx }
  const nextPosition = nextScreenPosition(flows, activePosition)
  const prevPosition = prevScreenPosition(flows, activePosition)

  function goTo(position: ScreenPosition) {
    setFlow(position.flow)
    setSet(position.set)
    setIdx(position.idx)
  }

  // Unlike goTo above, tab/chip clicks don't carry the current idx (or, for
  // a flow switch, set) over — picking a different flow/set is a different
  // story, so it lands on that story's own start.
  function goToFlow(i: number) {
    setFlow(i)
    setSet(0)
    setIdx(0)
  }

  function goToSet(i: number) {
    setSet(i)
    setIdx(0)
  }

  // The device frame (bezel, status bar, Dynamic Island) never re-renders or
  // animates between screens — only screenContent, its child, swaps and
  // gets the cross-fade.
  const screenContent = activeScreen ? (
    // IPhoneFrame's screen window is a fixed 219×474 area; taller crops
    // (e.g. Home's) render at the same fixed width and the window scrolls to
    // reveal the rest, rather than shrinking to fit and rendering smaller
    // text than every other screen.
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
    // TEMPORARY — comes out once every screen has a real exported crop (Songs/Audio bytes are still placeholders).
    <div
      className="flex h-full items-center justify-center text-center font-mono text-[10px] uppercase text-neutral-500"
      style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT }}
    >
      Crop not exported yet
    </div>
  )

  // max-w caps only apply from `lg` up, where this text shares a row with
  // the phone card and the cap is a real reading measure. Below `lg` it's
  // in its own full-width row under the phone, so max-w-full applies instead.
  const rationaleContent = activeScreen ? (
    <>
      <p
        className="max-w-full text-base leading-normal text-neutral-600 lg:max-w-[370px]"
        style={{ textWrap: "pretty" }}
      >
        {activeScreen.body}
      </p>
      {activeScreen.note && (
        <p className="mt-[18px] max-w-full text-[13px] italic leading-[1.5] text-neutral-400 lg:max-w-[340px]">
          {activeScreen.note}
        </p>
      )}
    </>
  ) : null

  // Reused identically by the reduced-motion and animated chip-row branches below.
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

  // A single shared underline that slides/resizes between tabs, measured off
  // the actual button DOM since tab widths vary with label length.
  // useLayoutEffect (not useEffect) so the first position commits before
  // paint, avoiding a visible slide-in from 0 on mount.
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

  // Fluid-scale for the phone card (see PHONE_CARD_WIDTH above). Below `lg`
  // it's w-full (capped at 316px); from `lg` it's flex-basis-driven,
  // shrinking only once the rationale column beside it has given up all it
  // can. A ResizeObserver (not a window-resize listener) since this card's
  // rendered width also changes when the rationale column reflows — a
  // longer caption, the chip row appearing — without the window resizing.
  const phoneCardRef = useRef<HTMLDivElement>(null)
  const [frameScale, setFrameScale] = useState(1)

  useLayoutEffect(() => {
    const el = phoneCardRef.current
    if (!el) return
    function measure() {
      if (!el) return
      // No upper clamp — below `md` the card scales up on a wide phone too, not just down on a narrow one.
      setFrameScale(el.getBoundingClientRect().width / PHONE_CARD_WIDTH)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Screen-index thumbnail row: fixed at its 52px design width always,
  // scrolling horizontally instead of shrinking — unlike the flow tabs
  // (a small finite set that wraps instead), this is a sequential filmstrip
  // already paired with prev/next + a counter, the same shape
  // IterationCarousel's track treats as scroll-native. Keeping the row
  // fixed-width (paired with an explicit min-width on the rationale column,
  // see further down) means the phone card's size depends only on the
  // row's own available width, never on how many screens are in the active
  // flow/set.
  const thumbTrackRef = useRef<HTMLDivElement>(null)
  const thumbButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [thumbAtEnd, setThumbAtEnd] = useState(false)

  // Tracks scroll position so the right-edge fade (below) can hide once
  // there's nothing left to scroll to.
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

  // Keeps the active thumbnail in view when activeIdx changes via
  // prev/next/chip/tab, scrolling just enough to bring it back on-screen
  // rather than to the row's start.
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
      {/* Tab row, `lg`+ only — below that, labels and the thumbnail row
          below don't have enough room (see the wrapping pill row below,
          which replaces this). The gray divider and purple indicator are
          separate absolute layers, not per-tab borders, so the indicator
          can slide between tabs rather than just fade in/out; both share
          the row's own `bottom: 0` via the buttons' stretched height. */}
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
          scrolling, same fix as the chip row's set-level nav. Matches
          screen-tab's type scale so it reads as one nav level. Solid accent
          fill (not the chip row's lighter tint) keeps it visually distinct
          from the chips on flows where both rows show at once. */}
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
          chip stays a filled pill (not just active) so it reads as its own
          nav level, distinct from the borderless tab row above. */}
      {reduce ? (
        activeFlow.sets.length > 1 && (
          <div className="mt-[22px] flex flex-wrap gap-2">{chipButtons}</div>
        )
      ) : (
        // AnimatePresence stays mounted; only its child is conditional, so
        // it can still play the exit animation. `layout`, paired with the
        // main row below, lets both FLIP to their new position together.
        // opacity gets its own faster transition rather than a nested
        // AnimatePresence — once this element's removal is captured for
        // exit, framer-motion freezes the JSX it captured, so a nested
        // conditional inside would never get to re-evaluate.
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

      {/* Main row — phone frame, then rationale/footnote/controls, with
          controls pinned to the frame's bottom via mt-auto, meaningful only
          from `lg` up where the column stretches to the phone card's
          height. Below `lg`, mt-8 gives an explicit gap since mt-auto has
          no free space to resolve into there. `layout` (off under reduced
          motion) smooths the chip row above appearing/disappearing, and
          ordinary height differences between one screen's rationale and the next's. */}
      <motion.div
        layout={!reduce}
        transition={LAYOUT_TRANSITION}
        className="mt-[26px] flex flex-col items-stretch gap-10 lg:flex-row"
      >
        {/* Outer box — reserves the scaled card's footprint via aspect-ratio
            (locked to the true 316:PHONE_CARD_HEIGHT design ratio), flush
            left at every breakpoint (no auto margins). Below `lg` it's
            w-full (capped at 316px); from `lg` it's flex-basis-[316px] with
            shrink enabled but not grow, so it gives up width only once the
            rationale column beside it has given up all it can — and only in
            proportion to the row's own available width, never to how many
            screens are in the active flow/set. That's also why the
            thumbnail row further down is a fixed-width scroller rather than
            shrinking with a per-item floor, and why the rationale column
            carries its own explicit min-width (see that column's own
            comment) instead of the flex default, which would otherwise
            inherit a different, count-dependent floor from the thumbnail
            row on every flow/set.
            lg:min-w-[150px] floors this card's own shrink, since nothing
            inside it — an absolutely-positioned, transform-scaled
            IPhoneFrame — naturally establishes a sensible flex minimum the
            way the rationale column's text does.
            overflow-hidden clips the phantom reserved space transform
            leaves behind on the inner card below (transform changes paint,
            not layout size, so without this the box's own aspect-ratio
            height would get pulled back up to the card's full unscaled size).
            bg-neutral-75 matches the inner card's own background so a
            same-width mismatch — this box resolves its height synchronously
            in CSS, frameScale only updates once the ResizeObserver fires —
            reads as more of the same card for a frame or two, not a visible
            seam.
            `layout` (off under reduced motion) counters a distortion from
            the main row's own layout animation below: rationale copy length
            varies screen to screen, so that row's height genuinely changes,
            and framer-motion smooths it by scaling the row element itself —
            which would otherwise squish/stretch this card's plain
            descendants along with it. Giving this card `layout` too makes
            it a projection node that gets the matching counter-scale. */}
        <motion.div
          layout={!reduce}
          ref={phoneCardRef}
          className="w-full max-w-[316px] shrink-0 overflow-hidden rounded-[8px] bg-neutral-75 lg:w-auto lg:min-w-[150px] lg:shrink lg:grow-0 lg:basis-[316px]"
          style={{ aspectRatio: `${PHONE_CARD_WIDTH} / ${PHONE_CARD_HEIGHT}` }}
        >
          {/* Inner card — laid out at its true 316×PHONE_CARD_HEIGHT design
              size so IPhoneFrame's real-px children position correctly,
              then visually scaled via `transform`. transform-origin: top
              left matches the outer box's own top-left-anchored sizing, so
              the scaled edges land exactly on the reserved box's edges. */}
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

        {/* min-w-0 plus an explicit lg:min-w-[180px] floor, rather than the
            flex default. The "overflow:auto reports a zero min-content
            size" rule only applies to that element itself as a flex item —
            it doesn't zero out its min-content contribution to an ancestor
            several levels up that's still overflow:visible, so this
            column's automatic min-width kept bubbling up from the thumbnail
            track's real content width (52px × screen count) — the same
            count-dependent floor this whole fix is meant to remove. min-w-0
            bypasses that; the explicit min-width replaces it with a fixed
            floor, so the split with the phone card beside it depends only
            on the row's own available width. */}
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
                {/* w-[52px] shrink-0 fixes every thumbnail at its design
                    size; overflow-x-auto scrolls instead of shrinking, with
                    snap-x/snap-start landing a drag on a thumbnail rather
                    than between two. Keeping this fixed-width is what makes
                    the row's content count-independent, which the rationale
                    column's min-width fix (above) depends on.
                    -m-1.5 p-1.5: overflow-x-auto also computes overflow-y to
                    auto, clipping the active thumbnail's outline-offset-2
                    (which paints outside its border box) at the scrollport
                    edge — padding pushes that edge out past the protrusion,
                    and the matching negative margin cancels the padding back
                    out of the surrounding layout. scroll-p-1.5 matches it so
                    snap doesn't treat the padding as slack to eliminate,
                    which would otherwise clip the first thumbnail the same way. */}
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
                        // aspect-[52/112] resolves off the fixed 52px width above — no shrink left anywhere to distort it.
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

                {/* Right-edge fade, outside the scrolling track (a
                    positioned descendant of overflow-x still scrolls with
                    it) and reactive to thumbAtEnd — unlike IterationCarousel's
                    track, this one can run out of content to hint at, so an
                    always-on fade would look like a stuck smudge once fully
                    scrolled. Offset by -1.5, not flush, to match the
                    track's own -m-1.5/p-1.5 — otherwise the fade would leave
                    the last 6px of thumbnail unfaded past its white end. */}
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
