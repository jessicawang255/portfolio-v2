import { GrainOverlay } from "@/lib/heroGrain"
import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import heroImg from "./hack-western-hero.png"

// Read by app/work/[slug]/page.tsx alongside the default export — lets
// CaseStudyLayout size the hero container to this image's real proportions
// (see CaseStudyLayout's HERO_HEIGHT) instead of an arbitrary vh guess, so
// the reveal never leaves a gap or crops the image as viewport width changes
// independently of height.
export const heroAspectRatio = heroImg.width / heroImg.height

// Pale lavender-to-pink gradient with a dark purple-blue grain burned in for depth.
export default function HackWesternHero({ project }: { project: Project }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #F5E8F7 0%, #FFC7F9 100%)" }}
      />
      <GrainOverlay hex="#000000" />
      <HeroForeground src={heroImg} alt={project.title} />
    </>
  )
}
