import type { Project } from "@/content/work"

// Fallback hero background for case studies that don't define their own —
// just the project's flat color or gradient, no extra treatment.
export function DefaultHeroBackground({ project }: { project: Project }) {
  const isGradient = project.bg.startsWith("linear-gradient")
  const style = isGradient ? { background: project.bg } : { backgroundColor: project.bg }
  return <div className="absolute inset-0" style={style} />
}
