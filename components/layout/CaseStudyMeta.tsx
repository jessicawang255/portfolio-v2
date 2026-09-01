"use client"

import { useEffect, useRef, useState } from "react"

export type MetaField = { label: string; value: string | string[] }

// Matches gap-x-10 below (2.5rem at the default 16px root font-size); needs
// to be a real px number since it feeds a JS width comparison, not a class.
const GAP_X = 40

// Role/Timeline/Team/Skills row under the case study title. Columns are
// max-content sized so the gap stays fixed regardless of extra row space
// (Tailwind's grid-cols-2 uses equal-fr tracks that stretch and widen the
// gap instead). Column count (4 vs 2) is decided by measuring content
// against the container's real width rather than a viewport breakpoint,
// since the switch point differs per case study and shifts with the TOC
// sidebar's reserved space.
export function CaseStudyMeta({ fields }: { fields: MetaField[] }) {
  const ref = useRef<HTMLDivElement>(null)
  // SSR/first-paint guess before JS measures the real container width.
  const [columns, setColumns] = useState(2)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function measure() {
      const items = Array.from(el!.children) as HTMLElement[]
      if (items.length === 0) return
      // Columns are max-content sized, so each item's rendered width is its
      // natural content width regardless of the current column count.
      const naturalWidth = items.reduce((sum, item) => sum + item.getBoundingClientRect().width, 0)
      const singleRowWidth = naturalWidth + GAP_X * (items.length - 1)
      setColumns(el!.clientWidth >= singleRowWidth ? items.length : 2)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [fields.length])

  if (fields.length === 0) return null

  return (
    <div
      ref={ref}
      className="grid gap-x-10 gap-y-4 mt-9"
      style={{ gridTemplateColumns: `repeat(${columns}, max-content)` }}
    >
      {fields.map(({ label, value }) => (
        <div key={label}>
          <p className="font-mono text-sm text-neutral-400 mb-1">{label}</p>
          {Array.isArray(value) ? (
            <div className="text-base text-neutral-600">
              {value.map((item, i) => (
                <p key={i} className="m-0">{item}</p>
              ))}
            </div>
          ) : (
            <p className="text-base text-neutral-600">{value}</p>
          )}
        </div>
      ))}
    </div>
  )
}
