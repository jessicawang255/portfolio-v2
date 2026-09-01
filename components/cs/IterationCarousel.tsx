"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type Iteration = {
  src: string
  alt: string
  width: number
  height: number
  caption: string
}

type IterationCarouselProps = {
  items: Iteration[]
  className?: string
}

// How much earlier (in px) the sticky caption releases, versus riding all
// the way down to the image's true bottom edge — see the release-boundary
// wrapper below.
const STICKY_RELEASE_BUFFER = 120

// A horizontally-scrolling carousel for comparing design iterations — same
// caption treatment as ImageBlock, with prev/next + count folded onto that
// line. Images scroll as a real track (drag or arrows) rather than swapping
// like a tab panel.
//
// The track bleeds past the content column to the true right edge of the
// viewport so the next slide peeks in, computed at runtime via
// getBoundingClientRect since the column's left offset shifts with the
// TOC's reserved margin across breakpoints (see CaseStudyLayout).
export function IterationCarousel({ items, className }: IterationCarouselProps) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  // Measured from the root, not the caption row — the caption row is wrapped
  // in its own bled-width sticky backdrop, so its rendered width can't be
  // trusted as the slide width. The root is never bled, so it's stable.
  const rootRef = useRef<HTMLDivElement>(null)
  const captionRowRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [slideWidth, setSlideWidth] = useState<number | null>(null)
  const [trackWidth, setTrackWidth] = useState<number | null>(null)

  useEffect(() => {
    function measure() {
      const root = rootRef.current
      const track = trackRef.current
      if (!root || !track) return
      setSlideWidth(root.getBoundingClientRect().width)
      // Below `md` there's no TOC-reserved margin to bleed into and no room
      // for a peeking next slide — bleeding the track there would push the
      // active slide's right edge under the fade gradient. So on mobile the
      // track stays unbled and the active image fills the column.
      if (document.documentElement.clientWidth < 640) {
        setTrackWidth(null)
        return
      }
      const trackLeft = track.getBoundingClientRect().left
      // clientWidth (not window.innerWidth) excludes the scrollbar, so the
      // track's right edge lands flush with the actual content area.
      setTrackWidth(Math.max(0, document.documentElement.clientWidth - trackLeft))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [items.length])

  // Keeps the caption/count in sync with whatever's centered in the track,
  // not just button clicks — dragging the strip updates them too.
  useEffect(() => {
    const track = trackRef.current
    if (!track || items.length < 2) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const index = slideRefs.current.findIndex((el) => el === entry.target)
            if (index !== -1) setActive(index)
          }
        }
      },
      { root: track, threshold: [0.6] }
    )

    slideRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [items.length])

  // Scrolls the track's own scrollLeft directly rather than scrollIntoView —
  // these slides are taller than the viewport, and scrollIntoView's `block`
  // alignment would scroll the page vertically. Moving scrollLeft by hand
  // touches only the track's horizontal position.
  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(items.length - 1, index))
    const track = trackRef.current
    const slide = slideRefs.current[clamped]
    if (!track || !slide) return
    const delta = slide.getBoundingClientRect().left - track.getBoundingClientRect().left
    track.scrollTo({ left: track.scrollLeft + delta, behavior: "smooth" })
  }

  const current = items[active]

  return (
    <div ref={rootRef} className={`flex flex-col ${className ?? ""}`} role="group" aria-label="Design iterations">
      {/* Sticky release boundary — a negative margin-bottom on the track
          wrapper below pulls this div's own auto-height up by
          STICKY_RELEASE_BUFFER px, so the caption (bounded by this div, not
          the root) releases that much before the image's true bottom edge.
          The spacer after this div gives back the same amount, so the
          root's total height is unaffected — only the release point moved. */}
      <div>
      {/* Sticky bounded by the release-boundary div above, so it releases
          STICKY_RELEASE_BUFFER px before the track's bottom edge scrolls
          past. top-0 (not an offset) so the white backdrop below (inset-0
          on this div) covers exactly this div's box, with nothing left for
          the scrolling track to show through.
          Bled to the same trackWidth as the track/fade below so the
          gradient backdrop covers the peeking slide too — same
          -mx-[1px]/px-[1px] as the track, to avoid a 1px sliver of border
          showing through sub-pixel rounding drift. The gradient is a
          separate absolutely-positioned layer, not a background on the
          caption row itself, so the row's own width stays the natural
          column width and the nav controls don't drift with the bled backdrop. */}
      <div
        className="sticky top-0 z-10 -mx-[1px] w-full px-[1px]"
        style={trackWidth != null ? { width: trackWidth } : undefined}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            // A fixed 8px (matching pb-2) keeps the fade confined to the gap
            // below the caption text regardless of whether it wraps to one
            // or two lines — solid white behind the text always, fading
            // only in the space that's already empty below it.
            background: "linear-gradient(to bottom, #FFFFFF calc(100% - 8px), transparent)",
          }}
        />
        {/* pt-9 matches the TOC's own sticky "Back" link (36px top offset),
            so this row's baseline lines up with the TOC's when both are
            pinned. Also load-bearing for the backdrop above — it's what
            makes that box tall enough to blank out the scrolling track up
            to the viewport edge once stuck. pb-2 keeps the gap to the image
            the same 8px as ImageBlock's own caption. */}
        <div
          ref={captionRowRef}
          className="relative flex w-full items-start justify-between gap-5 pt-9 pb-2"
          style={slideWidth != null ? { width: slideWidth } : undefined}
        >
          {/* Same blur cross-fade as ScreenSpotlight's screen/rationale swap
              and AboutContent's hover panel — blur(2px)<->blur(0px), 100ms,
              easeOut. popLayout so the exiting caption doesn't shove the
              arrows/count sideways while it fades out. */}
          {reduce ? (
            <p className="text-[13px] italic leading-[1.5] text-neutral-400" aria-live="polite">
              {current.caption}
            </p>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={active}
                className="text-[13px] italic leading-[1.5] text-neutral-400"
                aria-live="polite"
                initial={{ opacity: 0, filter: "blur(2px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(2px)" }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                {current.caption}
              </motion.p>
            </AnimatePresence>
          )}
          {/* items-center keeps the arrows/count aligned with each other; the
              row above is items-start so this group sits flush with the
              caption's top line rather than centering when it wraps to two lines. */}
          <div className="flex items-center gap-[7px] shrink-0 whitespace-nowrap">
            {/* before:inset-[-11px] pads the hit area without growing the
                visible icon, same as IconButton. Mask-image + currentColor
                (not next/image) so the icon inherits hover/disabled color
                transitions, which an externally loaded <img> can't. */}
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous iteration"
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
              {active + 1}/{items.length}
            </span>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === items.length - 1}
              aria-label="Next iteration"
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
      </div>

      {/* -mx-[1px] px-[1px] gives the first/last slide's border somewhere to
          render without getting clipped by the track's own overflow-x.
          Width stays at the CSS default until the JS measurement resolves,
          matching the very first paint anyway. paddingRight reserves extra
          scrollable room past the last slide — without it, the browser's own
          scrollLeft ceiling can fall short of what's needed to bring the
          last slide flush left, since the track bleeds close to the
          viewport edge. */}
      {/* The fade lives outside the scrolling track, not as its child — an
          absolutely-positioned descendant of overflow-x:auto still scrolls
          with the track's content, so nesting it inside made it drift with
          the slides. This wrapper is relative and un-scrolling, with the
          fade as its sibling. It needs the same bled trackWidth so `right: 0`
          lands at the true viewport edge, not the un-bled column edge.
          marginBottom is the sticky-release-early mechanic — it pulls the
          release-boundary div's own height up by STICKY_RELEASE_BUFFER px,
          while the track itself still renders at full size underneath. */}
      <div
        className="relative"
        style={{
          ...(trackWidth != null ? { width: trackWidth } : {}),
          marginBottom: -STICKY_RELEASE_BUFFER,
        }}
      >
        <div
          ref={trackRef}
          className="no-scrollbar -mx-[1px] flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-[1px]"
          style={{
            ...(trackWidth != null ? { width: trackWidth } : {}),
            ...(trackWidth != null && slideWidth != null
              ? { paddingRight: Math.max(0, trackWidth - slideWidth) + 1 }
              : {}),
          }}
        >
          {items.map((item, index) => {
            const isActive = index === active
            return (
              <div
                key={item.src}
                ref={(el) => {
                  slideRefs.current[index] = el
                }}
                className="w-full shrink-0 snap-start"
                style={slideWidth != null ? { width: slideWidth, flexShrink: 0 } : undefined}
              >
                {/* A real <button>, not an onClick on the div above — gets
                    keyboard focus/activation for free, and doesn't fight the
                    div's own job as the snap-align + IntersectionObserver
                    target. Stays clickable and in the tab order even when
                    active (a no-op) so tab order doesn't reshuffle as the
                    active slide changes. Native drag/wheel scrolling on the
                    track is unaffected — browsers only fire `click` on a
                    release with no significant drag in between. */}
                {/* A flat white scrim, not a scale — a partial, clip-and-fade-
                    edged sliver of the image doesn't read well shrinking
                    toward its own center while the fixed viewport clip/fade
                    overlay stays put. .iteration-slide-overlay (globals.css)
                    fades opacity in on hover, gated to pointer-fine devices,
                    skipped for prefers-reduced-motion, scoped to
                    [aria-current="false"]. */}
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show iteration ${index + 1} of ${items.length}`}
                  aria-current={isActive}
                  className={`iteration-slide relative block w-full rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    isActive ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="100vw"
                    className="h-auto w-full rounded-[8px] border border-neutral-100"
                  />
                  <span
                    aria-hidden="true"
                    className="iteration-slide-overlay pointer-events-none absolute inset-0 rounded-[8px] bg-neutral-900 opacity-0"
                  />
                </button>
              </div>
            )
          })}
        </div>

        {/* Fades the clipped edge into the surface color rather than a hard
            cut — matches bg-surface (#FFFFFF) directly rather than
            var(--color-surface), since @theme color vars only reach :root
            when referenced by a Tailwind utility elsewhere (see globals.css).
            pointer-events-none so it doesn't block drag-to-scroll. Hidden
            below `md` since the track isn't bled there — no peeking slide to
            fade into. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-40 md:block"
          style={{ background: "linear-gradient(to right, transparent, #FFFFFF)" }}
        />
      </div>
      </div>
      <div aria-hidden="true" style={{ height: STICKY_RELEASE_BUFFER }} />
    </div>
  )
}
