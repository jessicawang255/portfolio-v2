type CalloutProps = {
  label: string
  heading: string
  body?: string
  children?: React.ReactNode
}

export function Callout({ label, heading, body, children }: CalloutProps) {
  return (
    <div className="border-l-2 border-red-500 pl-6 pt-6 pb-6">
      <p className="text-sm font-medium text-red-500">{label}</p>
      <p className="text-xl font-medium text-primary mt-3 leading-snug">{heading}</p>
      {body && (
        <p className="text-base text-neutral-500 leading-relaxed mt-1.5">{body}</p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}
