import { projects } from "@/content/work"
import { CaseStudyCard } from "@/components/ui/CaseStudyCard"

export function CaseStudies() {
  const [p0, p1, p2, p3] = projects

  return (
    <section id="work" className="container-main pb-20">
      <h2 className="mb-5 text-sm font-medium uppercase tracking-widest text-subtle">
        Case Studies
      </h2>

      <div className="flex flex-col gap-5">
        {/* Row 1: left card dominant */}
        <div className="grid gap-5 grid-wide-left">
          <CaseStudyCard project={p0} imageHeight={340} />
          <CaseStudyCard project={p1} imageHeight={340} />
        </div>

        {/* Row 2: right card dominant */}
        <div className="grid gap-5 grid-wide-right">
          <CaseStudyCard project={p2} imageHeight={320} />
          <CaseStudyCard project={p3} imageHeight={320} />
        </div>
      </div>
    </section>
  )
}
