"use client"

import { useState } from "react"
import { Lottie } from "lottie-react"

type StickerAnimationProps = {
  alt: string
  className?: string
}

// Vector Lottie export, so it stays crisp at any size, unlike the gif
// fallback. `src` fetches/parses client-side so the multi-MB JSON never
// enters the page bundle; if that fails, the `error` subscription falls
// back to the plain gif rather than showing a blank box.
//
// Renders just the animation itself, no frame/background, so it drops into
// whatever layout the caller already has.
export function StickerAnimation({ alt, className }: StickerAnimationProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- animated gif fallback; next/image serves gifs unoptimized anyway
      <img
        src="/images/case-studies/hack-western/hw-mobile-3.gif"
        alt={alt}
        className={className}
      />
    )
  }

  return (
    <Lottie
      src="/images/case-studies/hack-western/hw-mobile-3.json"
      autoplay
      loop
      aria-label={alt}
      role="img"
      className={className}
      subscriptions={{ error: () => setFailed(true) }}
    />
  )
}
