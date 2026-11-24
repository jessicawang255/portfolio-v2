"use client"

import { useEffect, useRef, useState } from "react"
import { Callout } from "./Callout"
import { CapsuleFlow, type CapsuleStage } from "./CapsuleFlow"
import { PhoneVideo } from "./PhoneVideo"

type Clip = { src: string; alt: string; title: string; body: string }

type Step = {
  stage: CapsuleStage
  label: string
  heading: string
  body: string
  clips: Clip[]
}

// Where in the viewport a clip counts as "the one you're looking at" —
// slightly below center, since the pinned flow covers the top.
const FOCUS_LINE = 0.55

// The capsule flow pins to the top of the column and fills in as the
// recordings scroll past beneath it: earlier stages stay solid, the current
// one is outlined, later ones stay dimmed, and each contribution-period clip
// lights one more "+ memory" chip.
export function FlowWalkthrough({ steps }: { steps: Step[] }) {
  const [progress, setProgress] = useState<{ stage: CapsuleStage; memories: number }>({
    stage: steps[0].stage,
    memories: 0,
  })
  const clipRefs = useRef<(HTMLDivElement | null)[]>([])

  // Flattened once so each clip ref knows its stage and position within it.
  const clips = steps.flatMap((step) => step.clips.map((clip, i) => ({ ...clip, stage: step.stage, index: i })))

  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const focus = window.innerHeight * FOCUS_LINE
      let best = -1
      let bestDistance = Infinity
      clipRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const distance = Math.abs(rect.top + rect.height / 2 - focus)
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      })
      if (best === -1) return
      const clip = clips[best]
      setProgress((prev) =>
        prev.stage === clip.stage && prev.memories === clip.index + 1
          ? prev
          : { stage: clip.stage, memories: clip.index + 1 }
      )
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
    // clips is derived from steps, which is static content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps])

  let clipIndex = 0

  return (
    <div className="relative w-full">
      {/* Solid white so clips scroll cleanly underneath, cut off at the divider. */}
      <div className="sticky top-0 z-[5] bg-surface pt-6">
        <div className="border-b border-divider">
          <CapsuleFlow version="v2" progress={progress} bare />
        </div>
      </div>

      <div className="flex flex-col gap-16 pt-10">
        {steps.map((step) => (
          <div key={step.stage} className="flex flex-col gap-7">
            <Callout label={step.label} heading={step.heading} body={step.body} />
            <div className="flex flex-col gap-6">
              {step.clips.map((clip) => {
                const i = clipIndex++
                return (
                  <div
                    key={clip.src}
                    ref={(el) => {
                      clipRefs.current[i] = el
                    }}
                    className="grid grid-cols-1 items-end gap-4 md:grid-cols-[3fr_2fr] md:gap-8"
                  >
                    <div className="flex justify-center rounded-[8px] border border-media-stroke bg-neutral-75 px-6 py-10">
                      <PhoneVideo src={clip.src} alt={clip.alt} className="max-w-[220px]" />
                    </div>
                    <div className="min-w-0 md:pb-2">
                      <h3 className="text-base font-medium leading-[1.4] text-neutral-800">{clip.title}</h3>
                      <p className="mt-1 text-pretty text-base leading-normal text-neutral-600">{clip.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
