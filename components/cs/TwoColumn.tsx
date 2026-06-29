type Ratio = "1/1" | "3/2" | "2/3"

type TwoColumnProps = {
  left: React.ReactNode
  right: React.ReactNode
  ratio?: Ratio
}

const ratioClasses: Record<Ratio, string> = {
  "1/1": "grid-cols-2",
  "3/2": "grid-cols-[3fr_2fr]",
  "2/3": "grid-cols-[2fr_3fr]",
}

export function TwoColumn({ left, right, ratio = "1/1" }: TwoColumnProps) {
  return (
    <div className={`grid gap-6 items-start ${ratioClasses[ratio]}`}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
}
