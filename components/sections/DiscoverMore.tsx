import { discoverItems } from "@/content/work"
import { DiscoverCard } from "@/components/ui/DiscoverCard"

export function DiscoverMore() {
  return (
    <section className="container-main pt-20 pb-20">
      <h2 className="mb-5 text-sm font-normal uppercase text-subtle">
        Discover More
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-9 auto-rows-fr">
        {discoverItems.map((item) => (
          <div key={item.slug} className="h-full">
            <DiscoverCard item={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
