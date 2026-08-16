type SectionProps = {
  tag: string
  headline: string
  // ReactNode, not string — lets callers style inline spans (e.g. accent-
  // colored <strong>s) inside the body copy instead of only plain text.
  body?: React.ReactNode
  primary?: boolean
  id?: string
  children?: React.ReactNode
}

export function Section({ tag, headline, body, primary = false, id, children }: SectionProps) {
  return (
    <section id={id} className="flex flex-col items-start scroll-mt-12">
      <div className="flex items-center gap-2">
        {primary && (
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--cs-accent)] shrink-0" aria-hidden="true" />
        )}
        <p className="text-sm font-mono uppercase leading-[1.2] text-neutral-400">{tag}</p>
      </div>
      <h1 className="text-balance text-2xl font-normal leading-[1.2] text-primary mt-3">
        {headline}
      </h1>
      {body && (
        <p className="text-balance text-base leading-normal text-neutral-500 mt-[18px]">{body}</p>
      )}
      {children && (
        <div className="flex flex-col gap-9 mt-9 w-full">
          {children}
        </div>
      )}
    </section>
  )
}
