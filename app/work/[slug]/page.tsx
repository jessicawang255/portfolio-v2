import { notFound } from "next/navigation"
import { projects } from "@/content/work"
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

  return (
    <CaseStudyLayout project={project}>
      {Content ? <Content /> : null}
    </CaseStudyLayout>
  )
}
