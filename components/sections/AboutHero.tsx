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

// Three structural tiers now — phone gets its own 2-up-plus-centered grid
// (see the row's own comment below for why that also makes each photo
// noticeably bigger, not just rearranged), tablet keeps the single fluid
// row, desktop is unchanged from the original design. `aspect-[W/H]` and
// `max-w-[Npx]` (each photo's own original desktop dimensions) apply at
// every tier below `about-photos` regardless of display mode — height
// always follows width, and growth never overshoots the real design size.
// What DOES change per tier is what actually drives the width in the first
// place: grid's own column-track stretch on phone (no flex-grow involved —
// grid ignores it entirely), `flex-[N]` weighted to that same original
// width from `sm` up (flex-grow only applies to a flex container's direct
// children, so it has to be re-declared once the row switches away from
// grid), and the fixed `about-photos:w-[Npx]` from the original design
// past that.
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
    className: "aspect-[220/222] max-w-[220px] sm:flex-[220] about-photos:flex-none about-photos:w-[220px] about-photos:h-[222px]",
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
    className: "aspect-[218/222] max-w-[218px] sm:flex-[218] about-photos:flex-none about-photos:w-[218px] about-photos:h-[222px]",
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
    // The one photo with its own per-tier layout properties, not just
    // sizing — `col-span-2 mx-auto w-full` puts it on its own centered row
    // in the phone grid (see the row's own comment below), all three reset
    // at `sm` where the row goes back to one flex line and this needs to
    // behave like photo-1/2 again. `sm:mx-0` specifically (not just
    // relying on `sm:flex-[280]`'s own basis:0% to out-rank a stray
    // `w-full`) — auto margins on a flex item consume free space *before*
    // flex-grow gets any of it, so left over from the grid tier, this
    // would quietly win the whole row's free space for itself instead of
    // growing in proportion with photo-1/2 the way `flex-[280]` intends.
    className: "col-span-2 mx-auto w-full aspect-[280/192] max-w-[280px] sm:mx-0 sm:w-auto sm:flex-[280] about-photos:flex-none about-photos:w-[280px] about-photos:h-[192px]",
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
      className="container-main pointer-events-none pt-16 pb-12 sm:pt-[120px] sm:pb-20"
      aria-label="About introduction"
    >
      <motion.div
        variants={stagger}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
        // Stacked (text above, photos below) from phone through tablet —
        // `about-photos` is the first width with room for both the text
        // column and the photo row's real desktop size side by side (see
        // that breakpoint's own comment in globals.css). Below it, `flex-col`
        // needs neither `items-start` nor `justify-between`: both only
        // matter for the row layout (top-aligning the two flex items instead
        // of one stretching to match the other's height, and pushing them to
        // opposite ends) — a column's single-file children don't need either.
        className="pointer-events-auto relative z-[1] flex flex-col gap-14 about-photos:flex-row about-photos:items-start about-photos:justify-between about-photos:gap-24"
      >
        {/* max-w-[800px] only matters once the row layout kicks in at
            `about-photos` — below that this is a full-width column child
            stacked above the photo row (see the row's own comment below),
            not competing with it for horizontal space, so it stays `w-full`
            all the way through the tablet tier instead of capping at 800px.
            Deliberately left shrinkable (no `shrink-0`) rather than pinned at
            800px: the photo row is `flex-none` (fixed size) and the parent's
            `gap-16` is a fixed minimum, so if this max-width is ever pushed
            past what the viewport has room for, flex-shrink is what keeps
            the photos on-screen — this column gives way (wrapping onto more
            lines) instead of shoving them past the container's right edge.
            `justify-between` on the parent still does the normal-case work:
            whenever this column doesn't need its full 800px, the leftover
            space becomes gap on top of that 64px minimum, keeping text
            left-aligned and photos right-aligned rather than them drifting
            toward the middle. At container-main's 1848px content-width
            ceiling (120rem minus its own padding) that leaves ~218px of
            breathing room before the 830px-wide photo row. */}
        <div className="flex w-full flex-col about-photos:max-w-[800px]">
          <motion.h1
            variants={fadeUp}
            className="mb-3 text-balance text-3xl font-medium text-neutral-900"
          >
            Let&rsquo;s get acquainted!
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-lg text-balance text-base font-normal text-neutral-700"
          >
            I&rsquo;m a creative, a problem-solver, and a maker who obsesses
            over details. I&rsquo;m driven by the idea that you can make
            something from nothing, whether that be products, songs, or
            communities.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-balance text-base font-normal text-neutral-700"
          >
            On any given day, you might find me producing music, climbing
            rocks, learning about the stars, or collecting design inspo on X.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 mb-9 max-w-lg text-balance text-base font-normal text-neutral-700"
          >
            Say hi, I&rsquo;d love to connect!
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-4">
            {socials.map(({ label, href, icon, copyText }) => (
              <IconButton key={label} href={href} label={label} icon={icon} copyText={copyText} />
            ))}
          </motion.div>
        </div>

        {/* Visible at every width (F-01: this used to be `hidden … sm:flex`,
            invisible below `sm` and clipped off-screen from `sm` up to
            ~1326px). A 2-column grid on phone, not a 3-across flex row —
            photo-1 and photo-2 fall into row one automatically (plain grid
            auto-placement), photo-3 spans both columns and centers itself
            on row two (see its own `col-span-2 mx-auto` above). The real
            point isn't the rearrangement, it's what it buys each photo:
            splitting the row's width across 2 items instead of 3 (2 gaps
            become 1 in row one, none at all for photo-3 alone in row two)
            means each one can grow noticeably larger before hitting its own
            `max-w-[Npx]` cap, at every phone width — not just a side effect
            of the wrap, the actual reason for it.
            `flex sm:` — back to one row from `sm` up, same fluid-grow
            single line as before (see the `photos` array above for why
            `flex-[N]` has to be re-declared there instead of carrying over).
            `w-full` gives that row real width to grow into — without it,
            it'd just shrink-wrap to content like it does at `about-photos`+
            — reverts to `w-auto` there for the same reason in reverse: side
            by side with the text column, it goes back to sizing off its
            now-fixed-size children instead of stretching into the column's
            leftover width. `pt-2` — nudging the row down to align with the
            text's own baseline — only makes sense once they're side by side too. */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-2 w-full items-center gap-4.5 sm:flex sm:gap-9 about-photos:w-auto about-photos:gap-14 about-photos:pt-2"
        >
          {photos.map(({ id, srcs, alt, rotate, className }, i) => (
            // The `flex-[N]`/`aspect-[…]`/`max-w-[…]` sizing lives here, not
            // on the button below — this motion.div, not its child, is the
            // row's actual flex item (flex-grow only ever applies to a flex
            // container's *direct* children), so putting it one level too
            // deep silently no-ops: the button would fall back to shrinking
            // to its own content's minimum instead of growing to fill the
            // row at all.
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
                {/* Image well, inset by the frame's 6px padding above — its own
                    rounded-2xl (16px) + the frame's 6px padding is what adds up
                    to the frame's rounded-[22px]. Needs its own `relative` since
                    .about-photo-layers is `position:absolute;inset:0` — without
                    this, it'd resolve against the padded button and bleed under
                    the frame padding instead of sitting inside this well. */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-100">
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
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
