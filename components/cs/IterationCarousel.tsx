"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

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

// How much earlier (in px) the sticky caption lets go, versus riding all
// the way down to the image's true bottom edge — see the release-boundary
// wrapper below for how this is applied.
const STICKY_RELEASE_BUFFER = 120

// A horizontally-scrolling carousel for comparing several iterations of a
// design — same caption treatment ImageBlock already uses (italic, text-xs,
// neutral-400, sitting above the image), with a prev/next + count folded
// onto that line instead of a separate tab bar. The images themselves scroll
// as a real track (drag it directly, or use the arrows), rather than being
// swapped instantly the way a tab panel would.
//
// The track bleeds past the case study's content column all the way to the
// true right edge of the viewport, so the next slide peeks in for real
// instead of getting clipped at the column's own boundary — same idea as a
// full-bleed hero image, just computed at runtime (via getBoundingClientRect,
// the same technique TableOfContents already uses for its own layout) since
// the column's left offset isn't a fixed value — it shifts with the TOC's
// reserved margin across breakpoints (see CaseStudyLayout).
export function IterationCarousel({ items, className }: IterationCarouselProps) {
  const [active, setActive] = useState(0)
  // Measured from the root, not the caption row — the caption row is about
  // to be wrapped in its own bled-width sticky backdrop (to carry the
  // gradient all the way to the track's own right edge), so its rendered
  // width can no longer be trusted as "how wide is one slide." The root
  // itself is never bled, so it stays a stable reference regardless.
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
      const trackLeft = track.getBoundingClientRect().left
      // documentElement.clientWidth, not window.innerWidth — excludes the
      // scrollbar's own width, so the track's right edge lands flush with
      // the actual content area instead of a few pixels past it.
      setTrackWidth(Math.max(0, document.documentElement.clientWidth - trackLeft))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [items.length])

  // Keeps the caption/count in sync with whatever's actually centered in
  // the track, not just with button clicks — dragging the strip directly
  // updates them too.
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

  // Scrolls the track's own scrollLeft directly rather than calling
  // scrollIntoView — these slides are taller than the viewport, and
  // scrollIntoView's `block` alignment scrolls the *page* vertically
  // whenever it can't fit the whole target on screen, even with
  // block: "nearest". Moving scrollLeft by hand touches only the track's
  // own horizontal scroll position, so clicking prev/next can never move
  // the page.
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
      {/* Sticky release boundary — a negative margin-bottom on the *track*
          wrapper further down (not on this div itself — a margin only
          changes how much space an element takes in its own parent's flow,
          it doesn't shrink the element's own content box, which is what
          actually defines its children's containing block) pulls this div's
          own computed auto-height up by STICKY_RELEASE_BUFFER px, while the
          track underneath still paints at its full height via normal
          overflow. So the caption — bounded by *this* div, not the root —
          runs out of "containing block" and lets go that much before the
          image's true bottom edge, instead of nearly touching it.
          The spacer right after this div (below, still inside the root)
          gives back the same amount, so the root's own total height — and
          everything positioned after this component on the page — is
          unaffected; only the sticky release point moved, not the layout. */}
      <div>
      {/* Sticky bounded by the release-boundary div above, not directly by
          the root — that div holds nothing but this row and the track
          below, so it releases STICKY_RELEASE_BUFFER px before the track's
          bottom edge scrolls past, with no extra JS/height math needed
          beyond the one constant above: CSS sticky's own release point is
          already "the end of its containing block," and that block is now
          intentionally shorter than the real content.
          Bled to the same trackWidth as the track/fade below, so the
          gradient backdrop covers the peeking non-active slide too instead
          of stopping at the column's own edge — same -mx-[1px]/px-[1px] as
          the track for the same reason: without it, the two elements'
          sub-pixel rounding can diverge by a hair, showing a 1px sliver of
          the image's own border peeking out from under the gradient on the
          left. The gradient itself is a separate absolutely-positioned
          layer, not a background directly on the caption row — the caption
          row's *own* width has to stay exactly the natural column width
          (matching slideWidth) so the nav controls don't drift off to the
          right along with the bled backdrop behind them. */}
      <div
        className="sticky top-0 z-10 -mx-[1px] w-full px-[1px]"
        style={trackWidth != null ? { width: trackWidth } : undefined}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, #FFFFFF 80%, transparent)" }}
        />
        {/* pt-9 matches the TOC's own sticky "Back" link (CaseStudyLayout) —
            same 36px top offset, same top-0, so this row's baseline lines up
            with the TOC's when both are pinned during a scroll. */}
        <div
          ref={captionRowRef}
          className="relative flex w-full items-center justify-between gap-5 pt-9 pb-5"
          style={slideWidth != null ? { width: slideWidth } : undefined}
        >
          <p className="text-xs italic leading-[1.5] text-neutral-400" aria-live="polite">
            {current.caption}
          </p>
          <div className="flex items-center gap-[7px] shrink-0 whitespace-nowrap">
            {/* before:inset-[-11px] pads the hit area out to a comfortable
                tap/click target without growing the visible icon — same
                technique IconButton uses for its own icons. The pseudo-element
                is `position: absolute`, so it's taken out of flow and never
                affects this row's layout or height.
                Icon itself uses the same mask-image + currentColor technique
                as IconButton, rather than next/image — an externally loaded
                <img> can't inherit currentColor (external SVGs are isolated
                from the page's CSS), so it wouldn't pick up the hover/disabled
                color transitions the way a mask does. */}
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

      {/* -mx-[1px] px-[1px]: gives the border on the first/last slide's edge
          somewhere to render without getting clipped by the track's own
          overflow-x, since a 1px border sitting exactly on the clip edge
          otherwise gets cut in half by some browsers' scroll containers.
          Width is left at the CSS default (w-full, i.e. the column's own
          width) until the JS measurement above resolves — same column-width,
          no-bleed layout the very first paint would have had anyway.
          paddingRight reserves extra scrollable room past the last slide —
          without it, once the track bleeds out close to the viewport edge
          (see the note above), scrollWidth - clientWidth (the browser's own
          ceiling on scrollLeft) can end up *smaller* than the distance
          needed to bring the last slide flush left, so the scroll silently
          clamps short and that slide never fully arrives. Reserving
          (trackWidth - slideWidth) of trailing space — the same width as the
          peek itself — guarantees every slide, including the last, has
          enough room to reach a flush-left position. */}
      {/* The fade below has to live *outside* the scrolling track, not as its
          child — an absolutely positioned descendant of an overflow-x:auto
          element still scrolls along with that element's own content (its
          containing block is the track's padding box, but painting still
          follows the track's scrollLeft), so nesting it inside the track
          made it drift along with the slides instead of staying put. This
          wrapper is `relative` and un-scrolling; the fade is its own
          absolutely-positioned child, a sibling of the track rather than a
          descendant of it, so the track's scrollLeft can't move it.
          It also needs the same bled `trackWidth` as the track itself —
          left at its default (the column's own width), the fade's
          `right: 0` was landing at the un-bled column edge instead of the
          true viewport edge the track's own right side actually bleeds to.
          marginBottom: the actual mechanics of the sticky-release-early
          trick above — this negative margin is what pulls the release
          boundary div's own auto-height up by STICKY_RELEASE_BUFFER px,
          since a block's negative bottom margin subtracts directly from how
          much it contributes to its parent's height calculation, even
          though the track itself keeps rendering at full size (nothing
          here clips the overflow). */}
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
                    keyboard focus/activation (Enter, Space) for free, and
                    doesn't fight the div's own job of being the snap-align +
                    IntersectionObserver target. Stays in the tab order and
                    clickable even when active (a no-op — goTo() just scrolls
                    to where it already is) rather than conditionally
                    removing it, so keyboard tab order doesn't reshuffle as
                    the active slide changes; only the *look* (cursor, hover)
                    signals which ones currently do something. Native
                    drag/wheel/trackpad scrolling on the track is unaffected:
                    browsers only fire `click` on a release with no significant
                    drag in between, so this can't intercept a scroll gesture. */}
                {/* A flat white scrim, not a scale — a partial, clip-and-fade-
                    edged sliver of the image doesn't read well shrinking
                    toward its own center while the fixed viewport clip and
                    fade overlay stay put (see the git history on this file
                    for the scale version this replaced). A still, flat
                    overlay has no such mismatch: .iteration-slide-overlay
                    (globals.css) fades its opacity in on hover, gated to
                    pointer-fine devices and skipped for
                    prefers-reduced-motion, scoped to [aria-current="false"]
                    so the active slide has nothing to invite a click toward. */}
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

        {/* Fades the clipped edge into the surrounding surface color instead
            of ending in a hard cut — matches bg-surface (#FFFFFF) directly
            rather than var(--color-surface), since @theme color vars only
            reach :root when referenced by a Tailwind utility elsewhere on
            the page (see the case-study accent rules in globals.css for the
            same pattern). pointer-events-none keeps it from blocking
            drag-to-scroll on the track underneath it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-40"
          style={{ background: "linear-gradient(to right, transparent, #FFFFFF)" }}
        />
      </div>
      </div>
      <div aria-hidden="true" style={{ height: STICKY_RELEASE_BUFFER }} />
    </div>
  )
}
