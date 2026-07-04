"use client"

import { useState, useEffect } from "react"

type Props = {
  sections: string[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function TableOfContents({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>("")
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
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

    sections.forEach((section) => {
      const el = document.getElementById(slugify(section))
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
          const id = slugify(section)
          const isActive = activeId === id
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(id)
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                  setActiveId(id)
                }}
                className={`text-base transition-colors duration-100 ${
                  isActive ? "text-neutral-700" : "font-normal text-subtle hover:text-muted"
                }`}
              >
                {section}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
