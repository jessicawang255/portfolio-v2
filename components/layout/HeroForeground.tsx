"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { COMPACT_HERO_HEIGHT } from "./heroCompactHeight"

// A case study's foreground product screenshot(s), statically imported by
// the hero component that uses them so Next infers width/height.
//
// At `lg`+ this box is exactly `100vw / (src.width/src.height)`, so
// `object-cover` has nothing to crop. Below `lg` the box switches to the
// flat COMPACT_HERO_HEIGHT instead of scaling `src` down (which read as far
// too short) — `object-cover` then crops the sides to fill that taller,
// narrower box instead of shrinking.
//
// `mobileSrc` (optional) swaps in a separate image art-directed for that
// compact crop, rendering two <Image>s and toggling visibility via CSS
// rather than swapping one `src`. Falls back to `src` if there's no
// dedicated mobile image yet.
//
// id="cs-hero-content" is targeted by ScrollRevealController, which fades +
// scales this the same way Work/About's hero content fades.
export function HeroForeground({
  src,
  mobileSrc,
  alt,
}: {
  src: StaticImageData
  mobileSrc?: StaticImageData
  alt: string
}) {
  const [compactLoaded, setCompactLoaded] = useState(false)
  const [desktopLoaded, setDesktopLoaded] = useState(false)
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
      {/* Below `lg` only — hidden (not unmounted) above it so the crossfade-
          in on first load doesn't retrigger every time the breakpoint is
          crossed. The inverted `sizes` on each keeps the browser from
          fetching the hidden one's smallest candidate and getting stuck with
          it if the viewport is later resized past `lg` client-side. */}
      <Image
        src={mobileSrc ?? src}
        alt={alt}
        fill
        className={`block lg:hidden object-cover transition-opacity duration-500 ease-out ${
          compactLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(min-width: 1024px) 0px, 100vw"
        onLoad={() => setCompactLoaded(true)}
      />
      <Image
        src={src}
        alt={alt}
        fill
        className={`hidden lg:block object-cover transition-opacity duration-500 ease-out ${
          desktopLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(min-width: 1024px) 100vw, 0px"
        onLoad={() => setDesktopLoaded(true)}
      />
    </div>
  )
}
