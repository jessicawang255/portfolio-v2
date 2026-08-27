import { CaseStudies } from "@/components/sections/CaseStudies"
import { DiscoverMore } from "@/components/sections/DiscoverMore"

export default function Home() {
  return (
    // gap-20 — flat at every breakpoint, matching About's own section gap
    // (see AboutContent.tsx's left-column wrapper). CaseStudies/DiscoverMore
    // each still apply container-main themselves; this wrapper only spaces
    // them apart, same division of responsibility case study pages already
    // use for their own section stack.
    <div className="flex flex-col gap-20">
      <CaseStudies />
      <DiscoverMore />
    </div>
  )
}
