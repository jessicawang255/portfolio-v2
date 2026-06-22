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

export function FlowerIcon() {
  const [idx, setIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const reducedMotion = useReducedMotion()

  const {
    filterId,
    scale: erosionScale,
    onMouseEnter: erosionEnter,
    onMouseLeave: erosionLeave,
  } = useErosion(!!reducedMotion)

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    erosionEnter()
  }, [erosionEnter])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    erosionLeave()
  }, [erosionLeave])

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
        <ErosionFilterDef id={filterId} scale={erosionScale} />

        <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
          <Stem />
        </div>

        <motion.div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileHover={reducedMotion ? { opacity: 0.75 } : undefined}
          animate={
            reducedMotion ? undefined :
            isHovered
              ? { scale: 1.1, rotate: 45 }
              : { scale: [1, 0.85, 1], rotate: 0 }
          }
          transition={
            reducedMotion ? undefined :
            isHovered
              ? {
                  scale: { duration: 0.3, ease: 'easeOut' },
                  rotate: { duration: 0.3, ease: 'easeOut' },
                }
              : {
                  scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 0.3, ease: 'easeOut' },
                }
          }
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 100,
            height: 100,
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
