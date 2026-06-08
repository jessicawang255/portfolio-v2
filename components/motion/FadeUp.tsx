"use client"

import { motion, useReducedMotion } from "framer-motion"
import { fadeUp } from "@/lib/motion"

type Props = {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeUp({ children, delay = 0, className }: Props) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      variants={fadeUp}
      initial={reduce ? "visible" : "hidden"}
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
