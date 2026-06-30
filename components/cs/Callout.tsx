type CalloutProps = {
  label: string
  heading: string
  body?: string
  children?: React.ReactNode
}

export function Callout({ label, heading, body, children }: CalloutProps) {
  return (
    <div className="border-l-2 border-[var(--cs-accent)] pl-6 h-fit">
      <p className="text-base text-[var(--cs-accent)]">{label}</p>
      <h2 className="text-xl font-medium text-neutral-800 mt-3 leading-[1.2]">{heading}</h2>
      {body && (
        <p className="text-base text-neutral-500 leading-normal mt-1.5">{body}</p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}
