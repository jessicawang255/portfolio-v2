"use client"

import { DotField } from "@/components/ui/DotField"

const ACCENT_COLOR = [50, 50, 50] as const

export function DotBackground() {
  return (
    <DotField accentColor={ACCENT_COLOR} viewport />
  )
}
