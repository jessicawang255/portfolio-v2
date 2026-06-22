'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FLOWERS, Stem } from './flowers'
import { ErosionFilterDef, useErosion } from './ErosionFilter'

function pickRandom(current: number, total: number): number {
  let next: number
  do { next = Math.floor(Math.random() * total) } while (next === current)
  return next
}

const FLOAT_ANIMATE = { scale: [1, 0.85, 1] }
const FLOAT_TRANSITION = {
  duration: 3,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}

export function FlowerIcon() {
  const [idx, setIdx] = useState(0)
  const reducedMotion = useReducedMotion()
  const { filterId, scale, onMouseEnter, onMouseLeave } = useErosion(!!reducedMotion)

  const handleClick = useCallback(() => {
    setIdx(i => pickRandom(i, FLOWERS.length))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIdx(i => pickRandom(i, FLOWERS.length))
    }
  }, [])

  const FlowerComponent = FLOWERS[idx].component

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Decorative flower — click to change"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      // Outer div sets the layout footprint at the target display size (32px).
      // Inner div preserves the original 100px coordinate space so all absolute
      // positions, SVG sizes, and animation values stay untouched — CSS scale
      // handles the rest.
      style={{ position: 'relative', width: 32, height: 45, cursor: 'pointer' }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 100,
        height: 141,
        transform: 'scale(0.32)',
        transformOrigin: 'top left',
      }}>
      {/* Zero-size filter definition, positioned out of flow */}
      <ErosionFilterDef id={filterId} scale={scale} />

      {/* Stem — never moves, always visible beneath the flower head */}
      <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
        <Stem />
      </div>

      {/*
        Flower head layer.
        - Float: continuous subtle y-axis animation (disabled under reduced motion)
        - Filter: hover erosion via animated feDisplacementMap (disabled under reduced motion)
        - Hover: reduced-motion fallback uses opacity via whileHover
      */}
      <motion.div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        animate={reducedMotion ? undefined : FLOAT_ANIMATE}
        transition={reducedMotion ? undefined : FLOAT_TRANSITION}
        whileHover={reducedMotion ? { opacity: 0.75 } : undefined}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 100,
          height: 100,
          // Filter applied on same element as transform for correct compositing
          filter: reducedMotion ? undefined : `url(#${filterId})`,
          willChange: 'transform',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { rotate: -180, scale: 0.3, opacity: 0 }
            }
            animate={
              reducedMotion
                ? { opacity: 1 }
                : { rotate: 0, scale: 1, opacity: 1 }
            }
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { rotate: 180, scale: 0.3, opacity: 0 }
            }
            transition={
              reducedMotion
                ? { duration: 0.1 }
                : { duration: 0.35, ease: [0.87, 0, 0.13, 1] }
            }
            style={{ transformOrigin: '50% 50%' }}
          >
            <FlowerComponent />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      </div>
    </div>
  )
}
