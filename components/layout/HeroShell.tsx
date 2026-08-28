"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  children: React.ReactNode
  /** SSR approximation of the hero's rendered height minus nav height. */
  fallbackSpacer?: number
}

export function HeroShell({ children, fallbackSpacer = 324 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [spacer, setSpacer] = useState(fallbackSpacer)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const navH = parseFloat(getComputedStyle(document.body).paddingTop) || 56
    function measure() { setSpacer(el!.offsetHeight - navH) }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <>
      {/* Below `sm` — the site's chrome breakpoint (see --breakpoint-sm in
          globals.css) — this stays in normal flow instead of fixed,
          matching Footer.tsx, which is likewise static on mobile and only
          fixed from `sm` up. Not `md`: this switch is about whether the
          hero pins and peels behind the frame at all, a different concern
          from how the frame's own content is laid out. */}
      <div
        ref={ref}
        id="hero-content"
        className="static sm:fixed inset-x-0 top-0 z-[2] pointer-events-none"
        style={{ transformOrigin: "center top" }}
      >
        {children}
      </div>
      <div aria-hidden="true" style={{ height: spacer }} className="hidden sm:block" />
    </>
  )
}
