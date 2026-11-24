"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

type VideoCompareItem = {
  name: string
  label: string
  src: string
  alt: string
}

type VideoCompareProps = {
  // Two or more. An item whose src isn't an .mp4 renders as a plain still
  // with no play scrim, as a stand-in until its recording is exported.
  items: VideoCompareItem[]
  className?: string
}

const PlayIcon = () => (
  <svg width="28" height="32" viewBox="0 0 14 16" fill="none" aria-hidden="true">
    <path d="M13 7.134a1 1 0 010 1.732L1.5 15.727A1 1 0 010 14.862V1.138A1 1 0 011.5.273L13 7.134z" fill="#FFFFFF" />
  </svg>
)

// Looped demo clips shown side by side, only one playing at a time —
// autoplaying them all would have them compete for attention. The first
// autoplays on mount; the rest sit paused behind a "click to play" scrim.
// Clicking a paused clip plays it and pauses the others; there's no direct
// way to pause a clip except by playing another one.
export function VideoCompare({ items, className }: VideoCompareProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    items.forEach((_, i) => {
      const el = videoRefs.current[i]
      if (!el) return
      if (i === activeIndex) {
        el.play().catch(() => {
          // Autoplay can be rejected before the user has interacted with
          // the page at all (browser policy, not a real error) — the
          // click-to-play scrim on the other clip is still there as a
          // fallback, so there's nothing to recover from here.
        })
      } else {
        el.pause()
      }
    })
  }, [activeIndex, items])

  return (
    <div
      className={`flex flex-col gap-10 md:flex-row md:justify-center ${
        items.length > 2 ? "md:gap-8" : "md:gap-24"
      } ${className ?? ""}`}
    >
      {items.map((item, i) => {
        const isActive = activeIndex === i
        const isVideo = item.src.endsWith(".mp4")
        return (
          // Three or more share the row evenly instead of each claiming
          // max-w-72, which would overflow the content column.
          <div key={item.name} className={`flex flex-col items-center gap-3 ${items.length > 2 ? "md:min-w-0 md:flex-1" : ""}`}>
            <p className="text-sm font-mono uppercase leading-[1.2] text-neutral-400">{item.label}</p>
            <div
              // Lighter shadow than the standard case-study-image shadow, for a softer treatment.
              className="relative w-full max-w-72 overflow-hidden rounded-[26px] border border-media-stroke shadow-[0_4px_20px_-6px_rgba(22,25,29,0.06)]"
              style={{ aspectRatio: "390 / 844" }}
            >
              {isVideo ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el
                  }}
                  src={item.src}
                  muted
                  loop
                  playsInline
                  aria-label={item.alt}
                  className="block h-full w-full object-cover"
                />
              ) : (
                <Image src={item.src} alt={item.alt} fill sizes="288px" className="object-cover object-top" />
              )}
              {/* Playing gets no overlay at all — not even a hover state —
                  since the only way to pause it is to play the other clip.
                  Paused keeps its persistent scrim + play affordance,
                  actively inviting the click rather than waiting for a
                  hover a visitor has no reason to attempt on a still frame. */}
              {isVideo && !isActive && (
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Play ${item.label}`}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-neutral-900/40 transition-colors duration-150 hover:bg-neutral-900/50"
                >
                  <PlayIcon />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
