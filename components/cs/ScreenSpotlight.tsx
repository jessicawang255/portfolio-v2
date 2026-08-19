"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"

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
const PHONE_WIDTH = 219
const PHONE_HEIGHT = 474

function clampIndex(i: number, length: number) {
  if (length <= 0) return 0
  return Math.max(0, Math.min(length - 1, i))
}

// ScreenSpotlight: a flow-tabbed screen spotlight for a case study's final-product section:
// pick a flow, optionally narrow to a set within it, and step through that
// set's screens one at a time with a phone-frame mockup + rationale copy.
// State is three raw indices (flow/set/idx) rather than resolved objects —
// switching flows or sets doesn't reset the others, so e.g. stepping to
// screen 3 of one flow and then tabbing to a shorter flow lands on whatever
// screen 3 clamps to there, rather than always snapping back to the start.
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

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      {/* Tab row — one tab per flow. Horizontally scrollable + no-scrollbar
          below `sm`, same as the rest of the case study handles overflow.
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
      <div className="relative flex gap-[26px] overflow-x-auto no-scrollbar">
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
              onClick={() => setFlow(i)}
              aria-current={active}
              className={`screen-tab shrink-0 whitespace-nowrap px-0.5 pb-3 text-sm leading-[1.5] transition-colors duration-fast ease-out ${
                active ? "font-medium text-primary" : "text-neutral-400 hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Chip row — only when the active flow has more than one set. */}
      {activeFlow.sets.length > 1 && (
        <div className="mt-[22px] flex flex-wrap gap-2">
          {activeFlow.sets.map((s, i) => {
            const active = i === activeSetIdx
            return (
              <button
                key={s.label}
                type="button"
                onClick={() => setSet(i)}
                aria-current={active}
                className={`screen-chip rounded-full border px-3.5 py-[7px] font-mono text-[12px] uppercase transition-colors duration-fast ease-out ${
                  active
                    ? "border-[var(--cs-accent)]/35 bg-[var(--cs-accent)]/8 text-[var(--cs-accent)]"
                    : "border-neutral-100 text-neutral-600 hover:text-primary"
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Main row — phone frame, then rationale/footnote/controls, the
          controls pinned to the frame's bottom edge via mt-auto so they
          hold still regardless of how long the rationale copy runs. */}
      <div className="mt-[26px] flex flex-col items-stretch gap-10 sm:flex-row">
        <div className="mx-auto w-[316px] shrink-0 rounded-[8px] border border-neutral-100 bg-neutral-75 py-[34px] sm:mx-0">
          <div className="flex h-full items-center justify-center">
            {activeScreen ? (
              // A fixed 219×474 window regardless of the crop's own aspect
              // ratio — most crops fill it exactly, but a few (Home's, for
              // one) are taller than a single phone screen. Rather than
              // shrinking those down to fit (which would render their text
              // noticeably smaller than every other screen), the image
              // renders at the same fixed width as the rest and this window
              // scrolls to reveal the remainder, so the phone frame itself
              // never changes size between screens.
              <div
                className="no-scrollbar overflow-y-auto"
                style={{
                  width: PHONE_WIDTH,
                  height: PHONE_HEIGHT,
                  borderRadius: 17,
                  boxShadow: "0 16px 44px -14px rgba(22,25,29,.32)",
                }}
              >
                <Image
                  src={activeScreen.src}
                  alt={activeScreen.alt}
                  width={activeScreen.width}
                  height={activeScreen.height}
                  style={{ width: PHONE_WIDTH, height: "auto", display: "block" }}
                />
              </div>
            ) : (
              // TEMPORARY: comes out once every screen in `flows` below has
              // a real exported crop — this branch only exists because
              // Songs/Audio bytes are placeholders for now.
              <div
                className="flex items-center justify-center rounded-[17px] border border-dashed border-neutral-200 bg-white text-center font-mono text-[10px] uppercase text-neutral-300"
                style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT }}
              >
                Crop not exported yet
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col pt-1.5">
          {activeScreen && (
            <p
              className="max-w-[370px] text-base leading-normal text-neutral-600"
              style={{ textWrap: "pretty" }}
            >
              {activeScreen.body}
            </p>
          )}

          {activeScreen?.note && (
            <p className="mt-[18px] max-w-[340px] text-xs italic text-neutral-300">{activeScreen.note}</p>
          )}

          {hasScreens && (
            <div className="mt-auto flex flex-col gap-[18px]">
              <div className="flex gap-2.5">
                {activeSet.screens.map((s, i) => {
                  const active = i === activeIdx
                  return (
                    <button key={s.src} type="button" onClick={() => setIdx(i)} aria-label={s.alt} aria-current={active}>
                      {/* Fixed w-[52px] h-28 (the standard crop's own aspect
                          at that height) + object-cover/object-top, not
                          w-auto — every thumbnail stays the same footprint
                          regardless of the crop's real aspect. A taller
                          crop (Home's) gets cropped from the bottom instead
                          of shrinking to fit, which would otherwise render
                          it as a much narrower sliver than the rest of the
                          row. Unlike the main frame above, this preview
                          never scrolls — it's just a fixed-size thumbnail. */}
                      <img
                        src={s.src}
                        alt=""
                        className={`screen-thumb h-28 w-[52px] rounded-[9px] object-cover object-top outline transition-opacity duration-200 ease-out focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                          active
                            ? "opacity-100 outline-[1.5px] outline-[var(--cs-accent)] outline-offset-2"
                            : "opacity-40 outline-1 outline-neutral-100 hover:opacity-70"
                        }`}
                      />
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-[7px] shrink-0 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => setIdx(activeIdx - 1)}
                  disabled={activeIdx === 0}
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
                  onClick={() => setIdx(activeIdx + 1)}
                  disabled={activeIdx === activeSet.screens.length - 1}
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
      </div>
    </div>
  )
}
