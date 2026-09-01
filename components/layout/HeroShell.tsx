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
      {/* Static below `sm`, fixed from `sm` up — matches Footer.tsx. */}
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
