"use client"

import { motion, useReducedMotion } from "framer-motion"
import { projects } from "@/content/work"
import { CaseStudyCard } from "@/components/ui/CaseStudyCard"
import { fadeUp } from "@/lib/motion"

// Shared mobile ratio for every card below `sm` (Hack Western's own desktop
// ratio) — see DiscoverMore's identical use of mobileImageRatio.
const MOBILE_RATIO: [number, number] = [740, 504]

export function CaseStudies() {
  const [p0, p1, p2, p3] = projects
  const reduce = useReducedMotion()

  return (
    <section id="work" className="container-main pt-9 pb-20">
      <motion.h2
        variants={fadeUp}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-5 font-mono text-sm uppercase leading-[1.2] text-neutral-400"
      >
        Case Studies
      </motion.h2>

      <div className="flex flex-col gap-y-9 sm:gap-y-16">
        {/* Row 1: 5/4 split — each row triggers on its own visibility, and
            both cards in the row fade up together (no stagger between them). */}
        <motion.div
          className="grid grid-cols-1 gap-9 sm:grid-cols-[5fr_4fr]"
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
          className="grid grid-cols-1 gap-9 sm:grid-wide-right"
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp}>
            <CaseStudyCard project={p3} imageRatio={[533, 400]} mobileImageRatio={MOBILE_RATIO} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <CaseStudyCard project={p2} imageRatio={[799, 475]} mobileImageRatio={MOBILE_RATIO} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
