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

// The card wrapping IPhoneFrame is laid out in real px against this fixed
// 316-wide design, so shrinking its CSS width alone would just clip it —
// frameScale below instead measures how much narrower it renders and scales
// the whole card via `transform` by that factor.
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

// Same blur cross-fade as AboutContent's hover panel, for every trigger
// (tab, chip, thumbnail, prev/next).
const screenTransitionVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(2px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.1, ease: "easeOut" } },
  exit: { opacity: 0, filter: "blur(2px)", transition: { duration: 0.1, ease: "easeOut" } },
}

// Same easing as the tab indicator's slide, so a flow switch moves at the
// same pace as the underline tracking it.
const LAYOUT_TRANSITION = { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }

// Finishes before the height slide does, so the fade reads as its own motion
// rather than the box growing.
const CHIP_FADE_TRANSITION = { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }

// A flow-tabbed screen spotlight: pick a flow, optionally narrow to a set,
// step through that set's screens with a phone mockup + rationale copy. A
// tab/chip click resets idx (and, for a flow switch, set) to 0, so each
// flow/set lands on its own start; direct stepping (prev/next) doesn't.
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

  // Keyed on body text, not index — consecutive screens sharing one
  // description keep this motion.div mounted (copy stays still) while the
  // phone crop still cross-fades via contentKey.
  const rationaleKey = activeScreen ? `${flow}-${activeSetIdx}-${activeScreen.body}` : contentKey

  // Resolved off the clamped position; null disables the prev/next button.
  const activeFlowIdx = clampIndex(flow, flows.length)
  const activePosition: ScreenPosition = { flow: activeFlowIdx, set: activeSetIdx, idx: activeIdx }
  const nextPosition = nextScreenPosition(flows, activePosition)
  const prevPosition = prevScreenPosition(flows, activePosition)

  function goTo(position: ScreenPosition) {
    setFlow(position.flow)
    setSet(position.set)
    setIdx(position.idx)
  }

  // Unlike goTo, tab/chip clicks don't carry the current idx/set over —
  // picking a different flow/set lands on that story's own start.
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
    // IPhoneFrame's screen window is a fixed area; taller crops render at
    // the same fixed width and the window scrolls to reveal the rest,
    // rather than shrinking to fit and rendering smaller text.
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
    // TEMPORARY — remove once every screen has a real exported crop.
    <div
      className="flex h-full items-center justify-center text-center font-mono text-[10px] uppercase text-neutral-500"
      style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT }}
    >
      Crop not exported yet
    </div>
  )

  // max-w only applies from `lg` up, where this text shares a row with the
  // phone card; below that it's full-width under the phone.
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

  // Reused by both the reduced-motion and animated chip-row branches below.
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

  // Shared underline, measured off the actual button DOM since tab widths
  // vary with label length. useLayoutEffect so the first position commits
  // before paint, avoiding a visible slide-in from 0 on mount.
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

  // Fluid-scale for the phone card (see PHONE_CARD_WIDTH). ResizeObserver,
  // not a window-resize listener, since this card's width also changes when
  // the rationale column reflows (longer caption, chip row appearing) without
  // the window resizing.
  const phoneCardRef = useRef<HTMLDivElement>(null)
  const [frameScale, setFrameScale] = useState(1)

  useLayoutEffect(() => {
    const el = phoneCardRef.current
    if (!el) return
    function measure() {
      if (!el) return
      // No upper clamp — the card can scale up on a wide phone, not just down.
      setFrameScale(el.getBoundingClientRect().width / PHONE_CARD_WIDTH)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Thumbnail row is fixed at its 52px design width, scrolling horizontally
  // instead of shrinking — paired with an explicit min-width on the
  // rationale column (below) so the phone card's size never depends on how
  // many screens are in the active flow/set.
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
      {/* Tab row, `lg`+ only — below that there isn't room (see the wrapping
          pill row below, which replaces this). Divider and indicator are
          separate absolute layers, not per-tab borders, so the indicator can
          slide between tabs instead of just fading. */}
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
          scrolling. Solid accent fill keeps it visually distinct from the
          chip row's lighter tint when both show at once. */}
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

      {/* Chip row — only when the active flow has more than one set. */}
      {reduce ? (
        activeFlow.sets.length > 1 && (
          <div className="mt-[22px] flex flex-wrap gap-2">{chipButtons}</div>
        )
      ) : (
        // AnimatePresence stays mounted so its child can still play the exit
        // animation. `layout`, paired with the main row below, lets both
        // FLIP to their new position together.
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
          controls pinned to the frame's bottom via mt-auto (meaningful only
          from `lg` up, where the column stretches to the phone card's
          height). `layout` smooths the chip row above appearing/disappearing
          and rationale height differences between screens. */}
      <motion.div
        layout={!reduce}
        transition={LAYOUT_TRANSITION}
        className="mt-[26px] flex flex-col items-stretch gap-10 lg:flex-row"
      >
        {/* Outer box reserves the scaled card's footprint via aspect-ratio.
            From `lg` it shrinks (not grows) so it only gives up width once
            the rationale column beside it has given up all it can, in
            proportion to the row's available width — never to screen count
            (hence the thumbnail row and rationale column below both use a
            fixed width/min-width instead of the flex default).
            overflow-hidden clips the phantom space `transform` leaves behind
            on the inner card (transform doesn't affect layout size, so
            without this the aspect-ratio height would snap back to the
            card's unscaled size). bg-neutral-75 matches the inner card so a
            frame of width mismatch (frameScale updates async, via
            ResizeObserver) reads as more of the same card, not a seam.
            `layout` counters the main row's own layout animation, which
            would otherwise squish/stretch this card's plain descendants
            when rationale copy length changes the row's height. */}
        <motion.div
          layout={!reduce}
          ref={phoneCardRef}
          className="w-full max-w-[316px] shrink-0 overflow-hidden rounded-[8px] bg-neutral-75 lg:w-auto lg:min-w-[150px] lg:shrink lg:grow-0 lg:basis-[316px]"
          style={{ aspectRatio: `${PHONE_CARD_WIDTH} / ${PHONE_CARD_HEIGHT}` }}
        >
          {/* Inner card is laid out at its true design size so IPhoneFrame's
              real-px children position correctly, then visually scaled via
              `transform`. transform-origin: top left matches the outer box's
              top-left-anchored sizing, so the scaled edges land exactly on
              the reserved box's edges. */}
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
              {/* IPhoneFrame itself is outside the AnimatePresence and never
                  keyed on contentKey, so it never unmounts between screens —
                  only its children (the crop) swap. */}
              <IPhoneFrame>
                {reduce ? (
                  screenContent
                ) : (
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
            flex default — without it, this column's automatic min-width
            bubbles up from the thumbnail track's real content width (52px ×
            screen count), making the split with the phone card depend on
            how many screens are in the active flow/set. */}
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
                {/* w-[52px] shrink-0 fixes every thumbnail's size; scrolls
                    instead of shrinking, snap-start landing a drag on a
                    thumbnail rather than between two.
                    -m-1.5 p-1.5: overflow-x-auto also computes overflow-y as
                    auto, clipping the active thumbnail's outline-offset-2 at
                    the scrollport edge — padding pushes the edge out past it,
                    the matching negative margin cancels the padding back out
                    of the surrounding layout. scroll-p-1.5 keeps snap from
                    treating that padding as slack, which would clip the
                    first thumbnail the same way. */}
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

                {/* Right-edge fade, outside the scrolling track, hidden once
                    thumbAtEnd since this row (unlike IterationCarousel's) can
                    run out of content to hint at. Offset -1.5 to match the
                    track's own -m-1.5/p-1.5. */}
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
