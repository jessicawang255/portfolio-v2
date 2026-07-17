"use client"

import { motion, useReducedMotion } from "framer-motion"
import { stagger, fadeUp } from "@/lib/motion"
import { IconButton } from "@/components/ui/IconButton"

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jwang255/", icon: "/icons/linkedin.svg" },
  { label: "X",        href: "https://x.com/jossici", icon: "/icons/x.svg" },
  { label: "Email",    href: "mailto:jessica.wang255@gmail.com", icon: "/icons/mail.svg" },
  { label: "GitHub",   href: "https://github.com/jessicawang255", icon: "/icons/github.svg" },
]

const photos = [
  { src: "/images/about/photo-1.jpg", alt: "Jessica at her desk", rotate: 5.5,  className: "w-[220px] h-[222px]" },
  { src: "/images/about/photo-2.jpg", alt: "Jessica outside in autumn", rotate: -7.5, className: "w-[218px] h-[222px]" },
  { src: "/images/about/photo-3.jpg", alt: "Jessica's cat", rotate: -1.7, className: "w-[280px] h-[192px]" },
]

export function AboutHero() {
  const reduce = useReducedMotion()

  return (
    <section
      className="container-main pointer-events-none pt-[120px] pb-20"
      aria-label="About introduction"
    >
      <motion.div
        variants={stagger}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
        className="pointer-events-auto relative z-[1] flex items-start justify-between gap-10"
      >
        <div className="flex max-w-sm shrink-0 flex-col">
          <motion.h1
            variants={fadeUp}
            className="mb-3 text-2xl font-medium text-neutral-900"
          >
            Let&rsquo;s get acquainted!
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mb-4 text-balance text-base font-normal text-neutral-700"
          >
            I love to sing, create, and feel. Yesterday, I had two rice
            krispies. Today, I shall have two more.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mb-4 text-balance text-base font-normal text-neutral-700"
          >
            Hi there! I&rsquo;m Jessica. 🎉 I&rsquo;m a product designer
            who&rsquo;s obsessed with exploring new ideas and contemplating
            how we can shape the future of technology to help those most in
            need.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mb-9 text-balance text-base font-normal text-neutral-700"
          >
            I love yapping and meeting ppl! Reach out to me :)
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-4">
            {socials.map(({ label, href, icon }) => (
              <IconButton key={label} href={href} label={label} icon={icon} />
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={stagger}
          className="hidden items-center gap-14 pt-2 sm:flex"
        >
          {photos.map(({ src, alt, rotate, className }) => (
            <motion.div key={src} variants={fadeUp}>
              <div
                role="img"
                aria-label={alt}
                className={`about-photo ${className} shrink-0 rounded-2xl bg-neutral-100 bg-cover bg-center`}
                style={{
                  backgroundImage: `url(${src})`,
                  ["--photo-rotate" as string]: `${rotate}deg`,
                } as React.CSSProperties}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
