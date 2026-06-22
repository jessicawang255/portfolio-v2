'use client'

import { useState, useCallback, useRef } from 'react'
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

  // Locked after a click — hover won't reactivate until the cursor leaves and
  // re-enters, so the new flower doesn't immediately inherit the hover state.
  const hoverLocked = useRef(false)

  const handleMouseEnter = useCallback(() => {
    if (hoverLocked.current) return
    setIsHovered(true)
    erosionEnter()
  }, [erosionEnter])

  const handleMouseLeave = useCallback(() => {
    hoverLocked.current = false
    setIsHovered(false)
    erosionLeave()
  }, [erosionLeave])

  const cycle = useCallback(() => {
    hoverLocked.current = true
    setIsHovered(false)
    erosionLeave()
    setIdx(i => pickRandom(i, FLOWERS.length))
  }, [erosionLeave])

  const handleClick = useCallback(() => { cycle() }, [cycle])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      cycle()
    }
  }, [cycle])

  const FlowerComponent = FLOWERS[idx].component

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Decorative flower — click to change"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          <AnimatePresence mode="sync">
            <motion.div
              key={idx}
              variants={
                reducedMotion
                  ? {
                      hidden:  { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 0.15 } },
                      exit:    { opacity: 0, transition: { duration: 0.15 } },
                    }
                  : {
                      // Exit shrinks first; enter is delayed so it starts while
                      // exit is still finishing — brief overlap = crossfade,
                      // but each phase reads as its own distinct motion.
                      hidden:  { rotate: -60, scale: 0.4, opacity: 0 },
                      visible: {
                        rotate: 0, scale: 1, opacity: 1,
                        transition: { duration: 0.55, delay: 0.25, ease: [0.42, 0, 0.58, 1] },
                      },
                      exit: {
                        rotate: 60, scale: 0.4, opacity: 0,
                        transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] },
                      },
                    }
              }
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transformOrigin: '50% 50%',
              }}
            >
              <FlowerComponent />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
