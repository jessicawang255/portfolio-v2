"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { TertiaryLink } from "@/components/ui/TertiaryLink"
import { IconButton } from "@/components/ui/IconButton"
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
    icon: "/icons/global-line.svg",
  },
  {
    id: "comm-framer",
    name: "Framer",
    description: "A no-code tool for beautiful websites",
    logo: "/images/communities/framer-icon.png",
    href: "https://framer.com/",
    icon: "/icons/global-line.svg",
  },
  {
    id: "comm-ivey-product-society",
    name: "Ivey Product Society",
    description: "A community of product leaders at Ivey Business School",
    logo: "/images/communities/ips-icon.svg",
    href: "https://instagram.com/iveyproductsociety_",
    icon: "/icons/instagram.svg",
  },
]

// Rich content shown in the sticky panel when a journey/community row is
// hovered. Keyed by the row's id. Rows without an entry fall back to the
// plain "Active: {id}" panel text.
type PanelTextBlock =
  | { type: "p"; text: string }
  | { type: "bullets"; items: string[] }

// Same src-as-discriminant pattern as components/cs/ImageBlock.tsx: omit
// src/alt to render an aspect-ratio placeholder, or supply both for the real
// photo. Files live at public/images/about/{row-id}/{row-id}-{n}.{jpg,png},
// numbered by position in the entry's images array (e.g. hack-western-1.jpg).
type PanelImage =
  | { caption?: string; aspect: string; width?: string; src: string; alt: string; objectPosition?: string }
  | { caption?: string; aspect: string; width?: string; src?: undefined; alt?: never; objectPosition?: string }

type PanelEntry = { blocks: PanelTextBlock[]; images: PanelImage[] }

