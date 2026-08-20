type Metric = {
  value: string
  label: string
}

type OutcomesProps = {
  metrics: Metric[]
}

export function Outcomes({ metrics }: OutcomesProps) {
  return (
    <div className="flex flex-col items-start gap-8 sm:flex-row sm:justify-between">
      <p className="shrink-0 text-sm font-mono uppercase leading-[1.2] text-neutral-400 pt-1 mt-1.5">
        Outcomes
      </p>
      <div className="flex flex-col gap-y-6 sm:flex-row sm:flex-wrap sm:gap-x-12">
        {metrics.map(({ value, label }) => (
          <div key={label} className="max-w-[12rem]">
            <p className="text-2xl font-medium text-primary">{value}</p>
            <p className="text-base leading-normal text-neutral-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
