"use client"

import { motion, useReducedMotion } from "framer-motion"
import { projects } from "@/content/work"
import { CaseStudyCard } from "@/components/ui/CaseStudyCard"
import { fadeUp } from "@/lib/motion"

// Shared mobile ratio for every card below `md` (Hack Western's own desktop ratio).
const MOBILE_RATIO: [number, number] = [740, 504]

export function CaseStudies() {
  const [p0, p1, p2, p3] = projects
  const reduce = useReducedMotion()

  return (
    // No bottom padding — the gap before "Discover More" comes from Home's own gap-20 wrapper.
    <section id="work" className="container-main pt-9">
      <motion.h2
        variants={fadeUp}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        // font-normal overrides the h2 default weight (500) — this eyebrow isn't a sub-heading.
        className="mb-5 font-mono text-sm font-normal uppercase leading-[1.2] text-neutral-400"
      >
        Case Studies
      </motion.h2>

      <div className="flex flex-col gap-y-9 md:gap-y-16">
        {/* Row 1: 5/4 split. Each row triggers on its own visibility; both cards fade up together, no stagger. */}
        <motion.div
          className="grid grid-cols-1 gap-9 md:grid-cols-[5fr_4fr]"
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp}>
            <CaseStudyCard project={p0} imageRatio={[740, 504]} mobileImageRatio={MOBILE_RATIO} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <CaseStudyCard project={p1} imageRatio={[592, 388]} mobileImageRatio={MOBILE_RATIO} />
          </motion.div>
        </motion.div>

        {/* Row 2: right card dominant */}
        <motion.div
          className="grid grid-cols-1 gap-9 md:grid-wide-right"
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp}>
            <CaseStudyCard project={p3} imageRatio={[719, 475]} mobileImageRatio={MOBILE_RATIO} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <CaseStudyCard project={p2} imageRatio={[719, 475]} mobileImageRatio={MOBILE_RATIO} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
