import { CaseStudies } from "@/components/sections/CaseStudies"
import { DiscoverMore } from "@/components/sections/DiscoverMore"

export default function Home() {
  return (
    // gap-20 matches About's section gap (AboutContent.tsx). Each section
    // still applies container-main itself; this wrapper only spaces them.
    <div className="flex flex-col gap-20">
      <CaseStudies />
      <DiscoverMore />
    </div>
  )
}
