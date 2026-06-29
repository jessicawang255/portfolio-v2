type Metric = {
  value: string
  label: string
}

type OutcomesProps = {
  metrics: Metric[]
}

export function Outcomes({ metrics }: OutcomesProps) {
  return (
    <div className="flex items-start gap-12 py-8 border-y border-divider">
      <p className="text-base font-normal uppercase text-neutral-500 shrink-0 pt-1">
        Outcomes
      </p>
      <div className="flex flex-wrap gap-x-12 gap-y-6">
        {metrics.map(({ value, label }) => (
          <div key={label}>
            <p className="text-[1.75rem] font-medium text-primary leading-none">{value}</p>
            <p className="text-sm text-neutral-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
