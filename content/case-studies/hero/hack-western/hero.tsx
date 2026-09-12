import type { Project } from "@/content/work"
import backgroundImg from "./background.png"
import thumbnailImg from "./thumbnail.png"
import HackWesternHeroClient from "./hero-client"

// Read by app/work/[slug]/page.tsx alongside the default export — lets
// CaseStudyLayout size the hero container to this image's real proportions
// (see CaseStudyLayout's HERO_HEIGHT) instead of an arbitrary vh guess, so
// the reveal never leaves a gap or crops the image as viewport width changes
// independently of height.
//
// This file stays a Server Component (no "use client") specifically so this
// export is a plain number — every export of a "use client" module becomes
// a client reference from a Server Component's point of view, and page.tsx
// reads this directly, not through a Component. The actual animated hero
// (framer-motion, hooks) lives in hero-client.tsx instead.
export const heroAspectRatio = backgroundImg.width / backgroundImg.height

// Read by MoreCaseStudies for this case study's row thumbnail — a dedicated
// flattened shot of the sim's resting state, not `backgroundImg` itself:
// unlike the other case studies, the hero here has no single "foreground"
// image to reuse (it's a Matter.js physics sim built from a dozen loose
// stickers — see hero-client.tsx), so this asset exists purely for the
// thumbnail.
export const thumbnail = thumbnailImg

export default function HackWesternHero({ project }: { project: Project }) {
  return <HackWesternHeroClient project={project} backgroundImg={backgroundImg} />
}
