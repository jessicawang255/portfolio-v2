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
      {/* Below `sm`, this stays in normal flow instead of fixed. Footer.tsx is
          fixed at every breakpoint (so its peel effect works on mobile too),
          and its mobile layout stacks into one tall column — a fixed hero
          competing with it for the same short viewport, with neither aware of
          the other's height, could overlap it. Keeping the hero static avoids
          that; the footer alone is safe since the reveal math in
          ScrollRadiusController always reserves exactly its height. */}
      <div ref={ref} className="static sm:fixed inset-x-0 top-0 z-[2] pointer-events-none">
        {children}
      </div>
      <div aria-hidden="true" style={{ height: spacer }} className="hidden sm:block" />
    </>
  )
}
