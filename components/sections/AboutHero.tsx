"use client"

import { motion, useReducedMotion } from "framer-motion"
import { stagger, fadeUp } from "@/lib/motion"

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jwang255/", icon: "/icons/Linkedin.svg" },
  { label: "X",        href: "https://x.com/jossici", icon: "/icons/X.svg" },
  { label: "Email",    href: "mailto:jessica.wang255@gmail.com", icon: "/icons/Mail.svg" },
  { label: "GitHub",   href: "https://github.com/jessicawang255", icon: "/icons/GitHub.svg" },
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
        </div>

        <motion.div
          variants={fadeUp}
          className="hidden items-center gap-14 pt-2 sm:flex"
        >
          {photos.map(({ src, alt, rotate, className }) => (
            <div
              key={src}
              role="img"
              aria-label={alt}
              className={`${className} shrink-0 rounded-2xl bg-neutral-100 bg-cover bg-center`}
              style={{ backgroundImage: `url(${src})`, transform: `rotate(${rotate}deg)` }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
