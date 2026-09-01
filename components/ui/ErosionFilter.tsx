'use client'

import { useId, useRef, useState, useCallback, useEffect } from 'react'

// ⚠️ Safari: animated SVG filters + CSS transforms can cause per-frame
// rasterization. Mitigated by keeping willChange:'transform' on the animated
// child and the filter on a sibling wrapper. Disabled under prefers-reduced-motion.

export function ErosionFilterDef({ id, scale }: { id: string; scale: number }) {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/* High-frequency fractalNoise (0.75) scatters pixels near-independently
            rather than warping in blobs; scale (0→70) spreads the scatter. */}
        <filter id={id} x="-70%" y="-70%" width="240%" height="240%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="1" seed="42" result="noise"/>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export function useErosion(disabled = false) {
  const rawId = useId()
  // useId produces ":r0:" etc — strip colons for a valid CSS id
  const filterId = `erosion${rawId.replace(/:/g, '')}`
  const [scale, setScale] = useState(0)
  const currentScale = useRef(0)
  const rafRef = useRef<number | undefined>(undefined)

  const animateTo = useCallback((target: number, duration = 320) => {
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    const start = currentScale.current
    const startTime = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      currentScale.current = start + (target - start) * easeInOut(t)
      setScale(currentScale.current)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const onMouseEnter = useCallback(() => {
    if (!disabled) animateTo(70)
  }, [disabled, animateTo])

  const onMouseLeave = useCallback(() => {
    animateTo(0)
  }, [animateTo])

  return { filterId, scale, onMouseEnter, onMouseLeave }
}
