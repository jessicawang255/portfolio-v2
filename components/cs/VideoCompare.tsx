"use client"

import { useEffect, useRef, useState } from "react"

type VideoCompareItem = {
  name: string
  label: string
  src: string
  alt: string
}

type VideoCompareProps = {
  items: [VideoCompareItem, VideoCompareItem]
  className?: string
}

const PlayIcon = () => (
  <svg width="28" height="32" viewBox="0 0 14 16" fill="none" aria-hidden="true">
    <path d="M13 7.134a1 1 0 010 1.732L1.5 15.727A1 1 0 010 14.862V1.138A1 1 0 011.5.273L13 7.134z" fill="#FFFFFF" />
  </svg>
)

// Two looped demo clips shown side by side, only one playing at a time —
// autoplaying both would have them compete for attention. The first
// autoplays on mount; the second sits paused behind a "click to play" scrim.
// Clicking a paused clip plays it and pauses the other; there's no direct
// way to pause a clip except by playing the other one.
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
    <div className={`flex flex-col gap-10 md:flex-row md:justify-center md:gap-24 ${className ?? ""}`}>
      {items.map((item, i) => {
        const isActive = activeIndex === i
        return (
          <div key={item.name} className="flex flex-col items-center gap-3">
            <p className="text-sm font-mono uppercase leading-[1.2] text-neutral-400">{item.label}</p>
            <div
              // Lighter shadow than the standard case-study-image shadow, for a softer treatment.
              className="relative w-full max-w-72 overflow-hidden rounded-[26px] border border-neutral-100 shadow-[0_4px_20px_-6px_rgba(22,25,29,0.06)]"
              style={{ aspectRatio: "390 / 844" }}
            >
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
              {/* Playing gets no overlay at all — not even a hover state —
                  since the only way to pause it is to play the other clip.
                  Paused keeps its persistent scrim + play affordance,
                  actively inviting the click rather than waiting for a
                  hover a visitor has no reason to attempt on a still frame. */}
              {!isActive && (
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
