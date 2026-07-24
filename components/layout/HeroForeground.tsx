"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"

// A case study's foreground product screenshots — a transparent PNG statically
// imported by the hero component that uses it, so Next infers width/height
// from the file itself (no manual dimensions to keep in sync). Sized by its
// real aspect ratio (w-full h-auto, not `fill`) so it scales to the full
// viewport width without ever being stretched or cropped. Parallax motion is
// applied once, at the CaseStudyHero wrapper level, not here.
export function HeroForeground({ src, alt }: { src: StaticImageData; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="absolute inset-x-0 top-0">
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
