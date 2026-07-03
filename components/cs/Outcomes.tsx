type Metric = {
  value: string
  label: string
}

type OutcomesProps = {
  metrics: Metric[]
}

export function Outcomes({ metrics }: OutcomesProps) {
  return (
    <div className="grid grid-cols-4 items-start">
      <p className="text-sm font-mono font-light leading-[1.2] text-neutral-400 pt-1 mt-1.5">
        Outcomes
      </p>
      <div className="col-span-3 flex flex-wrap gap-x-12 gap-y-6">
        {metrics.map(({ value, label }) => (
          <div key={label}>
            <p className="text-2xl font-medium text-primary">{value}</p>
            <p className="text-base leading-normal text-neutral-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