const panelContent: Record<string, PanelEntry> = {
  "royal-bank-of-canada": {
    blocks: [
      {
        type: "p",
        text: "Summer 2026, I interned at RBC as part of their Amplify program — a specialized internship where you're \
        paired into small teams to design and build a solution for a real business challenge. We got to do it all: from \
        understanding the problem space, interviewing stakeholders across the bank, to ideating on solutions, designing,\
         developing, deploying, and presenting our work to senior leaders.",
      },
      {
        type: "p",
        text: "My team built a blockchain-based foreign exchange \
         tool that explores how RBC could offer foreign exchange between tokenized deposits in the (near) future. As a developer, \
         I was hands-on with coding smart contracts on Ethereum (something I never would have pictured myself doing!), and I learned \
         so, so much about foreign exchange and the world of digital assets, stablecoins, and blockchain. It was a really fun summer!",
      },
    ],
    images: [
      {
        caption:
          "My challenge spanned two teams: Global Payments Technology and the Digital Asset Innovation team within RBCx, RBC's in-house innovation arm.",
        aspect: "8/2",
        src: "/images/about/royal-bank-of-canada/rbc-1.svg",
        alt: "RBC Amplify program",
      },
    ],
  },
  framer: {
    blocks: [
      {
        type: "p",
        text: "I'm a campus ambassador for Framer, where I teach students how to create their own websites and build a community for Framer \
        lovers. My co-ambassador Adia and I have run workshops, design-a-thons, and provided a lot of bubble tea along the way!",
      },
    ],
    images: [
      { 
        caption: "Presenting a Framer 101 workshop",
        aspect: "3/2",
        src: "/images/about/framer/framer-1.png",
        alt: "Framer 101 workshop",
      },
      { 
        caption: "A selfie with our community (ft. bubble tea!)",
        aspect: "4/5",
        src: "/images/about/framer/framer-2.png",
        alt: "Framer community selfie",},
    ],
  },
  "hack-western": {
    blocks: [
      {
        type: "p",
        text: "I'm lucky to be leading an amazing team of designers at Hack Western, a student-run hackathon at Western University, \
        where we design everything from the website and application portal to merch and everything in between!",
      },
    ],
    images: [
      { 
        caption: "The organizer team",
        aspect: "318/214",
        src: "/images/about/hack-western/hw-1.png",
        alt: "Hack Western organizer team",},
      { 
        caption: "A collaborative canvas made during the event",
        aspect: "350/237",
        width: "90%",
        src: "/images/about/hack-western/hw-2.png",
        alt: "Hack Western collaborative canvas",},
      { 
        caption: "Hack Western 12 merch designs",
        aspect: "318/238",
        src: "/images/about/hack-western/hw-3.png",
        alt: "Hack Western 12 merch designs",},
      {
        caption: "This was a secret, but... I was one of the horses",
        aspect: "214/254",
        width: "60%",
        src: "/images/about/hack-western/hw-4.png",
        alt: "Hack Western 12 horse mascot",},
    ],
  },
  cibc: {
    blocks: [
      {
        type: "p",
        text: "I was a software engineering intern at CIBC in Summer 2025. I worked on a project to modernize marketing \
        for their card products by building custom offers for each client instead of matching clients to offers that already \
        existed. I built ETL pipelines that enabled real-time client data to feed the offer engine.",
      },
      {
        type: "p",
        text: "This was my first time working on a project with this scale and impact, and I got to learn the inner workings of \
        how a big team operates: project management, QA, and all the steps it takes to make code production-ready.",
      },
    ],
    images: [
      {
        aspect: "8/2",
        src: "/images/about/cibc/cibc-1.svg",
        alt: "CIBC logo",
      },
    ],
  },
  "western-founders-network": {
    blocks: [
      {
        type: "p",
        text: "From 2023-2025, I was a part of the design team on Western Founders Network, a community for students \
        passionate about tech, business, and entrepreneurship. We ran Product Design Sprint: the biggest \
        (and at the time, only!) design-a-thon at Western University.",
      },
    ],
    images: [
      { 
        caption: "The team behind Product Design Sprint",
        aspect: "318/178",
        src: "/images/about/western-founders-network/wfn-1.png",
        alt: "Product Design Sprint team photo",
      },
      { 
        caption: "WFN Design <3", 
        aspect: "350/232",
        src: "/images/about/western-founders-network/wfn-2.png",
        alt: "Western Founders Network design team photo",
      },
    ],
  },
  "the-residency": {
    blocks: [
      {
        type: "p",
        text: "The Residency is a hacker house for ambitious founders and builders. In 2024, I was the lead designer \
        on all assets and led the new brand identity. I'm grateful I got to meet so many people building cool things along the way!",
      },
    ],
    images: [
      { 
        caption: "The Residency's marble-meets-tech theme", 
        aspect: "230/260",
        src: "/images/about/the-residency/residency-1.png",
        alt: "The Residency hacker house",
      },
      { caption: "Some event graphic design I designed for The Residency",
        aspect: "328/226",
        src: "/images/about/the-residency/residency-2.png",
        alt: "The Residency event graphic design",
      },
    ],
  },
  autumn: {
    blocks: [
      { type: "p", text: "Autumn is an end-of-life marketplace that connects people with end-of-life service providers to help \
        them navigate bereavement. During my internship, I designed a library resource to engage users earlier and more frequently." },
      {
        type: "p",
        text: "Along the way, I got a taste of what it's like to work at an early-stage startup: being scrappy, wearing multiple \
        hats, and thinking through growth strategies firsthand.",
      },
    ],
    images: [{ 
      aspect: "8/2",
      src: "/images/about/autumn/autumn-1.svg",
      alt: "Autumn logo",
    }],
  },
  "comm-ivey-product-society": {
    blocks: [
      {
        type: "p",
        text: "The Ivey Product Society is a product management community that aims to build the next generation of product leaders \
        at Western University. As an executive on the team, I helped organize the 2026 cohort of our flagship Product Management \
        Fellowship. Throughout the fellowship, students receive weekly mentorship, attend workshops on core PM skills, and create \
        a capstone project to design and build a feature for an existing product, presenting their work to industry judges at the end.",
      },
    ],
    images: [
      { 
        caption: "The 2025/6 Ivey Product Society team <3",
        aspect: "334/358",
        src: "/images/about/ivey-product-society/ips-1.png",
        width: "40%",
        alt: "Ivey Product Society team photo",},
    ],
  },
}

