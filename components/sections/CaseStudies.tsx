"use client"

import { motion, useReducedMotion } from "framer-motion"
import { projects } from "@/content/work"
import { CaseStudyCard } from "@/components/ui/CaseStudyCard"
import { IconButton } from "@/components/ui/IconButton"
import { fadeUp } from "@/lib/motion"

// Shared mobile ratio for every card below `md` (Hack Western's own desktop ratio).
const MOBILE_RATIO: [number, number] = [740, 504]

// Same social set + boxed treatment as Hero's icon row.
const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jwang255/", icon: "/icons/linkedin.svg" },
  { label: "X",        href: "https://x.com/jossici", icon: "/icons/x.svg" },
  { label: "Copy Email", href: "mailto:jessica.wang255@gmail.com", icon: "/icons/mail.svg", copyText: "jessica.wang255@gmail.com", mobileCopiedTooltip: true },
  { label: "GitHub",   href: "https://github.com/jessicawang255", icon: "/icons/github.svg" },
]

export function CaseStudies() {
  const [p0, p1, p2, p3, p4] = projects
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
          className="grid grid-cols-1 gap-y-9 gap-x-[18px] md:grid-cols-[5fr_4fr]"
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
          className="grid grid-cols-1 gap-y-9 gap-x-[18px] md:grid-wide-right"
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

        {/* Row 3: standalone card — 5th project has no pair yet. Reuses
            grid-wide-left so the card takes the dominant 3fr column (sized
            to project.thumbnailWidth/Height); the remaining 2fr column
            holds a contact panel instead of sitting empty. */}
        <motion.div
          className="grid grid-cols-1 gap-y-9 gap-x-[18px] md:grid-wide-left"
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp}>
            <CaseStudyCard project={p4} mobileImageRatio={MOBILE_RATIO} />
          </motion.div>
          <motion.div
            variants={fadeUp}
            // Desktop-only: fills the blank column left by RBC having no
            // pair yet — drop this once a 6th case study takes the slot.
            // self-start sizes to min-h, not the RBC card's full row height.
            // shadow mimics a 1px black-6% border, since neutral-75 is
            // nearly white and a real border would vanish or overpower it.
            className="hidden md:flex flex-col justify-between self-start min-h-[14rem] rounded-2xl bg-neutral-75 p-8 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
          >
            <p className="text-balance text-base font-normal text-neutral-600">
              Want to learn more about my work? Contact me!
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, icon, copyText, mobileCopiedTooltip }) => (
                <IconButton
                  key={label}
                  href={href}
                  label={label}
                  icon={icon}
                  copyText={copyText}
                  mobileCopiedTooltip={mobileCopiedTooltip}
                  variant="boxed"
                  size={22}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
