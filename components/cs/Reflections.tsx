type ReflectionItem = {
  heading?: string
  body: string
}

type ReflectionsProps = {
  id?: string
  tag: string
  // 2 or 3 columns, laid out side by side once each item has ~20rem to
  // breathe, stacked into rows below that.
  items: ReflectionItem[]
}

export function Reflections({ id, tag, items }: ReflectionsProps) {
  return (
    <section id={id} className="flex flex-col items-start scroll-mt-12">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--cs-accent)] shrink-0" aria-hidden="true" />
        <p className="text-sm font-mono uppercase leading-[1.2] text-neutral-400">{tag}</p>
      </div>
      {/* auto-fit + minmax reflows off the grid's own rendered width (this
          column's width varies with the TOC/viewport tiers in
          CaseStudyLayout, so a viewport-based `sm:` breakpoint can still be
          in "side by side" mode while the column itself is too narrow for
          it) instead of a fixed breakpoint, and never opens more columns
          than there are items since empty auto-fit tracks collapse. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-9 mt-6 w-full">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-3">
            {item.heading && (
              <h2 className="text-balance text-xl font-medium text-neutral-800 leading-[1.2]">{item.heading}</h2>
            )}
            <p className="text-balance text-base text-neutral-600 leading-normal">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
