"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { COMPACT_HERO_HEIGHT } from "./heroCompactHeight"

// A case study's foreground product screenshot — a transparent PNG statically
// imported by the hero component that uses it, so Next infers width/height
// from the file itself.
//
// At `lg`+ this box is exactly `100vw / aspectRatio` — the image's own real
// proportions — so `object-cover` has nothing to crop and renders pixel-
// identical to plain natural sizing. Below `lg` the box switches to the flat
// COMPACT_HERO_HEIGHT instead of scaling the image down by its aspect ratio
// (which is what read as far too short there) — `object-cover` then crops
// the image's sides to fill that taller, narrower box rather than shrinking
// it, so the screenshot stays close to its designed size on phone/tablet.
//
// id="cs-hero-content" is targeted by the case-study instance of
// ScrollRevealController, which fades + scales this the same way Work/About's
// hero content fades (the background stays fully static; see CaseStudyHero).
//
// Always absolute, top-anchored: CaseStudyHero's container has an explicit
// height at every breakpoint (compact below `lg`, aspect-ratio-driven at
// `lg`+ — see CaseStudyHero), so this never needs to be in normal flow to
// give the container something to size against.
export function HeroForeground({ src, alt }: { src: StaticImageData; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  const aspectRatio = src.width / src.height

  return (
    <div
      id="cs-hero-content"
      className="absolute inset-x-0 top-0 h-[var(--cs-hero-content-height)] lg:h-[var(--cs-hero-content-height-desktop)]"
      style={{
        transformOrigin: "center top",
        ["--cs-hero-content-height" as string]: COMPACT_HERO_HEIGHT,
        ["--cs-hero-content-height-desktop" as string]: `calc(100vw / ${aspectRatio})`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="100vw"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
