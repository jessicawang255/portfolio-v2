"use client"

import { motion, useReducedMotion } from "framer-motion"
import { discoverItems } from "@/content/work"
import { CaseStudyCard } from "@/components/ui/CaseStudyCard"
import { stagger, fadeUp } from "@/lib/motion"

// One shared 8:5 box ratio for every card, chosen to hug the artwork rather
// than average the widest/narrowest natural ratios among these four assets.
const DISCOVER_IMAGE_RATIO: [number, number] = [800, 500]

// Insets each thumbnail off the box edges — every asset shares its card's
// bg color, so the margin reads as padding, not a border mismatch.
const DISCOVER_IMAGE_INSET = 14

// Snippets' screenshot has ~12% empty margin above the mockups but none
// below — cropping the top's slack balances it under `contain`.
const SNIPPETS_SLUG = "snippets"

export function DiscoverMore() {
  const reduce = useReducedMotion()

  return (
    <motion.section
      // No top padding — the gap after CaseStudies comes from Home's own
      // gap-20 wrapper. pb-20 is the separate footer gap.
      className="container-main pb-20"
      variants={stagger}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.h2
        variants={fadeUp}
        // font-normal overrides the h2 default weight — this eyebrow isn't a sub-heading.
        className="mb-5 font-mono text-sm font-normal uppercase leading-[1.2] text-neutral-400"
      >
        Discover More
      </motion.h2>

      {/* 4 columns from `lg`, not `md` — at `md` each column is too narrow and titles wrap word-by-word. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {discoverItems.map((item) => (
          <motion.div key={item.slug} variants={fadeUp}>
            <CaseStudyCard
              project={item}
              imageRatio={DISCOVER_IMAGE_RATIO}
              imageInset={DISCOVER_IMAGE_INSET}
              imageFit={item.slug === SNIPPETS_SLUG ? "cover" : "contain"}
              titleSize="responsive"
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
