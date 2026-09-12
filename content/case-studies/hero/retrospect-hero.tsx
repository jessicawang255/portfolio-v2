import { HeroForeground } from "@/components/layout/HeroForeground"
import type { Project } from "@/content/work"
import foregroundImg from "./retrospect-hero-foreground.png"

// Read by app/work/[slug]/page.tsx alongside the default export — lets
// CaseStudyLayout size the hero container to this image's real proportions
// (see CaseStudyLayout's HERO_HEIGHT) instead of an arbitrary vh guess, so
// the reveal never leaves a gap or crops the image as viewport width changes
// independently of height. Derived from the foreground, not the background
// video — the video's native aspect ratio doesn't match the design and is
// just object-cover'd to fill whatever box this resolves to.
export const heroAspectRatio = foregroundImg.width / foregroundImg.height

// Background is a plain absolute-fill looping video (no scroll animation,
// unlike HeroForeground's foreground) — matches CaseStudyHero's fixed frame,
// which never moves until #cs-content covers it.
export default function RetrospectHero({ project }: { project: Project }) {
  return (
    <>
      <div className="absolute inset-0">
        <video
          src="/images/case-studies/retrospect/retrospect-hero-background.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>
      <HeroForeground src={foregroundImg} alt={project.title} />
    </>
  )
}
