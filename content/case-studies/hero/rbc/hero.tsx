import Image from "next/image"
import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import backgroundImg from "./background.png"
import foregroundImg from "./foreground.png"

// Read by app/work/[slug]/page.tsx to size the hero container (see
// CaseStudyLayout's HERO_HEIGHT).
export const heroAspectRatio = foregroundImg.width / foregroundImg.height

// Read by MoreCaseStudies for this case study's row thumbnail — reuses the
// same foreground image the hero itself renders (see HeroForeground below):
// it's a transparent PNG, so it sits cleanly over MoreCaseStudies' own
// project.bg-colored box at thumbnail size too.
export const thumbnail = foregroundImg

// Background is a plain absolute-fill image (no scroll animation, unlike
// HeroForeground's foreground) — matches CaseStudyHero's fixed frame, which
// never moves until #cs-content covers it.
export default function RbcHero({ project }: { project: Project }) {
  return (
    <>
      <div className="absolute inset-0">
        <Image src={backgroundImg} alt="" fill className="object-cover" sizes="100vw" />
      </div>
      <HeroForeground src={foregroundImg} alt={project.title} />
    </>
  )
}
