"use client"

import { motion, useReducedMotion } from "framer-motion"
import { stagger, fadeUp } from "@/lib/motion"
import { IconButton } from "@/components/ui/IconButton"
import { TertiaryLink } from "@/components/ui/TertiaryLink"

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jwang255/", icon: "/icons/linkedin.svg" },
  { label: "X",        href: "https://x.com/jossici", icon: "/icons/x.svg" },
  { label: "Copy Email",    href: "mailto:jessica.wang255@gmail.com", icon: "/icons/mail.svg", copyText: "jessica.wang255@gmail.com", mobileCopiedTooltip: true },
  { label: "GitHub",   href: "https://github.com/jessicawang255", icon: "/icons/github.svg" },
]

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section
      // pt switches at `sm` (nav-clearance breakpoint, once the fixed top bar
      // appears); pb switches at `md` (content-shape breakpoint).
      className="container-main pointer-events-none pt-16 pb-12 sm:pt-[120px] md:pb-20"
      aria-label="Introduction"
    >
      <motion.div
        variants={stagger}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
        className="pointer-events-auto relative z-[1] flex flex-col"
      >
        <div className="text-glow w-fit">
          <motion.h1
            variants={fadeUp}
            className="text-glow-item mb-3 font-medium text-neutral-900 text-3xl"
          >
            Hi, I&apos;m Jessica.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-glow-item mb-3 max-w-xl text-balance font-normal text-neutral-600 text-lg leading-snug"
          >
            I&apos;m a technical product designer who creates experiences that foster community and delight.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-glow-item mb-9 max-w-xl text-pretty font-normal text-neutral-600 text-lg leading-snug"
          >
            Most recently designing + building digital asset technology @{" "}
            <TertiaryLink href="https://www.rbcroyalbank.com" target="_blank" rel="noopener noreferrer">
              RBC
            </TertiaryLink>
            .
          </motion.p>
        </div>

        <motion.div variants={fadeUp} className="flex items-center gap-3">
          {socials.map(({ label, href, icon, copyText, mobileCopiedTooltip }) => (
            <IconButton key={label} href={href} label={label} icon={icon} copyText={copyText} mobileCopiedTooltip={mobileCopiedTooltip} variant="boxed" size={22} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
