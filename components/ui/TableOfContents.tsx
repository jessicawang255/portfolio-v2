"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import type { TocSection } from "@/content/work"

type Props = {
  sections: TocSection[]
}

// Mild ease-out for the subsection reveal, so it settles smoothly instead of
// reading as a spring.
const EASE_OUT: [number, number, number, number] = [0.33, 1, 0.68, 1]
// The links below the reveal are already on screen and just shifting to make
// room, not entering, so they get ease-in-out instead.
const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]
const LAYOUT_TRANSITION = { duration: 0.22, ease: EASE_IN_OUT }
// Ease-in-out visually settles before its nominal duration ends, so the
// reveal can start once the shift is mostly done.
const SUBSECTION_REVEAL_DELAY = LAYOUT_TRANSITION.duration * 0.7

// Ceiling on how long a click-triggered scroll can suppress the observer, in
// case `scrollend` never fires. Comfortably longer than any smooth scroll takes.
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
        isActive ? "text-primary" : "font-normal text-neutral-400 hover:text-neutral-600"
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

  // While true, the scroll-spy observer below ignores what it sees, so
  // sections passed through en route to a click-triggered scroll's
  // destination never register as "active" and flash their subsections open.
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
      // A newer navigation started before this settled — let it own the
      // suppression window instead of ending it early.
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

  // The TOC rail is `sticky top-0` inside #cs-content, so it pins to the
  // viewport top exactly when #cs-content's top edge reaches y=0. Only show
  // the list once that's true.
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
          // Stays expanded for the whole section family — the heading itself
          // or any of its subsections — until scroll moves to another section.
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
                      // Siblings below are still sliding down to make room
                      // when this mounts — wait for most of that shift before
                      // fading in.
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
