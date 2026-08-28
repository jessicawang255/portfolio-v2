"use client"

import { motion, useReducedMotion } from "framer-motion"
import { stagger, fadeUp } from "@/lib/motion"
import { IconButton } from "@/components/ui/IconButton"

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jwang255/", icon: "/icons/linkedin.svg" },
  { label: "X",        href: "https://x.com/jossici", icon: "/icons/x.svg" },
  { label: "Copy Email",    href: "mailto:jessica.wang255@gmail.com", icon: "/icons/mail.svg", copyText: "jessica.wang255@gmail.com" },
  { label: "GitHub",   href: "https://github.com/jessicawang255", icon: "/icons/github.svg" },
]

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section
      // pt jumps to its desktop value at `sm`, not `md`: `sm` is the site's
      // chrome breakpoint (see --breakpoint-sm in globals.css) — the point
      // the top nav bar appears and starts needing clearance. `pt-16` alone
      // reads as fine top-of-page whitespace below `sm` (bottom pill nav,
      // nothing fixed up top) but is tight once a 56px fixed bar sits above
      // it. pb stays on `md`, the content-shape breakpoint — the gap before
      // the next section isn't a nav-clearance concern.
      className="container-main pointer-events-none pt-16 pb-12 sm:pt-[120px] md:pb-20"
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
          className="mb-3 text-balance font-medium text-neutral-900 text-3xl"
        >
          Hi, I&rsquo;m Jessica.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mb-4 max-w-lg text-balance font-normal text-neutral-700 text-base"
        >
          I'm a product designer who's fluent from design to code. I like to think deeply about what the future of design will be. Are we all cooked? Maybe. But maybe not, too!
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mb-9 font-mono text-neutral-500 text-sm"
        >
          Currently designing + building digital asset technology @ RBC.
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center gap-4">
          {socials.map(({ label, href, icon, copyText }) => (
            <IconButton key={label} href={href} label={label} icon={icon} copyText={copyText} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
