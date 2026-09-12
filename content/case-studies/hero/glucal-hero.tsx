import Image from "next/image"
import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import backgroundImg from "./glucal-hero-background.png"
import foregroundImg from "./glucal-hero-foreground.png"

// Read by app/work/[slug]/page.tsx alongside the default export — lets
// CaseStudyLayout size the hero container to this image's real proportions
// (see CaseStudyLayout's HERO_HEIGHT) instead of an arbitrary vh guess, so
// the reveal never leaves a gap or crops the image as viewport width changes
// independently of height.
export const heroAspectRatio = backgroundImg.width / backgroundImg.height

// Background is a plain absolute-fill image (no scroll animation, unlike
// HeroForeground's foreground) — matches CaseStudyHero's fixed frame, which
// never moves until #cs-content covers it.
export default function GlucalHero({ project }: { project: Project }) {
  return (
    <>
      <div className="absolute inset-0">
        <Image src={backgroundImg} alt="" fill className="object-cover" sizes="100vw" />
      </div>
      <HeroForeground src={foregroundImg} alt={project.title} />
    </>
  )
}
