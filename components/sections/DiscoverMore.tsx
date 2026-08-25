"use client"

import { motion, useReducedMotion } from "framer-motion"
import { discoverItems } from "@/content/work"
import { CaseStudyCard } from "@/components/ui/CaseStudyCard"
import { stagger, fadeUp } from "@/lib/motion"

// Mobile 2x2 tiles share this ratio rather than Google Calendar's own raw
// thumbnail dimensions (260/140 ≈ 1.86, quite short) — pulled slightly
// taller so the tiles read less squat in a two-column grid.
const MOBILE_DISCOVER_RATIO: [number, number] = [260, 165]

export function DiscoverMore() {
  const reduce = useReducedMotion()

  return (
    <motion.section
      className="container-main pt-12 pb-20"
      variants={stagger}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.h2
        variants={fadeUp}
        className="mb-5 font-mono text-sm uppercase leading-[1.2] text-neutral-400"
      >
        Discover More
      </motion.h2>

      {/* Mobile thumbnails all match the first item's (Google Calendar)
          ratio so the 2x2 grid reads as one uniform set of tiles; at
          `lg` (960px, see globals.css) each card reverts to its own
          natural thumbnail ratio for the bento-style 4-col single-row
          layout. That release point sits well past `md` on purpose — 4
          columns right at `md` leaves each one too narrow and titles wrap
          word-by-word. Each column is still a plain 1fr share of the row,
          so cards narrow together and stay their own aspect ratio; nothing
          stretches to compensate. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {discoverItems.map((item) => (
          <motion.div key={item.slug} variants={fadeUp}>
            <CaseStudyCard
              project={item}
              mobileImageRatio={MOBILE_DISCOVER_RATIO}
              mobileBreakpoint="lg"
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
