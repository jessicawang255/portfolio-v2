import { discoverItems } from "@/content/work"
import { CaseStudyCard } from "@/components/ui/CaseStudyCard"

export function DiscoverMore() {
  return (
    <section className="container-main pt-12 pb-20">
      <h2 className="mb-5 font-mono text-sm uppercase leading-[1.2] text-neutral-400">
        Discover More
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {discoverItems.map((item) => (
          <CaseStudyCard key={item.slug} project={item} imageHeight={160} />
        ))}
      </div>
    </section>
  )
}
