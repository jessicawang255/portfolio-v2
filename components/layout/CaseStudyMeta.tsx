"use client"

import { useEffect, useRef, useState } from "react"

export type MetaField = { label: string; value: string | string[] }

// Matches gap-x-10 below (2.5rem, assuming the default 16px root font-size —
// see globals.css, which never overrides it) — has to be a real px number
// here since it feeds a JS width comparison, not just a class name.
const GAP_X = 40

// The Role/Timeline/Team/Skills row under the case study title. Columns are
// always sized to their own content (`max-content`, never a stretched `1fr`
// track) so the gap between them stays the same fixed distance regardless of
// how much extra room the row has — see `gridTemplateColumns` below, not
// Tailwind's `grid-cols-2` (equal-fr tracks stretch to fill the row, opening
// up a gap way bigger than gap-x-10 whenever the container is wider than the
// content needs).
//
// Whether that's 4 columns (one row) or 2 (wrapped, mobile-style) is decided
// by measuring this row's actual content against its actual container width
// — not a `sm:` viewport breakpoint or a single hardcoded container-query
// threshold. A fixed threshold has to assume the *widest* case study's
// fields (guessing safely means over-shooting for every narrower one, which
// is exactly what left visible slack next to Skills on cases with shorter
// text) and still goes stale the moment the TOC sidebar's reserved space
// changes the row's real available width at some viewport. Measuring live
// gets every case study its own correct switch point for free.
export function CaseStudyMeta({ fields }: { fields: MetaField[] }) {
  const ref = useRef<HTMLDivElement>(null)
  // SSR/first-paint guess: the more compact, always-safe layout — matches
  // this row's old mobile-first default before JS has had a chance to
  // measure the real container width.
  const [columns, setColumns] = useState(2)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function measure() {
      const items = Array.from(el!.children) as HTMLElement[]
      if (items.length === 0) return
      // Columns are already `max-content`-sized (see below), so each item's
      // rendered width *is* its natural content width regardless of which
      // column count is currently active.
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
            <div className="text-base text-neutral-500">
              {value.map((item, i) => (
                <p key={i} className="m-0">{item}</p>
              ))}
            </div>
          ) : (
            <p className="text-base text-neutral-500">{value}</p>
          )}
        </div>
      ))}
    </div>
  )
}
