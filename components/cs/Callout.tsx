type CalloutProps = {
  label?: string
  heading: string
  body?: string
  children?: React.ReactNode
  className?: string
}

export function Callout({ label, heading, body, children, className }: CalloutProps) {
  return (
    <div className={`h-fit rounded-[8px] bg-[var(--cs-accent)]/6 px-6 py-5 ${className ?? ""}`}>
      <h2 className="text-balance text-xl font-medium text-neutral-800 leading-[1.4]">
        {label && (
          <>
            <span className="text-sm font-mono font-normal uppercase text-[var(--cs-accent)]">{label}</span>
            <span className="mx-2 text-[var(--cs-accent)]">·</span>
          </>
        )}
        {heading}
      </h2>
      {body && (
        <p className="text-balance text-base text-neutral-600 leading-normal mt-2">{body}</p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}
