"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { TertiaryLink } from "@/components/ui/TertiaryLink"
import { FLOWERS } from "@/components/ui/flowers"
import { stagger, fadeUp } from "@/lib/motion"
import type { Song } from "@/lib/spotify"

type PanelSection = { id: string; label: string }

// Only these three sections sit beside the sticky panel — "My Playlist" and
// "Some Statistics" both live outside that grid entirely, so the panel
// scrolls away before either of them.
const panelSections: PanelSection[] = [
  { id: "journey",     label: "MY JOURNEY THUS FAR" },
  { id: "communities", label: "MY COMMUNITIES" },
  { id: "fun",         label: "WHAT I DO FOR FUN" },
]

type JourneyItem = { id: string; company: string; role: string; period: string }

const journeyItems: JourneyItem[] = [
  { id: "royal-bank-of-canada",     company: "Royal Bank of Canada",               role: "Software Engineering Intern", period: "NOW" },
  { id: "framer",                   company: "Framer",                             role: "Campus Ambassador",           period: "NOW" },
  { id: "hack-western",             company: "Hack Western",                       role: "Design Lead",                 period: "NOW" },
  { id: "cibc",                     company: "Canadian Imperial Bank of Commerce", role: "Software Engineering Intern", period: "2025" },
  { id: "western-founders-network", company: "Western Founders Network",           role: "Vice President of Design",    period: "2025" },
  { id: "the-residency",            company: "The Residency",                      role: "Design Lead",                 period: "2024" },
  { id: "autumn",                   company: "Autumn",                             role: "Product Design Intern",       period: "2024" },
]

type Community = {
  id: string
  name: string
  description: string
  logo: string
  href: string
  // Interchangeable — swap for any other icon asset per item.
  icon: string
}

const communities: Community[] = [
  {
    id: "comm-product-design-sprint",
    name: "Product Design Sprint",
    description: "Western University's first and largest design-a-thon",
    logo: "/images/communities/pds-icon.svg",
    href: "https://instagram.com/westernfoundersnetwork/",
    icon: "/icons/instagram.svg",
  },
  {
    id: "comm-hack-western",
    name: "Hack Western",
    description: "Western University's hackathon",
    logo: "/images/communities/hackwestern-icon.svg",
    href: "https://hackwestern.com",
    icon: "/icons/arrow-right-up-line.svg",
  },
  {
    id: "comm-framer",
    name: "Framer",
    description: "I'm a campus ambassador for Framer, xyz xyz xyz.",
    logo: "/images/communities/framer-icon.png",
    href: "https://framer.com/",
    icon: "/icons/arrow-right-up-line.svg",
  },
  {
    id: "comm-ivey-product-society",
    name: "Ivey Product Society",
    description: "Building the next generation of product leaders @ Ivey Business School",
    logo: "/images/communities/ips-icon.svg",
    href: "https://instagram.com/iveyproductsociety_",
    icon: "/icons/instagram.svg",
  },
]

// Used when the live Spotify fetch fails or returns nothing.
const FALLBACK_PLAYLIST: Song[] = [
  { id: "song-flash-in-the-pan", title: "Flash in the Pan", artist: "Jane Remover",          art: "", href: "#" },
  { id: "song-music-baby",       title: "Music Baby",        artist: "Jane Remover",          art: "", href: "#" },
  { id: "song-dustcutter-1",     title: "DUSTCUTTER",        artist: "Quadeca",               art: "", href: "#" },
  { id: "song-claws",            title: "claws",             artist: "Charli xcx",            art: "", href: "#" },
  { id: "song-the-peace",        title: "The Peace",         artist: "Underscores",           art: "", href: "#" },
  { id: "song-carpet",           title: "Carpet",             artist: "kmoe",                  art: "", href: "#" },
  { id: "song-believe",          title: "Believe",           artist: "Venturing",             art: "", href: "#" },
  { id: "song-constantly",       title: "CONSTANTLY",        artist: "Tiffany Day, slayr",     art: "", href: "#" },
  { id: "song-dustcutter-2",     title: "DUSTCUTTER",        artist: "Quadeca",               art: "", href: "#" },
]

function ArrowUpRight() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        position: "relative",
        top: 2,
        width: 16,
        height: 16,
        WebkitMaskImage: "url(/icons/arrow-right-up-line.svg)",
        maskImage: "url(/icons/arrow-right-up-line.svg)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        backgroundColor: "currentColor",
      }}
    />
  )
}

