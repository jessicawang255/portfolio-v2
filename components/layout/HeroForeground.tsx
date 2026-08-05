"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"

// A case study's foreground product screenshots — a transparent PNG statically
// imported by the hero component that uses it, so Next infers width/height
// from the file itself (no manual dimensions to keep in sync). Sized by its
// real aspect ratio (w-full h-auto, not `fill`) so it scales to the full
// viewport width without ever being stretched or cropped.
//
// id="cs-hero-content" is targeted by the case-study instance of
// ScrollRevealController, which fades + scales this the same way Work/About's
// hero content fades — this is the only element that gets that treatment
// (the background stays fully static; see CaseStudyHero), so it can anchor
// its own transform-origin directly with a plain CSS value.
export function HeroForeground({ src, alt }: { src: StaticImageData; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div id="cs-hero-content" className="absolute inset-x-0 top-0" style={{ transformOrigin: "center top" }}>
      <Image
        src={src}
        alt={alt}
        className={`w-full h-auto transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="100vw"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
