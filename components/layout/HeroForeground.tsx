"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

// Parallax depth: background stays perfectly fixed (0x), the content card
// scrolls at full speed (1x) on top of everything, and this foreground layer
// drifts at a fraction of that speed in between the two.
const PARALLAX_FACTOR = 0.4

// A case study's foreground product screenshots — a transparent PNG statically
// imported by the hero component that uses it, so Next infers width/height
// from the file itself (no manual dimensions to keep in sync). Sized by its
// real aspect ratio (w-full h-auto, not `fill`) so it scales to the full
// viewport width without ever being stretched or cropped.
export function HeroForeground({ src, alt }: { src: StaticImageData; alt: string }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, (v) => v * -PARALLAX_FACTOR)
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div className="absolute inset-x-0 top-0" style={{ y }}>
      <Image
        src={src}
        alt={alt}
        className={`w-full h-auto drop-shadow-lg transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="100vw"
        onLoad={() => setLoaded(true)}
      />
    </motion.div>
  )
}
