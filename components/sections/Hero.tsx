"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { stagger, fadeUp } from "@/lib/motion"
import { FlowerIcon } from "@/components/ui/FlowerIcon"
import { DotField } from "@/components/ui/DotField"
import { FLOWERS } from "@/components/ui/flowers"

function pickRandom(current: number, total: number): number {
  let next: number
  do { next = Math.floor(Math.random() * total) } while (next === current)
  return next
}

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jwang255/", icon: "/images/Linkedin.svg" },
  { label: "X",        href: "https://x.com/jossici", icon: "/images/X.svg" },
  { label: "Email",    href: "mailto:jessica.wang255@gmail.com", icon: "/images/Mail.svg" },
  { label: "GitHub",   href: "https://github.com/jessicawang255", icon: "/images/GitHub.svg" },
]

export function Hero() {
  const reduce     = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const [flowerIdx, setFlowerIdx] = useState(0)
  const onCycle = useCallback(() => {
    setFlowerIdx(i => pickRandom(i, FLOWERS.length))
  }, [])

  return (
    <section
      ref={sectionRef}
      className="container-main relative pt-20 pb-[120px]"
      aria-label="Introduction"
    >
      {/* Dot field sits behind all content — pointer-events: none so it never blocks clicks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <DotField containerRef={sectionRef} accentColor={FLOWERS[flowerIdx].color} />
      </div>

      <motion.div
        variants={stagger}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
        className="relative z-10 flex flex-col"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <FlowerIcon flowerIdx={flowerIdx} onCycle={onCycle} />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mb-3 text-lg font-semibold text-accent"
        >
          Hi, I&rsquo;m Jessica.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mb-9 max-w-sm text-balance text-base font-normal leading-[normal] text-primary"
        >
          I fell in love with making new interactions a while ago, and I want
          to do it for at least the next little bit of my life.
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center gap-4">
          {socials.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-icon-social hover:text-accent"
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 22,
                  height: 22,
                  WebkitMaskImage: `url(${icon})`,
                  maskImage: `url(${icon})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  backgroundColor: "currentColor",
                }}
              />
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
