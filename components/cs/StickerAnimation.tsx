"use client"

import { useState } from "react"
import { Lottie } from "lottie-react"

type StickerAnimationProps = {
  alt: string
  className?: string
}

// The sticker's source of truth is the Lottie export (hw-mobile-3.json) —
// vector, so it stays crisp at any size, unlike the baked-resolution gif
// sitting next to it. `src` on <Lottie> takes a URL and fetches/parses it
// client-side, so the multi-MB JSON never enters the page bundle. If that
// fetch/parse ever fails (blocked request, malformed export, etc.), the
// `error` subscription flips `failed` and we fall back to the plain gif
// rather than showing a blank box.
//
// Renders just the animation itself — no frame/background — so it drops
// into whatever layout the caller already has (e.g. sized to content
// alongside a Callout that fills the rest of the row).
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
