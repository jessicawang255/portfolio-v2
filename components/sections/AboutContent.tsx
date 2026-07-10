"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type PanelSection = { id: string; label: string }

// Only the first four sections sit beside the sticky panel — "Some Statistics"
// lives outside that grid entirely, so the panel scrolls away before it.
const panelSections: PanelSection[] = [
  { id: "journey",     label: "MY JOURNEY THUS FAR" },
  { id: "communities", label: "MY COMMUNITIES" },
  { id: "fun",         label: "WHAT I DO FOR FUN" },
  { id: "playlist",    label: "MY PLAYLIST" },
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
  const displaySection = panelSections.find((s) => s.id === displayId)
  const trigger = hoveredId ? "hover" : "scroll"
  const panelText = displaySection
    ? `Active: ${displaySection.id} (${trigger})`
    : "Hover to find out more…"

  return (
    <div className="container-main py-16">
      <div className="grid grid-cols-1 gap-x-[54px] lg:grid-cols-[586px_1fr]">
        {/* Left column — sections 1-4 */}
        <div className="flex flex-col gap-20">
          <section
            id="journey"
            onMouseEnter={() => setHoveredId("journey")}
            onMouseLeave={() => setHoveredId(null)}
          >
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
            <PlaceholderBox className="h-[480px]" />
          </section>

          <section
            id="communities"
            onMouseEnter={() => setHoveredId("communities")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <SectionHeader label="MY COMMUNITIES" />
            <PlaceholderBox className="h-[360px]" />
          </section>

          <section
            id="fun"
            onMouseEnter={() => setHoveredId("fun")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <SectionHeader label="WHAT I DO FOR FUN" />
            <PlaceholderBox className="h-[360px]" />
          </section>

          <section
            id="playlist"
            onMouseEnter={() => setHoveredId("playlist")}
            onMouseLeave={() => setHoveredId(null)}
          >
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
