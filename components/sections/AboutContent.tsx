"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { TertiaryLink } from "@/components/ui/TertiaryLink"

type PanelSection = { id: string; label: string }

// Only the first four sections sit beside the sticky panel — "Some Statistics"
// lives outside that grid entirely, so the panel scrolls away before it.
// "Playlist" is intentionally excluded from panel tracking (scroll or hover) —
// the panel just keeps showing "What I Do For Fun" while playlist is in view.
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
  logoBg: string
  href: string
  // Interchangeable — swap for any other icon asset per item.
  icon: string
}

const communities: Community[] = [
  {
    id: "comm-product-design-sprint",
    name: "Product Design Sprint",
    description: "Western University's first and largest design-a-thon",
    logo: "/images/communities/product-design-sprint.svg",
    logoBg: "#DCD6F7",
    href: "https://instagram.com/pds.uwo",
    icon: "/icons/instagram.svg",
  },
  {
    id: "comm-hack-western",
    name: "Hack Western",
    description: "Western University's hackathon",
    logo: "/images/communities/hack-western.svg",
    logoBg: "#F3F4F6",
    href: "https://hackwestern.com",
    icon: "/icons/link.svg",
  },
  {
    id: "comm-framer",
    name: "Framer",
    description: "I'm a campus ambassador for Framer, xyz xyz xyz.",
    logo: "/images/communities/framer.svg",
    logoBg: "#0A0A0A",
    href: "https://instagram.com/framer",
    icon: "/icons/instagram.svg",
  },
  {
    id: "comm-ivey-product-society",
    name: "Ivey Product Society",
    description: "Building the next generation of product leaders @ Ivey Business School",
    logo: "/images/communities/ivey-product-society.svg",
    logoBg: "#F9FAFB",
    href: "https://instagram.com/iveyproductsociety",
    icon: "/icons/instagram.svg",
  },
]

function ArrowUpRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 14L14 4M14 4H7M14 4V11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
      className="-mx-3 flex items-center justify-between gap-6 rounded-sm border border-transparent px-3 py-4 transition-colors duration-150 hover:cursor-help hover:border-neutral-900/3 hover:bg-neutral-75 hover:duration-0"
    >
      <div className="flex items-center gap-6">
        <div
          className="h-15 w-15 shrink-0 rounded-base bg-cover bg-center"
          style={{ backgroundImage: `url(${item.logo})`, backgroundColor: item.logoBg }}
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
        className="h-6 w-6 shrink-0 text-icon-social transition-colors duration-150 hover:text-accent"
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

export function AboutContent() {
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
          <section id="journey">
            <SectionHeader
              label="MY JOURNEY THUS FAR"
              action={
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-primary transition-colors duration-150"
                >
                  View resume
                  <span className="text-neutral-400">
                    <ArrowUpRight />
                  </span>
                </a>
              }
            />
            <div className="flex flex-col gap-0">
              {journeyItems.map((item) => (
                <JourneyRow
                  key={item.id}
                  item={item}
                  onHover={() => setHoveredId(item.id)}
                  onUnhover={() => setHoveredId(null)}
                />
              ))}
            </div>
          </section>

          <section id="communities">
            <SectionHeader label="MY COMMUNITIES" />
            <div className="flex flex-col">
              {communities.map((item) => (
                <CommunityRow
                  key={item.id}
                  item={item}
                  onHover={() => setHoveredId(item.id)}
                  onUnhover={() => setHoveredId(null)}
                />
              ))}
            </div>
          </section>

          <section
            id="fun"
            onMouseEnter={() => setHoveredId("fun")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <SectionHeader label="WHAT I DO FOR FUN" />
            <div className="flex flex-col gap-8 text-base leading-relaxed text-neutral-900">
              <p>
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
              </p>

              <p>
                I&rsquo;ve taken a liking to bouldering because of the colourful
                things on the wall.
              </p>

              <p>
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
              </p>

              <p>
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
              </p>

              <p>
                I find it humbling and grounding and awe-inspiring to learn
                about our place in the universe, the little speck of dust we
                are. And so I love learning about constellations and all the
                things one sees when looking up at the sky at night.
              </p>
            </div>
          </section>

          <section id="playlist">
            <SectionHeader label="MY PLAYLIST" />
            <PlaceholderBox className="h-[175px]" />
          </section>
        </div>

        {/* Right column — sticky panel, scoped to the grid row above (ends after "My Playlist") */}
        <div className="relative mt-16 hidden lg:mt-0 lg:block">
          <div
            className="sticky flex min-h-[70vh] flex-col rounded-2xl border border-neutral-900/3 bg-neutral-75 p-9"
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

      {/* Statistics — outside the two-column grid; renders full width once the
          sticky panel's container (above) has scrolled out of the way. */}
      <section id="stats" className="mt-20">
        <SectionHeader label="SOME STATISTICS" />
        <PlaceholderBox className="h-[135px] w-full" />
      </section>
    </div>
  )
}
