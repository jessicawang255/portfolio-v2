"use client"

import { motion, useReducedMotion } from "framer-motion"
import { stagger, fadeUp } from "@/lib/motion"

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jwang255/", icon: "/images/Linkedin.svg" },
  { label: "X",        href: "https://x.com/jossici", icon: "/images/X.svg" },
  { label: "Email",    href: "mailto:jessica.wang255@gmail.com", icon: "/images/Mail.svg" },
  { label: "GitHub",   href: "https://github.com/jessicawang255", icon: "/images/GitHub.svg" },
]

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section
      className="container-main pointer-events-none pt-[120px] pb-20"
      aria-label="Introduction"
    >
      <motion.div
        variants={stagger}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
        className="pointer-events-auto relative z-[1] flex flex-col"
      >
        <motion.h1
          variants={fadeUp}
          className="mb-3 text-2xl font-semibold text-neutral-800"
        >
          Hi, I&rsquo;m Jessica.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mb-4 max-w-sm text-balance text-base font-normal leading-relaxed text-primary"
        >
          I fell in love with making new interactions a while ago, and I want
          to do it for at least the next little bit of my life. Yada boo yada moo
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mb-9 font-mono text-sm text-muted"
        >
          Currently designing + building digital asset technology @ RBC.
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center gap-4">
          {socials.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-icon-social hover:text-accent transition-colors duration-75"
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
