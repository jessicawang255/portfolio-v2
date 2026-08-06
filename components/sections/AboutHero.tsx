"use client"

import { useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { stagger, fadeUp } from "@/lib/motion"
import { IconButton } from "@/components/ui/IconButton"

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jwang255/", icon: "/icons/linkedin.svg" },
  { label: "X",        href: "https://x.com/jossici", icon: "/icons/x.svg" },
  { label: "Copy Email",    href: "mailto:jessica.wang255@gmail.com", icon: "/icons/mail.svg" },
  { label: "GitHub",   href: "https://github.com/jessicawang255", icon: "/icons/github.svg" },
]

const photos = [
  {
    id: "photo-1",
    srcs: [
      "/images/about/photo-1-1.jpg",
      "/images/about/photo-1-2.jpg",
      "/images/about/photo-1-3.jpg",
      "/images/about/photo-1-4.jpg",
    ],
    alt: "Jessica at her desk",
    rotate: 5.5,
    className: "w-[220px] h-[222px]",
  },
  {
    id: "photo-2",
    srcs: [
      "/images/about/photo-2-1.jpg",
      "/images/about/photo-2-2.jpg",
      "/images/about/photo-2-3.jpg",
    ],
    alt: "Jessica outside in autumn",
    rotate: -7.5,
    className: "w-[218px] h-[222px]",
  },
  {
    id: "photo-3",
    srcs: [
      "/images/about/photo-3-1.jpg",
      "/images/about/photo-3-2.jpg",
      "/images/about/photo-3-3.jpg",
    ],
    alt: "Jessica's cat",
    rotate: -1.7,
    className: "w-[280px] h-[192px]",
  },
]

// Click-to-advance transition: a diagonal glare sweeps across the tile while
// the photo itself crossfades in underneath. The glare is purely decorative
// and runs independently of the crossfade — it never blocks the next click.
function runShimmerTransition(layers: HTMLElement, base: HTMLImageElement, toSrc: string) {
  const incoming = document.createElement("img")
  incoming.className = "about-photo-layer"
  incoming.alt = ""
  incoming.src = toSrc
  incoming.style.opacity = "0"
  incoming.style.filter = "blur(3px)"
  layers.appendChild(incoming)

  const bar = document.createElement("span")
  bar.className = "about-photo-shimmer-bar"
  layers.appendChild(bar)

  const barAnim = bar.animate(
    [{ transform: "translateX(-120%)" }, { transform: "translateX(120%)" }],
    { duration: 1000, easing: "cubic-bezier(0.45,0,0.2,1)", fill: "forwards" }
  )
  barAnim.finished.then(() => bar.remove()).catch(() => {})

  const inAnim = incoming.animate(
    [
      { opacity: 0, filter: "blur(3px)" },
      { opacity: 1, filter: "blur(0px)" },
    ],
    { duration: 260, delay: 150, easing: "ease", fill: "forwards" }
  )

  return inAnim.finished
    .catch(() => {
      // Animation got cancelled (e.g. unmounted mid-flight) — still land on the new photo.
    })
    .then(() => {
      base.src = toSrc
      incoming.remove()
    })
}

export function AboutHero() {
  const reduce = useReducedMotion()
  const [indices, setIndices] = useState(() => photos.map(() => 0))
  const layersRefs = useRef<(HTMLSpanElement | null)[]>([])
  const baseImgRefs = useRef<(HTMLImageElement | null)[]>([])
  const animatingRef = useRef<boolean[]>(photos.map(() => false))

  const advance = (i: number) => {
    if (animatingRef.current[i]) return
    const nextIndex = (indices[i] + 1) % photos[i].srcs.length
    const toSrc = photos[i].srcs[nextIndex]
    const layers = layersRefs.current[i]
    const base = baseImgRefs.current[i]

    const land = () => {
      setIndices((prev) => {
        const next = [...prev]
        next[i] = nextIndex
        return next
      })
    }

    if (reduce || !layers || !base) {
      land()
      return
    }

    animatingRef.current[i] = true
    runShimmerTransition(layers, base, toSrc).then(() => {
      land()
      animatingRef.current[i] = false
    })
  }

  return (
    <section
      className="container-main pointer-events-none pt-[120px] pb-28"
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
          {photos.map(({ id, srcs, alt, rotate, className }, i) => (
            <motion.div key={id} variants={fadeUp}>
              <button
                type="button"
                onClick={() => advance(i)}
                onPointerDown={(e) => e.currentTarget.style.setProperty("--photo-press", "0.97")}
                onPointerUp={(e) => e.currentTarget.style.removeProperty("--photo-press")}
                onPointerLeave={(e) => e.currentTarget.style.removeProperty("--photo-press")}
                aria-label={`${alt} — show next photo`}
                className={`about-photo relative ${className} block shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-100`}
                style={{ ["--photo-rotate" as string]: `${rotate}deg` } as React.CSSProperties}
              >
                <span
                  className="about-photo-layers"
                  ref={(el) => { layersRefs.current[i] = el }}
                >
                  <img
                    ref={(el) => { baseImgRefs.current[i] = el }}
                    src={srcs[indices[i]]}
                    alt={alt}
                    className="about-photo-layer"
                  />
                </span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
