"use client"

import { useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { stagger, fadeUp } from "@/lib/motion"
import { IconButton } from "@/components/ui/IconButton"

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jwang255/", icon: "/icons/linkedin.svg" },
  { label: "X",        href: "https://x.com/jossici", icon: "/icons/x.svg" },
  { label: "Copy Email",    href: "mailto:jessica.wang255@gmail.com", icon: "/icons/mail.svg", copyText: "jessica.wang255@gmail.com" },
  { label: "GitHub",   href: "https://github.com/jessicawang255", icon: "/icons/github.svg" },
]

// Three responsive tiers: a 2-col grid on phone, a fluid flex row from `sm`,
// fixed px sizes from `2xl`. Each photo's aspect-[W/H] and max-w-[Npx] (its
// original design size) stay the ceiling at every tier.
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
    className: "aspect-[220/222] max-w-[220px] sm:flex-[220] 2xl:flex-none 2xl:w-[220px] 2xl:h-[222px]",
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
    className: "aspect-[218/222] max-w-[218px] sm:flex-[218] 2xl:flex-none 2xl:w-[218px] 2xl:h-[222px]",
  },
  {
    id: "photo-3",
    srcs: [
      "/images/about/photo-3-1.jpg",
      "/images/about/photo-3-2.jpg",
      "/images/about/photo-3-3.jpg",
      "/images/about/photo-3-4.png",
      "/images/about/photo-3-5.png",
    ],
    alt: "Jessica's cat",
    rotate: -1.7,
    // Spans both columns and centers itself on its own row on phone (see
    // the grid below); sm:mx-0 clears that at `sm` since a flex auto-margin
    // would otherwise claim free space before flex-grow gets any.
    className: "col-span-2 mx-auto w-full aspect-[280/192] max-w-[280px] sm:mx-0 sm:w-auto sm:flex-[280] 2xl:flex-none 2xl:w-[280px] 2xl:h-[192px]",
  },
]

// Click-to-advance transition: a diagonal glare sweeps across the tile while
// the photo crossfades in underneath. The glare is purely decorative and
// runs independently — it never blocks the next click.
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
      // pt switches at `sm` (nav-clearance breakpoint); pb switches at `md` (content-shape breakpoint).
      className="container-main pointer-events-none pt-16 pb-12 sm:pt-[120px] md:pb-20"
      aria-label="About introduction"
    >
      <motion.div
        variants={stagger}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
        // Stacked (text above photos) through tablet; `2xl` is the first
        // width with room for both side by side (see that breakpoint's own
        // comment in globals.css).
        className="pointer-events-auto relative z-[1] flex flex-col gap-14 2xl:flex-row 2xl:items-start 2xl:justify-between 2xl:gap-24"
      >
        {/* max-w-[800px] only applies once the row layout kicks in at `2xl`;
            below that this column stays full width. Left shrinkable (no
            shrink-0) so if space gets tight, this column wraps before the
            fixed-size photo row gets pushed off-screen. */}
        <div className="flex w-full flex-col 2xl:max-w-[800px]">
          <motion.h1
            variants={fadeUp}
            className="mb-3 text-balance text-3xl font-medium text-neutral-900"
          >
            Let&rsquo;s get acquainted!
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-lg text-balance text-base font-normal text-neutral-600"
          >
            I&rsquo;m a creative, a problem-solver, and a maker who obsesses
            over details. I&rsquo;m driven by the idea that you can make
            something from nothing, whether that be products, songs, or
            communities.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-balance text-base font-normal text-neutral-600"
          >
            On any given day, you might find me producing music, climbing
            rocks, learning about the stars, or collecting design inspo on X.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 mb-9 max-w-lg text-balance text-base font-normal text-neutral-600"
          >
            Say hi, I&rsquo;d love to connect!
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-4">
            {socials.map(({ label, href, icon, copyText }) => (
              <IconButton key={label} href={href} label={label} icon={icon} copyText={copyText} />
            ))}
          </motion.div>
        </div>

        {/* Photo grid: 2 columns on phone (photo-3 spans both and centers on
            row two — see its own className above), a single fluid flex row
            from `sm`, side-by-side with the text column from `2xl`. */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-2 w-full items-center gap-4.5 sm:flex sm:gap-9 2xl:w-auto 2xl:gap-14 2xl:pt-2"
        >
          {photos.map(({ id, srcs, alt, rotate, className }, i) => (
            // Sizing classes live on this wrapper, not the button — flex-grow
            // only applies to a flex container's direct children, so one
            // level deeper would silently no-op.
            <motion.div key={id} variants={fadeUp} className={className}>
              <button
                type="button"
                onClick={() => advance(i)}
                onPointerDown={(e) => e.currentTarget.style.setProperty("--photo-press", "0.97")}
                onPointerUp={(e) => e.currentTarget.style.removeProperty("--photo-press")}
                onPointerLeave={(e) => e.currentTarget.style.removeProperty("--photo-press")}
                aria-label={`${alt} — show next photo`}
                className="about-photo relative block h-full w-full cursor-pointer rounded-[22px] border border-neutral-900/3 bg-neutral-100/50 p-1.5"
                style={{ ["--photo-rotate" as string]: `${rotate}deg` } as React.CSSProperties}
              >
                {/* Image well, inset by the frame's 6px padding — its own
                    rounded-2xl (16px) plus that padding sums to the frame's
                    rounded-[22px]. Needs `relative` since .about-photo-layers
                    is absolutely positioned. */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-100">
                  <span
                    className="about-photo-layers"
                    ref={(el) => { layersRefs.current[i] = el }}
                  >
                    {/* Plain <img>, not next/image — runShimmerTransition
                        crossfades by mutating this element's .src directly,
                        which next/image's lifecycle doesn't support. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={(el) => { baseImgRefs.current[i] = el }}
                      src={srcs[indices[i]]}
                      alt={alt}
                      className="about-photo-layer"
                    />
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
