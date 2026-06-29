type SectionProps = {
  tag: string
  headline: string
  body?: string
  primary?: boolean
  id?: string
  children?: React.ReactNode
}

export function Section({ tag, headline, body, primary = false, id, children }: SectionProps) {
  return (
    <section id={id} className="flex flex-col scroll-mt-12">
      <div className="flex items-center gap-1.5">
        {primary && (
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-px" aria-hidden="true" />
        )}
        <p className="text-base font-medium uppercase tracking-wider text-neutral-400">{tag}</p>
      </div>
      <h1 className="text-2xl font-medium text-primary leading-snug mt-3">
        {headline}
      </h1>
      {body && (
        <p className="text-base text-neutral-500 leading-relaxed mt-[18px]">{body}</p>
      )}
      {children && (
        <div className="flex flex-col gap-9 mt-9">
          {children}
        </div>
      )}
    </section>
  )
}
