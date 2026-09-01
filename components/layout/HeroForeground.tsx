"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"

// A case study's foreground product screenshot — a transparent PNG statically
// imported by the hero component that uses it, so Next infers width/height
// from the file itself. Sized by its real aspect ratio (w-full h-auto, not
// `fill`) so it scales to the full viewport width without stretching or cropping.
//
// id="cs-hero-content" is targeted by the case-study instance of
// ScrollRevealController, which fades + scales this the same way Work/About's
// hero content fades (the background stays fully static; see CaseStudyHero).
//
// Below `sm` this is the only in-flow child of CaseStudyHero's container
// (the background is `absolute inset-0`) — its natural height is what
// CaseStudyHero shrink-wraps to on mobile.
export function HeroForeground({ src, alt }: { src: StaticImageData; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div id="cs-hero-content" className="relative sm:absolute inset-x-0 top-0" style={{ transformOrigin: "center top" }}>
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
