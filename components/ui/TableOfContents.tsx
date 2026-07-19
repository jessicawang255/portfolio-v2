"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import type { TocSection } from "@/content/work"

type Props = {
  sections: TocSection[]
}

// A gentle, standard ease-out for the subsection reveal itself — entering
// content gets ease-out, but a mild curve rather than an aggressive one so
// it settles smoothly instead of reading as a spring.
const EASE_OUT: [number, number, number, number] = [0.33, 1, 0.68, 1]
// The links below the reveal aren't entering — they're already on screen
// and just shifting to make room — so per the easing decision framework
// ("on-screen movement" gets ease-in-out, not ease-out) they use this
// instead, which keeps the reflow feeling calm rather than snappy.
const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]
const LAYOUT_TRANSITION = { duration: 0.22, ease: EASE_IN_OUT }
// Ease-in-out visually settles well before its nominal duration ends (the
// last stretch of motion is imperceptibly slow), so the reveal below can
// start once the shift is mostly done rather than waiting for all of it.
const SUBSECTION_REVEAL_DELAY = LAYOUT_TRANSITION.duration * 0.7

// Ceiling on how long a click-triggered scroll can suppress the observer,
// in case `scrollend` never fires (unsupported browser, or the scroll gets
// interrupted). Comfortably longer than any in-page smooth scroll takes.
const NAVIGATION_TIMEOUT_MS = 1000

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function flattenIds(sections: TocSection[]): string[] {
  return sections.flatMap((section) => [
    slugify(section.title),
    ...(section.subsections ?? []).map(slugify),
  ])
}

function TocLink({
  title,
  id,
  isActive,
  onNavigate,
}: {
  title: string
  id: string
  isActive: boolean
  onNavigate: (id: string) => void
}) {
  return (
    <a
      href={`#${id}`}
      onClick={(e) => {
        e.preventDefault()
        onNavigate(id)
      }}
      className={`text-base transition-colors duration-150 ${
        isActive ? "text-neutral-700" : "font-normal text-subtle hover:text-muted"
      }`}
    >
      {title}
    </a>
  )
}

export function TableOfContents({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>("")
  const [isPinned, setIsPinned] = useState(false)
  const reduce = useReducedMotion()

  // While true, the scroll-spy observer below ignores what it sees — set
  // for the duration of a click-triggered scroll so sections it passes
  // through on the way to the destination never register as "active" and
  // flash their subsections open. We control this scroll ourselves, so we
  // know exactly when to stop listening rather than guessing with a timer.
  const isNavigatingRef = useRef(false)
  const navigationTokenRef = useRef(0)

  function handleNavigate(id: string) {
    const el = document.getElementById(id)
    if (!el) return

    const token = ++navigationTokenRef.current
    isNavigatingRef.current = true
    setActiveId(id)
    el.scrollIntoView({ behavior: "smooth", block: "start" })

    const resume = () => {
      // A newer navigation started before this one settled — let that one
      // own the suppression window instead of ending it early.
      if (navigationTokenRef.current !== token) return
      isNavigatingRef.current = false
    }

    window.addEventListener("scrollend", resume, { once: true })
    window.setTimeout(resume, NAVIGATION_TIMEOUT_MS)
  }

  useEffect(() => {
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigatingRef.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: "-15% 0px -75% 0px",
        threshold: 0,
      }
    )

    flattenIds(sections).forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  // The TOC rail (aside) is `sticky top-0` inside #cs-content, so it pins to
  // the viewport top exactly when #cs-content's top edge reaches y=0. Only
  // show the list once that's true, rather than as soon as it scrolls into
  // flow further down the page.
  useEffect(() => {
    const content = document.getElementById("cs-content")
    if (!content) return

    function update() {
      setIsPinned(content!.getBoundingClientRect().top <= 0)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update, { passive: true })
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <nav
      aria-label="Table of contents"
      inert={!isPinned}
      className={`transition-opacity duration-300 ${isPinned ? "opacity-100" : "opacity-0"}`}
    >
      <ul className="flex flex-col gap-3 list-none m-0 p-0">
        {sections.map((section) => {
          const id = slugify(section.title)
          const subIds = (section.subsections ?? []).map(slugify)
          // Stays expanded for the whole section family — the parent
          // heading itself, or any of its own subsections — and only
          // collapses once scroll moves to an unrelated top-level section.
          const isExpanded = subIds.length > 0 && (activeId === id || subIds.includes(activeId))

          return (
            <motion.li
              key={id}
              layout="position"
              transition={reduce ? { duration: 0 } : LAYOUT_TRANSITION}
              className="flex flex-col gap-3"
            >
              <TocLink title={section.title} id={id} isActive={activeId === id} onNavigate={handleNavigate} />
              <AnimatePresence initial={false} mode="popLayout">
                {isExpanded && (
                  <motion.ul
                    key="subsections"
                    initial={{ opacity: 0, y: reduce ? 0 : -3 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      // The siblings below are still sliding down to make
                      // room when this mounts — wait for most of that shift
                      // before fading in, so the two are never visibly
                      // overlapping without holding the reveal back longer
                      // than it needs to be.
                      transition: reduce
                        ? { duration: 0 }
                        : { duration: 0.22, ease: EASE_OUT, delay: SUBSECTION_REVEAL_DELAY },
                    }}
                    exit={{ opacity: 0, y: reduce ? 0 : -3, transition: reduce ? { duration: 0 } : { duration: 0.16, ease: EASE_OUT } }}
                    className="flex flex-col gap-3 pl-4 list-none m-0 p-0"
                  >
                    {section.subsections!.map((subtitle) => {
                      const subId = slugify(subtitle)
                      return (
                        <li key={subId}>
                          <TocLink
                            title={subtitle}
                            id={subId}
                            isActive={activeId === subId}
                            onNavigate={handleNavigate}
                          />
                        </li>
                      )
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          )
        })}
      </ul>
    </nav>
  )
}
