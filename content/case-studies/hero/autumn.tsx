import { DefaultHeroBackground } from "@/components/layout/DefaultHeroBackground"
import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import heroImg from "./autumn-hero.png"

// Same flat navy background as before (project.bg) — this file exists only to add the foreground screenshots on top of it.
export default function AutumnHero({ project }: { project: Project }) {
  return (
    <>
      <DefaultHeroBackground project={project} />
      <HeroForeground src={heroImg} alt={project.title} />
    </>
  )
}
