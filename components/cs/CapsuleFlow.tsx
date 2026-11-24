export type CapsuleStage = "setup" | "contribute" | "open"

const STAGE_ORDER: CapsuleStage[] = ["setup", "contribute", "open"]

type CapsuleFlowProps = {
  // v1 is the original create → wait → open model; v2 adds the contribution
  // period between setup and opening.
  version: "v1" | "v2"
  // Dims every stage except this one, for walking through the flow step by step.
  highlight?: CapsuleStage
  // Walkthrough mode, overriding `highlight`: stages before `stage` stay
  // solid, `stage` itself is outlined, later ones are dimmed. During the
  // contribution period, `memories` sets how many "+ memory" chips are lit.
  progress?: { stage: CapsuleStage; memories: number }
  // Drops the backdrop box, for sitting directly on the page (e.g. pinned
  // above other media blocks, where a second box would stack on theirs).
  bare?: boolean
  caption?: string
}

type StepState = "past" | "current" | "future" | "plain" | "dim"

const MEMORY_COLORS = ["#D63E8C", "#7C5CE0", "#3B97D6"]

const TRANSITION = "transition-[opacity,border-color,box-shadow] duration-slow ease-out"

const stateClass = (state: StepState) => (state === "future" || state === "dim" ? "opacity-30" : "")

// Same 3px accent glow on whichever box is current.
const CURRENT_RING = "border-[var(--cs-accent)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--cs-accent)_14%,transparent)]"

function Box({ children, state }: { children: React.ReactNode; state: StepState }) {
  return (
    <div
      className={`shrink-0 rounded-[6px] border bg-white px-3 py-2 text-sm leading-[1.2] text-neutral-800 ${TRANSITION} ${
        state === "current" ? CURRENT_RING : "border-neutral-200 shadow-[0_1px_2px_rgba(22,25,29,0.04)]"
      } ${stateClass(state)}`}
    >
      {children}
    </div>
  )
}

function Arrow({ dashed, label, state = "plain" }: { dashed?: boolean; label?: string; state?: StepState }) {
  return (
    <div className={`relative flex min-w-6 flex-1 items-center ${TRANSITION} ${stateClass(state)}`} aria-hidden="true">
      <div className={`h-0 flex-1 border-t ${dashed ? "border-dashed" : ""} border-neutral-400`} />
      <div className="h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-neutral-400" />
      {label && (
        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-[13px] text-neutral-500">{label}</span>
      )}
    </div>
  )
}

export function CapsuleFlow({ version, highlight, progress, bare, caption }: CapsuleFlowProps) {
  const stateOf = (stage: CapsuleStage): StepState => {
    if (progress) {
      const diff = STAGE_ORDER.indexOf(stage) - STAGE_ORDER.indexOf(progress.stage)
      return diff < 0 ? "past" : diff === 0 ? "current" : "future"
    }
    return highlight !== undefined && highlight !== stage ? "dim" : "plain"
  }
  // Chips light one per memory added during the contribution period and stay
  // lit once it's over; outside walkthrough mode they're always lit.
  const chipLit = (i: number) => {
    if (!progress) return true
    const stage = STAGE_ORDER.indexOf(progress.stage)
    return stage > 1 || (stage === 1 && i < progress.memories)
  }

  return (
    <figure className="w-full">
      {caption && <figcaption className="mb-2 text-[13px] leading-[1.5] text-neutral-400 italic">{caption}</figcaption>}
      <div
        className={`flex w-full items-center justify-center overflow-x-auto ${
          bare ? "pt-2 pb-10" : "rounded-[8px] border border-media-stroke bg-neutral-75 px-4 pt-8 pb-12 sm:px-8"
        }`}
      >
        <div className="flex w-full max-w-[560px] items-center">
          <Box state={stateOf("setup")}>{version === "v1" ? "Create capsule" : "Set up capsule"}</Box>
          {version === "v1" ? (
            <div className="flex min-w-20 flex-1 px-1">
              <Arrow dashed label="Wait" />
            </div>
          ) : (
            <>
              <Arrow state={stateOf("contribute")} />
              <div className={`relative shrink-0 ${TRANSITION} ${stateClass(stateOf("contribute"))}`}>
                <div
                  className={`flex gap-2 rounded-[6px] border bg-white px-2.5 py-2 text-[13px] leading-[1.2] ${TRANSITION} ${
                    stateOf("contribute") === "current" ? CURRENT_RING : "border-neutral-300"
                  }`}
                >
                  {MEMORY_COLORS.map((color, i) => (
                    <span
                      key={i}
                      style={{ color }}
                      className={`whitespace-nowrap ${TRANSITION} ${chipLit(i) ? "" : "opacity-30"} ${
                        // Narrow screens only have room for one chip.
                        i > 0 ? "max-sm:hidden" : ""
                      }`}
                    >
                      + memory
                    </span>
                  ))}
                </div>
                <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[13px] text-neutral-500">
                  Contribution period
                </span>
              </div>
              <Arrow state={stateOf("open")} />
            </>
          )}
          <Box state={stateOf("open")}>Open the capsule</Box>
        </div>
      </div>
    </figure>
  )
}
