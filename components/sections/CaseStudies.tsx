import { projects } from "@/content/work"
import { CaseStudyCard } from "@/components/ui/CaseStudyCard"

export function CaseStudies() {
  const [p0, p1, p2, p3] = projects

  return (
    <section id="work" className="container-main pt-12 pb-20">
      <h2 className="mb-5 text-sm font-normal uppercase text-subtle">
        Case Studies
      </h2>

      <div className="flex flex-col gap-y-16">
        {/* Row 1: 5/4 split */}
        <div className="grid gap-9 grid-cols-[5fr_4fr]">
          <CaseStudyCard project={p0} imageHeight={504} />
          <CaseStudyCard project={p1} imageHeight={388} />
        </div>

        {/* Row 2: right card dominant */}
        <div className="grid gap-9 grid-wide-right">
          <CaseStudyCard project={p2} imageHeight={400} />
          <CaseStudyCard project={p3} imageHeight={475} />
        </div>
      </div>
    </section>
  )
}
