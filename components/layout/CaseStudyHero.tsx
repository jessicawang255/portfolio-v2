"use client"

import { motion, useScroll, useTransform } from "framer-motion"

// Hero sits in normal flow and drifts at a fraction of the page's scroll
// speed — parallax depth without ever pinning it to the viewport. It still
// fully scrolls away under the content card, just slower.
const PARALLAX_SPEED = 0.5

type Props = {
  height: string
  children: React.ReactNode
}

// Takes the hero background as `children` (a server-rendered element), not a
// component reference — a component/function type can't cross the server →
// client boundary as a prop, only already-rendered elements can.
export function CaseStudyHero({ height, children }: Props) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, (v) => v * (1 - PARALLAX_SPEED))

  return (
    <motion.div
      className="relative inset-x-0 top-0 overflow-hidden"
      style={{
        zIndex: 5,
        height,
        y,
        // body has padding-top: nav-height so in-flow elements start below the
        // (transparent) nav — pull the hero back up to sit flush with the
        // viewport top, same as it looked when it was position: fixed.
        marginTop: "calc(-1 * var(--nav-height))",
      }}
    >
      {children}
    </motion.div>
  )
}
