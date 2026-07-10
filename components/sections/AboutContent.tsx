"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

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

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="13" height="13" rx="4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.75" cy="4.25" r="0.75" fill="currentColor" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M7.5 4.5L8.4 3.5C9.6 2.3 11.4 2.3 12.5 3.5C13.7 4.6 13.7 6.4 12.5 7.5L11.5 8.5M8.5 11.5L7.6 12.5C6.4 13.7 4.6 13.7 3.5 12.5C2.3 11.4 2.3 9.6 3.5 8.5L4.5 7.5M6.3 9.7L9.7 6.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type Community = {
  id: string
  name: string
  description: string
  logo: string
  logoBg: string
  href: string
  // Interchangeable — swap for any other icon component (e.g. LinkIcon) per item.
  icon: React.ComponentType
}

const communities: Community[] = [
  {
    id: "comm-product-design-sprint",
    name: "Product Design Sprint",
    description: "Western University's first and largest design-a-thon",
    logo: "/images/communities/product-design-sprint.svg",
    logoBg: "#DCD6F7",
    href: "https://instagram.com/pds.uwo",
    icon: InstagramIcon,
  },
  {
    id: "comm-hack-western",
    name: "Hack Western",
    description: "Western University's hackathon",
    logo: "/images/communities/hack-western.svg",
    logoBg: "#F3F4F6",
    href: "https://hackwestern.com",
    icon: LinkIcon,
  },
  {
    id: "comm-framer",
    name: "Framer",
    description: "I'm a campus ambassador for Framer, xyz xyz xyz.",
    logo: "/images/communities/framer.svg",
    logoBg: "#0A0A0A",
    href: "https://instagram.com/framer",
    icon: InstagramIcon,
  },
  {
    id: "comm-ivey-product-society",
    name: "Ivey Product Society",
    description: "Building the next generation of product leaders @ Ivey Business School",
    logo: "/images/communities/ivey-product-society.svg",
    logoBg: "#F9FAFB",
    href: "https://instagram.com/iveyproductsociety",
    icon: InstagramIcon,
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
    <div className="mb-4.5 flex items-center justify-between">
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
      className="-mx-3 flex items-center justify-between gap-6 rounded-sm px-3 py-3 transition-colors duration-0 hover:bg-neutral-100/50"
    >
      <div>
        <p className="text-base font-medium text-neutral-900">{item.company}</p>
        <p className="text-base text-neutral-500">{item.role}</p>
      </div>
      <span className="shrink-0 font-mono text-sm uppercase text-neutral-500">{item.period}</span>
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
  const Icon = item.icon
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      className="-mx-3 flex items-center justify-between gap-6 rounded-sm px-3 py-3 transition-colors duration-0 hover:bg-neutral-100/50"
    >
      <div className="flex items-center gap-6">
        <div
          className="h-20 w-20 shrink-0 rounded-2xl bg-cover bg-center"
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
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400 transition-colors duration-75 hover:text-primary"
      >
        <Icon />
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
    <div className="container-main py-16">
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
                  className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors duration-75"
                >
                  View resume
                  <ArrowUpRight />
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
              {communities.map((item, i) => (
                <div key={item.id}>
                  {i > 0 && <div className="mx-1 h-px bg-neutral-200" />}
                  <CommunityRow
                    item={item}
                    onHover={() => setHoveredId(item.id)}
                    onUnhover={() => setHoveredId(null)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section
            id="fun"
            onMouseEnter={() => setHoveredId("fun")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <SectionHeader label="WHAT I DO FOR FUN" />
            <PlaceholderBox className="h-[360px]" />
          </section>

          <section id="playlist">
            <SectionHeader label="MY PLAYLIST" />
            <PlaceholderBox className="h-[175px]" />
          </section>
        </div>

        {/* Right column — sticky panel, scoped to the grid row above (ends after "My Playlist") */}
        <div className="relative mt-16 hidden lg:mt-0 lg:block">
          <div
            className="sticky flex min-h-[70vh] flex-col rounded-2xl bg-neutral-75 p-9"
            style={{ top: "calc(var(--nav-height) + 20px)" }}
          >
            {reduce ? (
              <p className="font-mono text-sm text-muted">{panelText}</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.p
                  key={panelText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-mono text-sm text-muted"
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
