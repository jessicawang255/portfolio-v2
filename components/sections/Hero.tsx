"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion"
import { stagger, fadeUp } from "@/lib/motion"
import { IconButton } from "@/components/ui/IconButton"
import { TertiaryLink } from "@/components/ui/TertiaryLink"
import { FLOWERS, Flower, flowerSwap, flowerSwapReduced } from "@/components/ui/flowers"

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jwang255/", icon: "/icons/linkedin.svg" },
  { label: "X",        href: "https://x.com/jossici", icon: "/icons/x.svg" },
  { label: "Copy Email",    href: "mailto:jessica.wang255@gmail.com", icon: "/icons/mail.svg", copyText: "jessica.wang255@gmail.com", mobileCopiedTooltip: true },
  { label: "GitHub",   href: "https://github.com/jessicawang255", icon: "/icons/github.svg" },
]

function Underlined({ children }: { children: React.ReactNode }) {
  return (
    <span className="underline decoration-dotted decoration-[#898E94] underline-offset-[0.16em] [text-decoration-thickness:6%]">
      {children}
    </span>
  )
}

function randomOtherIdx(current: number) {
  const next = Math.floor(Math.random() * (FLOWERS.length - 1))
  return next >= current ? next + 1 : next
}

// Inline flower glyph sized relative to the heading, bottom on the baseline.
// Clicking swaps it for a random different flower. Hovering it presses it in
// slightly; hovering its word (`turned`) turns it like the About playlist art.
function InlineFlower({ initialIdx, dimmed = false, turned = false }: { initialIdx: number; dimmed?: boolean; turned?: boolean }) {
  const reduce = useReducedMotion()
  const [idx, setIdx] = useState(initialIdx)
  const [isHovered, setIsHovered] = useState(false)

  // Locked after a click until the cursor leaves, so the new flower doesn't
  // immediately inherit the hover state.
  const hoverLocked = useRef(false)

  const handleMouseEnter = useCallback(() => {
    if (hoverLocked.current) return
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    hoverLocked.current = false
    setIsHovered(false)
  }, [])

  const handleClick = useCallback(() => {
    hoverLocked.current = true
    setIsHovered(false)
    setIdx(randomOtherIdx)
  }, [])

  return (
    <button
      type="button"
      aria-label="Change flower"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block size-[0.6em] cursor-pointer align-baseline transition-opacity duration-200 ${dimmed ? "opacity-40" : ""}`}
    >
      <motion.span
        animate={reduce ? undefined : { rotate: turned ? 30 : 0, scale: isHovered ? 0.9 : 1 }}
        transition={reduce ? undefined : { duration: 0.2, ease: "easeOut" }}
        className="absolute inset-0 will-change-transform"
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.span
            key={idx}
            variants={reduce ? flowerSwapReduced : flowerSwap}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0"
          >
            <Flower idx={idx} />
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  )
}

// 64px assets (a 48px tile plus room for its baked-in drop shadow), drawn
// at 17/24 size for a 34px tile. Offsets are from the word's center, in em so
// the fan scales with the heading; from* is where each tile rises from,
// scattered along the word's upper half.
const communityTiles = [
  { src: "/images/hero/community/pds.svg",         x: -2.05, y: -0.6,  rotate: -9, fromX: -1.8,  fromY: -0.3 },
  { src: "/images/hero/community/hackwestern.svg", x: -0.7,  y: -0.78, rotate: -4, fromX: -0.6,  fromY: -0.4 },
  { src: "/images/hero/community/ips.svg",         x: 0.7,   y: -0.75, rotate: 5,  fromX: 0.65,  fromY: -0.38 },
  { src: "/images/hero/community/framer.png",      x: 2.0,   y: -0.62, rotate: 10, fromX: 1.75,  fromY: -0.32 },
]

type Tile = (typeof communityTiles)[number]

// Tiles stay mounted (just hidden) so their images are loaded before the
// first hover.
// Hover words always set their own color rather than inheriting the heading's:
// on unhover the heading is still fading back from neutral-300, and an
// inherited color would flash light before catching up.
type HoverWordProps = { dimmed: boolean; onActiveChange: (active: boolean) => void }

function CommunityWord({ active, dimmed, onActiveChange }: HoverWordProps & { active: boolean }) {
  const reduce = useReducedMotion()

  const variants: Variants = {
    hidden: (t: Tile) => ({
      x: `${reduce ? t.x : t.fromX}em`,
      y: `${reduce ? t.y : t.fromY}em`,
      rotate: reduce ? t.rotate : 0,
      scale: reduce ? 1 : 0.4,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    }),
    shown: (t: Tile) => ({
      x: `${t.x}em`,
      y: `${t.y}em`,
      rotate: t.rotate,
      scale: 1,
      opacity: 1,
      transition: reduce
        ? { duration: 0.15 }
        : { type: "spring", duration: 0.6, bounce: 0.4 },
    }),
  }

  return (
    <span
      className={`relative cursor-help transition-colors duration-200 ${dimmed ? "text-neutral-300" : "text-neutral-900"}`}
      onMouseEnter={() => onActiveChange(true)}
      onMouseLeave={() => onActiveChange(false)}
    >
      {/* Tiles sit at z-[2], over the word's z-[1], so the part of each tile
          that overlaps the word still gets its hover. */}
      <span className="relative z-[1]">
        <Underlined>community</Underlined>
      </span>
      <span aria-hidden="true" className={active ? "" : "pointer-events-none"}>
        {/* Covers the fan's footprint so the cursor can travel from the word
            up to a tile, across the gaps between tiles, without the hover
            ending. */}
        <span className="absolute top-[calc(50%-0.78em-28px)] right-[calc(50%-2em-28px)] bottom-1/2 left-[calc(50%-2.05em-28px)] z-0" />
        {communityTiles.map((tile) => (
          <motion.span
            key={tile.src}
            custom={tile}
            variants={variants}
            initial="hidden"
            animate={active ? "shown" : "hidden"}
            whileHover={reduce ? undefined : { scale: 0.92, transition: { duration: 0.2, ease: "easeOut" } }}
            className="absolute top-1/2 left-1/2 z-[2] -mt-[22.67px] -ml-[22.67px] size-[45.33px] bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${tile.src})` }}
          />
        ))}
      </span>
    </span>
  )
}

