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

  return (
    <nav aria-label="Table of contents">
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
