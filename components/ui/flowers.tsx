import type { Variants } from "framer-motion"

export const FLOWERS = Array.from({ length: 12 }, (_, i) => `/images/flowers/flower-${i + 1}.svg`)

export function Flower({ idx, className = "" }: { idx: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={FLOWERS[idx % FLOWERS.length]} alt="" draggable={false} className={`block size-full ${className}`} />
  )
}

// Click-to-swap transition, used with AnimatePresence mode="sync" keyed on the
// flower. Exit shrinks first; enter is delayed so it starts while exit is
// still finishing — brief overlap = crossfade, but each phase reads as its
// own distinct motion.
export const flowerSwap: Variants = {
  hidden:  { rotate: -60, scale: 0.4, opacity: 0 },
  visible: {
    rotate: 0, scale: 1, opacity: 1,
    transition: { duration: 0.35, delay: 0.15, ease: [0.42, 0, 0.58, 1] },
  },
  exit: {
    rotate: 60, scale: 0.4, opacity: 0,
    transition: { duration: 0.25, ease: [0.42, 0, 0.58, 1] },
  },
}

export const flowerSwapReduced: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}