// Communities that overlap with a journey row share that row's panel
// content rather than duplicating it.
panelContent["comm-product-design-sprint"] = panelContent["western-founders-network"]
panelContent["comm-hack-western"] = panelContent["hack-western"]
panelContent["comm-framer"] = panelContent["framer"]

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

// Identifies the destination platform (like CommunityRow's per-item icon)
// rather than a generic "leaves the site" arrow — SongRow always links out
// to Spotify, so the icon itself carries that information now that the
// "Play on Spotify" label is gone.
function SpotifyIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: 24,
        height: 24,
        WebkitMaskImage: "url(/icons/spotify.svg)",
        maskImage: "url(/icons/spotify.svg)",
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
      {/* font-normal — see CaseStudies.tsx's identical eyebrow for why:
          the bare `h2` selector in globals.css defaults to the 500
          sub-heading weight, which this label was never meant to be. */}
      <h2 className="font-mono text-sm font-normal uppercase leading-[1.2] text-neutral-400">{label}</h2>
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

// 2px radius per spec. Renders the real photo once src/alt are set on the
// PanelImage entry, otherwise falls back to an aspect-ratio placeholder.
// `objectPosition` overrides the crop anchor (default center) for photos
// where the box's aspect ratio is wider than the source, so cropping the
// overflow happens on one side only (e.g. "top" to keep a subject's head
// framed instead of centering the crop).
function AboutPanelImage({ caption, aspect, width, src, alt, objectPosition }: PanelImage) {
  return (
    <div style={{ width: width ?? "100%" }}>
      {src ? (
        <div
          className="relative overflow-hidden rounded-[2px] border border-neutral-100 bg-neutral-100"
          style={{ aspectRatio: aspect }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            className="object-cover"
            style={objectPosition ? { objectPosition } : undefined}
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center rounded-[2px] border border-neutral-100 bg-neutral-100"
          style={{ aspectRatio: aspect }}
        >
          <p className="px-3 text-center text-xs font-bold text-red-600">IMAGE (temp)</p>
        </div>
      )}
      {caption ? (
        <p className="mt-2 text-sm leading-[1.5] text-neutral-400 italic">{caption}</p>
      ) : null}
    </div>
  )
}

// Shown in the sticky panel while the "fun" section's content is hovered —
// same hover-triggered behavior as journey/communities, just keyed off the
// whole content block instead of individual rows (see the onMouseEnter wired
// up where this is used). Custom layout (shared caption spanning the first
// pair of photos) doesn't fit the generic masonry PanelContentView renders,
// so it's hand-built here instead of going through panelContent.
function FunPanelContent() {
  return (
    <div className="flex flex-col gap-9">
      <div>
        {/* Top-aligned, independent heights — the left photo is cropped
            shorter (389/493, anchored to the top) so its bottom edge sits
            above the right photo's rather than lining up with it. */}
        <div className="flex items-start gap-6">
          <div className="w-[29%] shrink-0">
            <AboutPanelImage
              aspect="389/455"
              src="/images/about/for-fun/jessica-reperc.png"
              alt="Performing a cappella onstage"
              objectPosition="top"
            />
          </div>
          <div className="flex-1">
            <AboutPanelImage
              aspect="3/2"
              src="/images/about/for-fun/reperc-team.jpeg"
              alt="Repercussions a cappella team"
            />
          </div>
        </div>
        <p className="mt-2 text-sm leading-[1.5] text-neutral-400 italic">
          Left: Performing at the 2025 International Championship of Collegiate A cappella (the exact competition in
          pitch perfect). Right: My a cappella team, Repercussions 💛
        </p>
      </div>

      <div className="flex gap-6">
        <div className="w-[63%] shrink-0">
          <AboutPanelImage aspect="5/3" caption="something" />
        </div>
        <div className="flex-1">
          <AboutPanelImage
            aspect="3/4"
            src="/images/about/for-fun/climbing-shoes.png"
            alt="My climbing shoes"
            caption="My climbing shoes"
          />
        </div>
      </div>
    </div>
  )
}

function PanelContentView({ entry }: { entry: PanelEntry }) {
  return (
    <div>
      <div className="flex flex-col gap-6 text-base leading-relaxed text-neutral-900">
        {entry.blocks.map((block, i) =>
          block.type === "p" ? (
            <p key={i}>{block.text}</p>
          ) : (
            <ul key={i} className="list-disc pl-5">
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )
        )}
      </div>
      {entry.images.length > 1 ? (
        <div className="mt-9 grid grid-cols-2 gap-x-6">
          {[0, 1].map((col) => (
            <div key={col} className="flex flex-col gap-y-9">
              {entry.images
                .map((img, i) => ({ img, i }))
                .filter(({ i }) => i % 2 === col)
                .map(({ img, i }) => (
                  <AboutPanelImage key={i} {...img} />
                ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-9">
          {entry.images.map((img, i) => (
            <AboutPanelImage key={i} {...img} />
          ))}
        </div>
      )}
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
      className="-mx-3 flex items-center justify-between gap-6 border-x border-x-transparent border-y border-y-transparent px-3 py-3 transition-colors duration-100 lg:hover:cursor-help lg:hover:border-y-neutral-900/3 lg:hover:bg-neutral-75 lg:hover:duration-0"
    >
      <div>
        <p className="text-balance text-base font-medium text-neutral-900">{item.company}</p>
        <p className="text-balance text-base text-neutral-500">{item.role}</p>
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
      className="group -mx-3 flex items-center justify-between gap-6 border-x border-x-transparent border-y border-y-transparent px-3 py-4 transition-colors duration-100 lg:hover:cursor-help lg:hover:border-y-neutral-900/3 lg:hover:bg-neutral-75 lg:hover:duration-0"
    >
      <div className="flex items-center gap-6">
        <div
          className="h-14 w-14 shrink-0 bg-contain bg-center bg-no-repeat transition-[scale] duration-200 lg:group-hover:scale-95"
          style={{ backgroundImage: `url(${item.logo})` }}
        />
        <div>
          <p className="text-balance text-base font-medium text-neutral-900">{item.name}</p>
          <p className="text-balance text-base text-neutral-500">{item.description}</p>
        </div>
      </div>
      <IconButton
        href={item.href}
        icon={item.icon}
        className="shrink-0"
      />
    </div>
  )
}

// Stand-in art tile: one of the 12 unused flowers (from the pre-redesign
// brand system), assigned per song. A subtle rotate/scale on hover rather
// than cycling or revealing a real photo — the flower itself is the artwork.
// Scale-down echoes MoreCaseStudies' thumbnail hover (scale-95).
function SongArt({ flowerIdx, isHovered }: { flowerIdx: number; isHovered: boolean }) {
  const reduce = useReducedMotion()
  const FlowerComponent = FLOWERS[flowerIdx % FLOWERS.length].component

  return (
    <div className="relative h-15 w-15 shrink-0 overflow-hidden rounded-base border border-neutral-100 bg-neutral-100 transition-[scale] duration-200 group-hover:scale-95">
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
          <p className="text-balance text-base font-medium text-neutral-900">{item.title}</p>
          <p className="text-balance text-base text-neutral-500">{item.artist}</p>
        </div>
      </div>
      {/* Hidden below the single-column breakpoint: reserving its width there
          would force the title to wrap, and touch/mobile has no hover to
          reveal it anyway. Icon-only (no "Play on Spotify" label) — the
          Spotify mark itself carries that information, same as CommunityRow's
          per-item platform icons (Instagram/website) rather than a generic
          external-link arrow. */}
      <span className="hidden shrink-0 items-center text-neutral-200 opacity-0 transition-opacity duration-150 min-[960px]:flex group-hover:opacity-100">
        {/* group/icon is scoped to just this icon (not the row's own
            `group`), so the tint/scale/tick and tooltip below only react to
            a hover precise enough to land on the 24px mark itself — same
            split, and the same hover treatment, as IconButton (hand-matched
            rather than nesting a real IconButton <a> inside this row's own
            <a>, which would be invalid HTML). */}
        <span
          className="group/icon relative inline-flex transition-[color,scale] duration-150 before:absolute before:inset-[-11px] before:content-[''] hover:scale-110 hover:text-nav-link-hover motion-safe:hover:animate-[icon-tick_var(--duration-slow)_var(--ease-out)]"
          aria-hidden="true"
        >
          <SpotifyIcon />
          <span
            className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden origin-bottom
            -translate-x-1/2 scale-90 whitespace-nowrap rounded-[var(--radius-sm)] bg-neutral-900/90
            px-1.5 py-0.5 text-xs text-neutral-50 opacity-0 transition-[opacity,scale] duration-[var(--duration-slow)]
            ease-[var(--ease-out)] group-hover/icon:scale-100 group-hover/icon:opacity-100 group-hover/icon:delay-400 md:block"
          >
            Spotify
          </span>
        </span>
      </span>
    </a>
  )
}

export function AboutContent({ spotifyPlaylist }: { spotifyPlaylist: Song[] | null }) {
  const playlist = spotifyPlaylist?.length ? spotifyPlaylist : FALLBACK_PLAYLIST
  const reduce = useReducedMotion()
  const [activeId, setActiveId] = useState<string>("")
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // A row's onMouseLeave doesn't clear hoveredId directly — it schedules a
  // clear a beat later, giving the cursor time to land on the sticky panel
  // in transit. Entering a row or the panel cancels that pending clear, so
  // content only actually disappears once the mouse has left both surfaces
  // without landing on the other.
  const unhoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelScheduledUnhover = () => {
    if (unhoverTimeoutRef.current !== null) {
      clearTimeout(unhoverTimeoutRef.current)
      unhoverTimeoutRef.current = null
    }
  }

  const handleRowHover = (id: string) => {
    cancelScheduledUnhover()
    setHoveredId(id)
  }

  const handleRowUnhover = () => {
    cancelScheduledUnhover()
    unhoverTimeoutRef.current = setTimeout(() => setHoveredId(null), 100)
  }

  useEffect(() => cancelScheduledUnhover, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: "-10% 0px -35% 0px", threshold: 0 }
    )
    panelSections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const displayId = hoveredId ?? activeId
  const panelText = "Hover on an item to learn more…"
  // Unlike journey/communities, "fun" has no hoverable rows to key off of —
  // the whole section's content div is the hover target (wired below) — so
  // this checks hoveredId directly rather than falling back to activeId.
  // Falling back would make the fun panel appear just from scrolling the
  // section into view, same as the old (undesired) behavior.
  const isFun = hoveredId === "fun"
  const panelEntry = displayId ? panelContent[displayId] : undefined
  const panelKey = isFun ? "entry-fun" : panelEntry ? `entry-${displayId}` : `text-${panelText}`

  return (
    <div className="container-main pt-9 pb-9">
      <div className="grid grid-cols-1 gap-x-[54px] lg:grid-cols-[minmax(0,min(586px,40%))_1fr]">
        {/* Left column — sections 1-4 */}
        {/* gap-20 flat at every breakpoint — matches Home's own section gap
            (see app/(home)/page.tsx), not a responsive step. */}
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
                  <IconButton
                    href="/JessicaWang_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    label="View resume"
                    icon="/icons/arrow-right-up-line.svg"
                  />
                }
              />
            </motion.div>
            <div className="flex flex-col gap-0">
              {journeyItems.map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <JourneyRow
                    item={item}
                    onHover={() => handleRowHover(item.id)}
                    onUnhover={handleRowUnhover}
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
                    onHover={() => handleRowHover(item.id)}
                    onUnhover={handleRowUnhover}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="fun"
            variants={stagger}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <SectionHeader label="WHAT I DO FOR FUN" />
            </motion.div>
            <div
              onMouseEnter={() => handleRowHover("fun")}
              onMouseLeave={handleRowUnhover}
              className="-mx-3 flex flex-col gap-6 border-x border-x-transparent border-y border-y-transparent px-3 py-3 text-base leading-relaxed text-neutral-900 transition-colors duration-100 lg:hover:cursor-help lg:hover:border-y-neutral-900/3 lg:hover:bg-neutral-75 lg:hover:duration-0"
            >
              <motion.p variants={fadeUp}>
                I love making music. I sing and produce my own songs (
                <TertiaryLink
                  href="https://open.spotify.com/artist/14rpUPUITbgY4OVymVMblx?si=WvlljoMNTyGfaptR14ONow"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={{ type: "favicon" }}
                >
                  jossici
                </TertiaryLink>{" "}
                on all platforms), and I&rsquo;m on a{" "}
                <TertiaryLink
                  href="https://www.instagram.com/repercussionsacappella/"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={{ type: "favicon" }}
                  className="ml-1"
                >
                  varsity a cappella team
                </TertiaryLink>
                .
              </motion.p>

              <motion.p variants={fadeUp}>
                I&rsquo;ve taken a liking to bouldering because of the colourful
                things on the wall.
              </motion.p>

              {/* <motion.p variants={fadeUp}>
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
              </motion.p> */}

              {/* <motion.p variants={fadeUp}>
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
              </motion.p> */}

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
            onMouseEnter={cancelScheduledUnhover}
            onMouseLeave={() => setHoveredId(null)}
            // Fills the viewport (minus the nav clearance the `top` offset already
            // eats into) rather than a fixed 83vh, so it reads as edge-to-edge on
            // any screen. The -16px keeps the bottom gap equal to the 36px top
            // offset (top eats nav-height - 20px, so height needs one more -16px
            // to leave a matching 36px at the bottom) — a symmetric frame rather
            // than a lopsided one. clamp() (not separate min-h/max-h) because the
            // viewport-fill value regularly exceeds the cap on ordinary screens —
            // with min-h + max-h, min-height wins that conflict per spec and the
            // cap never actually applies. Capped at 60rem (960px) — comfortably
            // above the tallest measured panel entry (~755px), so it only kicks
            // in on genuinely oversized screens; overflow-y-auto is the fallback
            // for anything that outgrows it regardless.
            className="sticky flex h-[clamp(0px,calc(100vh-var(--nav-height)-16px),60rem)] flex-col overflow-y-auto rounded-2xl border border-neutral-100 bg-neutral-75 p-9 shadow-[0_4px_20px_-6px_rgba(22,25,29,0.06)]"  // could add this shadow: shadow-[0_0_30px_-10px_rgba(22,25,29,0.08)]
            style={{ top: "calc(var(--nav-height) - 20px)" }}
          >
            {reduce ? (
              isFun ? (
                <FunPanelContent />
              ) : panelEntry ? (
                <PanelContentView entry={panelEntry} />
              ) : (
                <p className="font-sans text-base text-neutral-300 font-medium">{panelText}</p>
              )
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={panelKey}
                  initial={{ opacity: 0, filter: "blur(2px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(2px)" }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                >
                  {isFun ? (
                    <FunPanelContent />
                  ) : panelEntry ? (
                    <PanelContentView entry={panelEntry} />
                  ) : (
                    <p className="font-sans text-base text-neutral-300">{panelText}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Playlist — outside the two-column grid; renders full width once the
          sticky panel's container (above) has scrolled out of the way.
          mt-20 — matches the gap-20 used between the sections above (and on
          Home), not a separately-tuned value. */}
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
        {/* Column count steps down (3 → 2 → 1) before a row is narrow enough
            to force the title into conflict with the trailing icon —
            thresholds are measured against the longest current title, not
            arbitrary breakpoints. Re-measure if playlist content changes
            meaningfully (was previously measured against "Play on Spotify",
            now just the icon — may tolerate a narrower threshold, unverified). */}
        <div className="flex flex-col min-[960px]:grid min-[960px]:grid-flow-col min-[960px]:grid-cols-2 min-[960px]:grid-rows-5 min-[960px]:gap-x-12 min-[1360px]:grid-cols-3 min-[1360px]:grid-rows-3 min-[1360px]:gap-x-16">
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
