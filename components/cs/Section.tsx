type SectionProps = {
  tag: string
  headline: string
  // ReactNode, not string — lets callers style inline spans (e.g. accent-
  // colored <strong>s) inside the body copy instead of only plain text.
  body?: React.ReactNode
  primary?: boolean
  id?: string
  // Defaults to h1 (every existing case study section relies on that). Only
  // override to h2 for a section that isn't the top-level heading of its
  // page context, e.g. sitting alongside other h1/h2 siblings.
  headingLevel?: 1 | 2
  children?: React.ReactNode
}

export function Section({ tag, headline, body, primary = false, id, headingLevel = 1, children }: SectionProps) {
  const Headline = headingLevel === 2 ? "h2" : "h1"
  return (
    <section id={id} className="flex flex-col items-start scroll-mt-12">
      <div className="flex items-center gap-2">
        {primary && (
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--cs-accent)] shrink-0" aria-hidden="true" />
        )}
        <p className="text-sm font-mono uppercase leading-[1.2] text-neutral-400">{tag}</p>
      </div>
      <Headline className="text-balance text-3xl font-medium leading-[1.2] text-primary mt-4">
        {headline}
      </Headline>
      {body && (
        <p className="text-balance text-base leading-normal text-neutral-600 mt-7">{body}</p>
      )}
      {children && (
        <div className="flex flex-col gap-6 mt-7 w-full">
          {children}
        </div>
      )}
    </section>
  )
}
