import { DefaultHeroBackground } from "@/components/layout/DefaultHeroBackground"
import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import foregroundImg from "./foreground.png"
import foregroundMobileImg from "./foreground-mobile.png"

// Read by app/work/[slug]/page.tsx to size the hero container (see
// CaseStudyLayout's HERO_HEIGHT).
export const heroAspectRatio = foregroundImg.width / foregroundImg.height

// Read by MoreCaseStudies for this case study's row thumbnail — reuses the
// same foreground image the hero itself renders (see HeroForeground below):
// it's a transparent PNG, so it sits cleanly over MoreCaseStudies' own
// project.bg-colored box at thumbnail size too.
export const thumbnail = foregroundImg

// Reuses project.bg's flat navy background; this file only adds the foreground screenshots on top.
export default function AutumnHero({ project }: { project: Project }) {
  return (
    <>
      <DefaultHeroBackground project={project} />
      <HeroForeground src={foregroundImg} mobileSrc={foregroundMobileImg} alt={project.title} />
    </>
  )
}
