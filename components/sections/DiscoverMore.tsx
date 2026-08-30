"use client"

import { motion, useReducedMotion } from "framer-motion"
import { discoverItems } from "@/content/work"
import { CaseStudyCard } from "@/components/ui/CaseStudyCard"
import { stagger, fadeUp } from "@/lib/motion"

// One shared box ratio for every card, at every width — a single row of 4
// reads as an uneven skyline if each keeps its own thumbnail ratio (unlike
// the 2-up masonry pairs in CaseStudies, where an offset pair still reads as
// intentional). 3:2 sits a bit shorter than the harmonic mean of the widest
// natural ratio here (Google Calendar, 260/140 ≈ 1.86) and the narrowest
// (Hack Western, 230/200 = 1.15) would give (1.42) — and lands in the same
// 1.47–1.53 cluster CaseStudies' own imageRatio boxes already use.
const DISCOVER_IMAGE_RATIO: [number, number] = [750, 500]

// Shrinks each thumbnail off the edges of its box rather than filling it —
// every asset here is drawn on (or, for Snippets, photographed against) a
// background that matches its card's bg color, so the margin this reveals
// reads as padding, not a mismatched border.
const DISCOVER_IMAGE_INSET = 14

export function DiscoverMore() {
  const reduce = useReducedMotion()

  return (
    <motion.section
      // No top padding — the gap after CaseStudies is the Home page's own
      // gap-20 flex wrapper now (see app/(home)/page.tsx), not this
      // section's own padding. pb-20 stays: that's the space before the
      // footer, a separate concern from the inter-section gap.
      className="container-main pb-20"
      variants={stagger}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.h2
        variants={fadeUp}
        // font-normal — see CaseStudies.tsx's identical eyebrow for why.
        className="mb-5 font-mono text-sm font-normal uppercase leading-[1.2] text-neutral-400"
      >
        Discover More
      </motion.h2>

      {/* 4-col release stays at `lg` (960px, see globals.css) rather than
          `md` — 4 columns right at `md` leaves each one too narrow and
          titles wrap word-by-word. Unrelated to image ratio now: every card
          uses DISCOVER_IMAGE_RATIO at every width, so the grid just controls
          column count, not thumbnail shape. Each column is still a plain 1fr
          share of the row, so cards narrow together without stretching. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {discoverItems.map((item) => (
          <motion.div key={item.slug} variants={fadeUp}>
            <CaseStudyCard
              project={item}
              imageRatio={DISCOVER_IMAGE_RATIO}
              imageInset={DISCOVER_IMAGE_INSET}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
