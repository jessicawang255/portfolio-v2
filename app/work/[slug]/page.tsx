import { notFound } from "next/navigation"
import { projects, type Project } from "@/content/work"
import { CaseStudyLayout } from "@/components/layout/CaseStudyLayout"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return { title: `${project.title} — Jessica Wang` }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  let Content: React.ComponentType | null = null
  try {
    const mod = await import(`@/content/case-studies/${slug}.tsx`)
    Content = mod.default
  } catch {
    // No content file yet for this case study
  }

  let HeroBackground: React.ComponentType<{ project: Project }> | null = null
  // The image's own width/height ratio, read from the hero module's
  // `heroAspectRatio` export (see e.g. hero/glucal.tsx) — undefined when a
  // case study has no custom hero (CaseStudyLayout falls back to a fixed vh
  // height there, since DefaultHeroBackground has no image to size against).
  let heroAspectRatio: number | undefined
  try {
    const mod = await import(`@/content/case-studies/hero/${slug}.tsx`)
    HeroBackground = mod.default
    heroAspectRatio = mod.heroAspectRatio
  } catch {
    // No custom hero background — CaseStudyLayout falls back to a plain one
  }

  return (
    <CaseStudyLayout project={project} heroBackground={HeroBackground} heroAspectRatio={heroAspectRatio}>
      {Content ? <Content /> : null}
    </CaseStudyLayout>
  )
}
