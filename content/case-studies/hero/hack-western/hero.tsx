import type { Project } from "@/content/work"
import backgroundImg from "./background.png"
import mobileImg from "./foreground-mobile.png"
import thumbnailImg from "./thumbnail.png"
import HackWesternHeroClient from "./hero-client"

// Read by app/work/[slug]/page.tsx to size the hero container (see
// CaseStudyLayout's HERO_HEIGHT). Stays a Server Component so this export is
// a plain number, not a client reference — the animated hero
// (framer-motion, hooks) lives in hero-client.tsx instead.
export const heroAspectRatio = backgroundImg.width / backgroundImg.height

// Read by MoreCaseStudies for this case study's row thumbnail — a dedicated
// flattened shot of the sim's resting state, since the hero here has no
// single "foreground" image to reuse (it's a Matter.js physics sim built
// from loose stickers — see hero-client.tsx).
export const thumbnail = thumbnailImg

export default function HackWesternHero({ project }: { project: Project }) {
  return <HackWesternHeroClient project={project} backgroundImg={backgroundImg} mobileImg={mobileImg} />
}
