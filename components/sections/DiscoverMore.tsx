"use client"

import { motion, useReducedMotion } from "framer-motion"
import { discoverItems } from "@/content/work"
import { CaseStudyCard } from "@/components/ui/CaseStudyCard"
import { stagger, fadeUp } from "@/lib/motion"

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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {discoverItems.map((item) => (
          <motion.div key={item.slug} variants={fadeUp}>
            <CaseStudyCard project={item} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
