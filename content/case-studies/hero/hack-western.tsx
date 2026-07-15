import { GrainOverlay } from "@/lib/heroGrain"
import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import heroImg from "./hack-western-hero.png"

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
