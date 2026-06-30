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
      <p className="text-xl font-medium text-neutral-800 mt-3">{heading}</p>
      {body && (
        <p className="text-base leading-normal text-neutral-500 mt-1.5">{body}</p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}
