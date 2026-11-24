"use client"

import { useEffect, useRef, useState } from "react"
import { PhoneVideo } from "./PhoneVideo"

type Item = { label: string; src: string; alt: string }

const PlayIcon = () => (
  <svg width="24" height="28" viewBox="0 0 14 16" fill="none" aria-hidden="true">
    <path d="M13 7.134a1 1 0 010 1.732L1.5 15.727A1 1 0 010 14.862V1.138A1 1 0 011.5.273L13 7.134z" fill="#FFFFFF" />
  </svg>
)

// Phone recordings side by side with VideoCompare's playback rule: only one
// plays at a time, so they don't compete for attention. The first autoplays;
// the rest wait behind a "click to play" scrim, and clicking one pauses the
// one that was playing.
export function PhoneVideoCompare({ items }: { items: Item[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    videoRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === activeIndex) {
        el.play().catch(() => {
          // Autoplay can be refused before any interaction (browser policy);
          // the scrims on the other clips still offer a way in.
        })
      } else {
        el.pause()
      }
    })
  }, [activeIndex])

  return (
    <div className="flex flex-col items-center gap-10 rounded-[8px] border border-media-stroke bg-neutral-75 px-6 py-10 sm:flex-row sm:items-start sm:justify-center sm:gap-8 md:gap-12">
      {items.map((item, i) => {
        const isActive = i === activeIndex
        return (
          <div key={item.src} className="flex w-full max-w-[200px] flex-col items-center gap-4 sm:min-w-0 sm:flex-1">
            <p className="whitespace-nowrap text-sm font-mono uppercase leading-[1.2] text-neutral-400">{item.label}</p>
            <PhoneVideo
              src={item.src}
              alt={item.alt}
              autoPlay={false}
              videoRef={(el) => {
                videoRefs.current[i] = el
              }}
              overlay={
                !isActive && (
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Play ${item.label}`}
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-neutral-900/40 transition-colors duration-150 hover:bg-neutral-900/50"
                  >
                    <PlayIcon />
                  </button>
                )
              }
            />
          </div>
        )
      })}
    </div>
  )
}
