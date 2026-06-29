type Metric = {
  value: string
  label: string
}

type OutcomesProps = {
  metrics: Metric[]
}

export function Outcomes({ metrics }: OutcomesProps) {
  return (
    <div className="flex items-start justify-between gap-12 py-8">
    <p className="text-sm font-medium uppercase text-neutral-400 shrink-0 pt-1">
      Outcomes
    </p>
    <div className="flex flex-wrap gap-x-12 gap-y-6">
      {metrics.map(({ value, label }) => (
        <div key={label}>
          <p className="text-2xl font-medium text-primary">{value}</p>
          <p className="text-base text-neutral-500">{label}</p>
        </div>
      ))}
    </div>
    </div>
  )
}
