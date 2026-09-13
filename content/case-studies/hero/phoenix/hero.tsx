import { DefaultHeroBackground } from "@/components/layout/DefaultHeroBackground"
import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import foregroundImg from "./foreground.png"

// Read by app/work/[slug]/page.tsx alongside the default export — lets
// CaseStudyLayout size the hero container to this image's real proportions
// (see CaseStudyLayout's HERO_HEIGHT) instead of an arbitrary vh guess, so
// the reveal never leaves a gap or crops the image as viewport width changes
// independently of height.
export const heroAspectRatio = foregroundImg.width / foregroundImg.height

// Read by MoreCaseStudies for this case study's row thumbnail — reuses the
// same foreground image the hero itself renders (see HeroForeground below):
// it's a transparent PNG, so it sits cleanly over MoreCaseStudies' own
// project.bg-colored box at thumbnail size too.
export const thumbnail = foregroundImg

// Reuses project.bg's flat placeholder background; this file only adds the foreground art on top.
export default function PhoenixHero({ project }: { project: Project }) {
  return (
    <>
      <DefaultHeroBackground project={project} />
      <HeroForeground src={foregroundImg} alt={project.title} />
    </>
  )
}
