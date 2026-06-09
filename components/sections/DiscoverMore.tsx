import { discoverItems } from "@/content/work"
import { DiscoverCard } from "@/components/ui/DiscoverCard"

export function DiscoverMore() {
  return (
    <section className="container-main pt-20 pb-20">
      <h2 className="mb-5 text-sm font-medium uppercase text-subtle">
        Discover More
      </h2>

      <div className="grid grid-cols-3 gap-9">
        {discoverItems.map((item) => (
          <DiscoverCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  )
}
