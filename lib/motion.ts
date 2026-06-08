import type { Variants } from "framer-motion"

const easeOut = [0.23, 1, 0.32, 1] as const

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.45, ease: easeOut } },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: easeOut } },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1,    transition: { duration: 0.35, ease: easeOut } },
}

export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
}

export const spring = {
  snappy: { type: "spring", duration: 0.35, bounce: 0.1 } as const,
  smooth: { type: "spring", duration: 0.5,  bounce: 0.15 } as const,
}
