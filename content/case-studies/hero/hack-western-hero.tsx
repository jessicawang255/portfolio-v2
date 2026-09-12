import Image from "next/image"
import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import backgroundImg from "./hw-hero-background.png"
import foregroundImg from "./hw-hero-foreground.png"

// Read by app/work/[slug]/page.tsx alongside the default export — lets
// CaseStudyLayout size the hero container to this image's real proportions
// (see CaseStudyLayout's HERO_HEIGHT) instead of an arbitrary vh guess, so
// the reveal never leaves a gap or crops the image as viewport width changes
// independently of height.
export const heroAspectRatio = backgroundImg.width / backgroundImg.height

// WIP: background + foreground layers just stacked for now, no parallax yet.
export default function HackWesternHero({ project }: { project: Project }) {
  return (
    <>
      <Image src={backgroundImg} alt="" fill className="object-cover" sizes="100vw" />
      <HeroForeground src={foregroundImg} alt={project.title} />
    </>
  )
}
