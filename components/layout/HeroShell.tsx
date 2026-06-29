"use client"

import { useEffect, useRef, useState } from "react"
import { Hero } from "@/components/sections/Hero"

export function HeroShell() {
  const ref = useRef<HTMLDivElement>(null)
  // SSR approximation: nav(56) + pt(120) + content(~180) + pb(80) - nav(56) = 324
  const [spacer, setSpacer] = useState(324)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const navH = parseFloat(getComputedStyle(document.body).paddingTop) || 56
    function measure() { setSpacer(el.offsetHeight - navH) }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <>
      <div ref={ref} className="fixed inset-x-0 top-0 z-[2] pointer-events-none">
        <Hero />
      </div>
      <div aria-hidden="true" style={{ height: spacer }} />
    </>
  )
}