type Confetto = {
  id: number
  flower: number
  left: string
  size: string
  duration: number
  x: string[]
  y: string[]
  rotate: number[]
  scale: number[]
  opacity: number[]
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

// One burst of mini flowers, each launched from a random point along the word
// and sampled as a projectile under gravity. Units are em so the arc scales
// with the heading.
function makeBurst(nextId: () => number): Confetto[] {
  const steps = 14
  const gravity = 29
  return Array.from({ length: 16 }, (_, i) => {
    const duration = rand(1.1, 1.6)
    const vx = rand(-5.8, 5.8)
    const vy = rand(-13.7, -8.9)
    const spin = rand(-360, 360)
    const frames = Array.from({ length: steps + 1 }, (_, k) => k / steps)
    return {
      id: nextId(),
      flower: i % FLOWERS.length,
      left: `${rand(10, 90)}%`,
      size: `${rand(0.28, 0.46)}em`,
      duration,
      x: frames.map((p) => `${vx * p * duration}em`),
      y: frames.map((p) => `${vy * p * duration + 0.5 * gravity * (p * duration) ** 2}em`),
      rotate: frames.map((p) => spin * p * duration),
      scale: frames.map((p) => Math.min(1, p * 6)),
      opacity: frames.map((p) => (p > 0.75 ? 1 - (p - 0.75) / 0.25 : 1)),
    }
  })
}

// Flower confetti on hover. A short cooldown stops cursor jitter at the
// word's edge from firing burst after burst; reduced motion skips it.
function DelightWord({ dimmed, onActiveChange }: HoverWordProps) {
  const reduce = useReducedMotion()
  const [confetti, setConfetti] = useState<Confetto[]>([])
  const lastBurst = useRef(0)
  const idCounter = useRef(0)

  const handleMouseEnter = () => {
    onActiveChange(true)
    const now = performance.now()
    if (reduce || now - lastBurst.current < 500) return
    lastBurst.current = now
    const burst = makeBurst(() => idCounter.current++)
    setConfetti((prev) => [...prev, ...burst])
  }

  const remove = (id: number) => setConfetti((prev) => prev.filter((c) => c.id !== id))

  return (
    <span
      className={`relative cursor-help transition-colors duration-200 ${dimmed ? "text-neutral-300" : "text-neutral-900"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => onActiveChange(false)}
    >
      <Underlined>delight</Underlined>
      <span aria-hidden="true" className="pointer-events-none">
        {confetti.map((c) => {
          return (
            <motion.span
              key={c.id}
              className="absolute top-[0.3em] z-[2]"
              style={{ left: c.left, width: c.size, height: c.size, marginLeft: `calc(${c.size} / -2)` }}
              initial={{ x: c.x[0], y: c.y[0], rotate: 0, scale: 0, opacity: 1 }}
              animate={{ x: c.x, y: c.y, rotate: c.rotate, scale: c.scale, opacity: c.opacity }}
              transition={{ duration: c.duration, ease: "linear" }}
              onAnimationComplete={() => remove(c.id)}
            >
              <Flower idx={c.flower} />
            </motion.span>
          )
        })}
      </span>
    </span>
  )
}

type HighlightRect = { left: number; top: number; width: number; height: number }

// The heading's tight line-height is shorter than the font's content area,
// so native selection boxes overlap the line above and paint over its
// descenders. Instead, the native highlight is made transparent and these
// rects — each text fragment's box, resized to the line box and drawn
// behind the text — tile cleanly line to line.
function useLineBoxSelection(ref: React.RefObject<HTMLElement | null>) {
  const [rects, setRects] = useState<HighlightRect[]>([])

  useEffect(() => {
    function update() {
      const el = ref.current
      const sel = document.getSelection()
      if (!el || !sel || sel.isCollapsed) return setRects([])

      const box = el.getBoundingClientRect()
      // Undo any scale transform on an ancestor (HeroShell).
      const scale = box.width / el.offsetWidth || 1
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
      const next: HighlightRect[] = []

      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        for (let i = 0; i < sel.rangeCount; i++) {
          const range = sel.getRangeAt(i)
          if (!range.intersectsNode(node)) continue
          const sub = document.createRange()
          sub.selectNodeContents(node)
          if (range.startContainer === node) sub.setStart(node, range.startOffset)
          if (range.endContainer === node) sub.setEnd(node, range.endOffset)
          for (const r of sub.getClientRects()) {
            if (r.width === 0) continue
            const centerY = (r.top + r.bottom) / 2
            next.push({
              left: (r.left - box.left) / scale,
              top: (centerY - box.top) / scale - lineHeight / 2,
              width: r.width / scale,
              height: lineHeight,
            })
          }
        }
      }
      setRects(next)
    }

    document.addEventListener("selectionchange", update)
    window.addEventListener("resize", update)
    return () => {
      document.removeEventListener("selectionchange", update)
      window.removeEventListener("resize", update)
    }
  }, [ref])

  return rects
}

export function Hero() {
  const reduce = useReducedMotion()
  // Hovering a highlighted word fades the rest of the heading back.
  const [activeWord, setActiveWord] = useState<"community" | "delight" | null>(null)
  const setWordActive = (word: "community" | "delight") => (active: boolean) =>
    setActiveWord(active ? word : null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const selectionRects = useLineBoxSelection(headingRef)

  return (
    <section
      // pt switches at `sm` (nav-clearance breakpoint, once the fixed top bar
      // appears); pb switches at `md` (content-shape breakpoint).
      className="container-main pointer-events-none pt-16 pb-10 sm:pt-[180px] md:pb-12"
      aria-label="Introduction"
    >
      <motion.div
        variants={stagger}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
        className="pointer-events-auto relative z-[1] flex flex-col gap-9 md:flex-row md:items-end md:justify-between"
      >
        <div className="text-glow w-fit">
          <motion.h1
            ref={headingRef}
            variants={fadeUp}
            className={`text-glow-item selection:bg-transparent! font-medium transition-colors duration-200 ${activeWord ? "text-neutral-300" : "text-neutral-900"} text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.015em]`}
          >
            Jessica is a technical product designer<br className="hidden md:inline" />{" "}
            who creates experiences that<br className="hidden md:inline" />{" "}
            foster <CommunityWord active={activeWord === "community"} dimmed={activeWord === "delight"} onActiveChange={setWordActive("community")} />{" "}
            <InlineFlower initialIdx={0} dimmed={activeWord === "delight"} turned={activeWord === "community"} /> and{" "}
            <DelightWord dimmed={activeWord === "community"} onActiveChange={setWordActive("delight")} />{" "}
            <InlineFlower initialIdx={9} dimmed={activeWord === "community"} turned={activeWord === "delight"} />
            {selectionRects.map((r, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="pointer-events-none absolute -z-10 bg-[#E8F3FC]"
                style={r}
              />
            ))}
          </motion.h1>
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <div className="text-glow w-fit">
            <motion.p
              variants={fadeUp}
              className="text-glow-item max-w-xs text-balance font-normal text-neutral-600 text-lg leading-snug md:text-right"
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
        </div>
      </motion.div>
    </section>
  )
}
