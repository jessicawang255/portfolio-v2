type Ratio = "1/1" | "3/2" | "2/3"

type TwoColumnProps = {
  left: React.ReactNode
  right: React.ReactNode
  ratio?: Ratio
}

const ratioClasses: Record<Ratio, string> = {
  "1/1": "md:grid-cols-2",
  "3/2": "md:grid-cols-[3fr_2fr]",
  "2/3": "md:grid-cols-[2fr_3fr]",
}

// Below `md`, always stacks into a single column (two rows) regardless of
// ratio — there's no room for side-by-side columns on mobile.
export function TwoColumn({ left, right, ratio = "1/1" }: TwoColumnProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 items-start ${ratioClasses[ratio]}`}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
}
