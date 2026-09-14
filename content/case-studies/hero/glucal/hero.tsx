import Image from "next/image"
import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import backgroundImg from "./background.png"
import foregroundImg from "./foreground.png"
import foregroundMobileImg from "./foreground-mobile.png"

// Read by app/work/[slug]/page.tsx to size the hero container (see
// CaseStudyLayout's HERO_HEIGHT).
export const heroAspectRatio = backgroundImg.width / backgroundImg.height

// Read by MoreCaseStudies for this case study's row thumbnail — the
// foreground (transparent PNG overlay), not the opaque full-bleed
// background: it's what HeroForeground actually renders, so it's already
// designed to read well at a small size.
export const thumbnail = foregroundImg

// Background is a plain absolute-fill image (no scroll animation, unlike
// HeroForeground's foreground) — matches CaseStudyHero's fixed frame, which
// never moves until #cs-content covers it.
export default function GlucalHero({ project }: { project: Project }) {
  return (
    <>
      <div className="absolute inset-0">
        <Image src={backgroundImg} alt="" fill className="object-cover" sizes="100vw" />
      </div>
      <HeroForeground src={foregroundImg} mobileSrc={foregroundMobileImg} alt={project.title} />
    </>
  )
}