function SectionHeader({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="font-mono text-sm uppercase leading-[1.2] text-neutral-400">{label}</h2>
      {action}
    </div>
  )
}

function PlaceholderBox({ className }: { className?: string }) {
  return (
    <div className={`flex items-center rounded-2xl border border-neutral-900 px-8 ${className ?? ""}`}>
      <p className="text-base font-bold text-red-600">CONTENT INSIDE (this is temp)</p>
    </div>
  )
  
}

function JourneyRow({
  item,
  onHover,
  onUnhover,
}: {
  item: JourneyItem
  onHover: () => void
  onUnhover: () => void
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      className="-mx-3 flex items-center justify-between gap-6 border-x border-x-transparent border-y border-y-transparent px-3 py-3 transition-colors duration-150 hover:cursor-help hover:border-y-neutral-900/3 hover:bg-neutral-75 hover:duration-0"
    >
      <div>
        <p className="text-base font-medium text-neutral-900">{item.company}</p>
        <p className="text-base text-neutral-500">{item.role}</p>
      </div>
      <span className="shrink-0 font-mono text-sm uppercase text-neutral-400">{item.period}</span>
    </div>
  )
}

function CommunityRow({
  item,
  onHover,
  onUnhover,
}: {
  item: Community
  onHover: () => void
  onUnhover: () => void
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      className="-mx-3 flex items-center justify-between gap-6 border-x border-x-transparent border-y border-y-transparent px-3 py-4 transition-colors duration-150 hover:cursor-help hover:border-y-neutral-900/3 hover:bg-neutral-75 hover:duration-0"
    >
      <div className="flex items-center gap-6">
        <div
          className="h-14 w-14 shrink-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${item.logo})` }}
        />
        <div>
          <p className="text-base font-medium text-neutral-900">{item.name}</p>
          <p className="text-base text-neutral-500">{item.description}</p>
        </div>
      </div>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.name}
        className="h-6 w-6 shrink-0 text-icon-social transition-colors duration-150 hover:text-nav-link-hover"
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 24,
            height: 24,
            WebkitMaskImage: `url(${item.icon})`,
            maskImage: `url(${item.icon})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            backgroundColor: "currentColor",
          }}
        />
      </a>
    </div>
  )
}

// Stand-in art tile: one of the 12 unused flowers (from the pre-redesign
// brand system), assigned per song. A subtle rotate/scale on hover rather
// than cycling or revealing a real photo — the flower itself is the artwork.
function SongArt({ flowerIdx, isHovered }: { flowerIdx: number; isHovered: boolean }) {
  const reduce = useReducedMotion()
  const FlowerComponent = FLOWERS[flowerIdx % FLOWERS.length].component

  return (
    <div className="relative h-15 w-15 shrink-0 overflow-hidden rounded-base border border-neutral-100 bg-neutral-100">
      <motion.div
        animate={reduce ? undefined : { rotate: isHovered ? 30 : 0 }}
        transition={reduce ? undefined : { duration: 0.2, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="h-[42%] w-[42%] [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
          <FlowerComponent />
        </div>
      </motion.div>
    </div>
  )
}

// Same hover language as JourneyRow/CommunityRow, since the sticky panel is
// out of view by the time this section scrolls in — the "hover shows related
// content elsewhere" distinction isn't perceivable here.
function SongRow({ item, flowerIdx }: { item: Song; flowerIdx: number }) {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group -mx-3 flex items-center justify-between gap-6 border-x border-x-transparent border-y border-y-transparent px-3 py-3 transition-colors duration-150 hover:border-y-neutral-900/3 hover:bg-neutral-75 hover:duration-0"
    >
      <div className="flex items-center gap-6">
        <SongArt flowerIdx={flowerIdx} isHovered={isHovered} />
        <div>
          <p className="text-base font-medium text-neutral-900">{item.title}</p>
          <p className="text-base text-neutral-500">{item.artist}</p>
        </div>
      </div>
      <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm text-neutral-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        Play on Spotify
        <ArrowUpRight />
      </span>
    </a>
  )
}

export function AboutContent({ spotifyPlaylist }: { spotifyPlaylist: Song[] | null }) {
  const playlist = spotifyPlaylist?.length ? spotifyPlaylist : FALLBACK_PLAYLIST
  const reduce = useReducedMotion()
  const [activeId, setActiveId] = useState<string>("")
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    )
    panelSections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const displayId = hoveredId ?? activeId
  const trigger = hoveredId ? "hover" : "scroll"
  const panelText = displayId
    ? `Active: ${displayId} (${trigger})`
    : "Hover to find out more…"

  return (
    <div className="container-main py-9">
      <div className="grid grid-cols-1 gap-x-[54px] lg:grid-cols-[586px_1fr]">
        {/* Left column — sections 1-4 */}
        <div className="flex flex-col gap-20">
          <motion.section
            id="journey"
            variants={stagger}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <SectionHeader
                label="MY JOURNEY THUS FAR"
                action={
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-nav-link-hover transition-colors duration-150"
                  >
                    View resume
                    <ArrowUpRight />
                  </a>
                }
              />
            </motion.div>
            <div className="flex flex-col gap-0">
              {journeyItems.map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <JourneyRow
                    item={item}
                    onHover={() => setHoveredId(item.id)}
                    onUnhover={() => setHoveredId(null)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="communities"
            variants={stagger}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <SectionHeader label="MY COMMUNITIES" />
            </motion.div>
            <div className="flex flex-col">
              {communities.map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <CommunityRow
                    item={item}
                    onHover={() => setHoveredId(item.id)}
                    onUnhover={() => setHoveredId(null)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="fun"
            onMouseEnter={() => setHoveredId("fun")}
            onMouseLeave={() => setHoveredId(null)}
            variants={stagger}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <SectionHeader label="WHAT I DO FOR FUN" />
            </motion.div>
            <div className="flex flex-col gap-8 text-base leading-relaxed text-neutral-900">
              <motion.p variants={fadeUp}>
                I love making music. I sing and produce my own songs (jossici on
                all platforms), and I&rsquo;m on a{" "}
                <TertiaryLink
                  href="https://www.instagram.com/repercussionsacappella/"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={{ type: "custom", src: "/icons/instagram.svg" }}
                >
                  varsity a cappella team
                </TertiaryLink>
                .
              </motion.p>

              <motion.p variants={fadeUp}>
                I&rsquo;ve taken a liking to bouldering because of the colourful
                things on the wall.
              </motion.p>

              <motion.p variants={fadeUp}>
                I love exploring creative ways to make technology beautiful.
                Check out some of my projects in{" "}
                <TertiaryLink
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={{ type: "favicon" }}
                >
                  my playground
                </TertiaryLink>
                .
              </motion.p>

              <motion.p variants={fadeUp}>
                Check out a more comprehensive list of{" "}
                <TertiaryLink
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={{ type: "favicon" }}
                >
                  the things I like
                </TertiaryLink>
                .
              </motion.p>

              <motion.p variants={fadeUp}>
                I find it humbling and grounding and awe-inspiring to learn
                about our place in the universe, the little speck of dust we
                are. And so I love learning about constellations and all the
                things one sees when looking up at the sky at night.
              </motion.p>
            </div>
          </motion.section>
        </div>

        {/* Right column — sticky panel, scoped to the grid row above (ends after "My Playlist") */}
        <div className="relative mt-16 hidden lg:mt-0 lg:block">
          <div
            className="sticky flex min-h-[70vh] flex-col rounded-2xl border border-neutral-900/3 bg-neutral-75 p-9 "  // could add this shadow: shadow-[0_0_30px_-10px_rgba(22,25,29,0.08)]
            style={{ top: "calc(var(--nav-height) + 20px)" }}
          >
            {reduce ? (
              <p className="font-sans text-base text-neutral-300 font-medium">{panelText}</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.p
                  key={panelText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-sans text-base text-neutral-300"
                >
                  {panelText}
                </motion.p>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Playlist — outside the two-column grid; renders full width once the
          sticky panel's container (above) has scrolled out of the way. */}
      <motion.section
        id="playlist"
        className="mt-20"
        variants={stagger}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUp}>
          <SectionHeader label="MY PLAYLIST" />
          <p className="mb-8 text-base text-neutral-900">
            Based off my Spotify&rsquo;s most played songs in the past 6 months.
          </p>
        </motion.div>
        <div className="grid grid-flow-col grid-rows-3 gap-x-16 gap-y-6">
          {playlist.map((item, index) => (
            <motion.div key={item.id} variants={fadeUp}>
              <SongRow item={item} flowerIdx={index} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Statistics — outside the two-column grid; renders full width once the
          sticky panel's container (above) has scrolled out of the way. */}
      {/* <motion.section
        id="stats"
        className="mt-20"
        variants={stagger}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUp}>
          <SectionHeader label="SOME STATISTICS" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <PlaceholderBox className="h-[135px] w-full" />
        </motion.div>
      </motion.section> */}
    </div>
  )
}
