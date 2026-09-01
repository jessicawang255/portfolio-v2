import { DefaultHeroBackground } from "@/components/layout/DefaultHeroBackground"
import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import heroImg from "./glucal-hero.png"

// Read by app/work/[slug]/page.tsx alongside the default export — lets
// CaseStudyLayout size the hero container to this image's real proportions
// (see CaseStudyLayout's HERO_HEIGHT) instead of an arbitrary vh guess, so
// the reveal never leaves a gap or crops the image as viewport width changes
// independently of height.
export const heroAspectRatio = heroImg.width / heroImg.height

// Reuses project.bg's flat navy background; this file only adds the foreground screenshots on top.
export default function GlucalHero({ project }: { project: Project }) {
  return (
    <>
      <DefaultHeroBackground project={project} />
      <HeroForeground src={heroImg} alt={project.title} />
    </>
  )
}
