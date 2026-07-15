import { GrainOverlay } from "@/lib/heroGrain"

// Pale lavender-to-pink gradient with a dark purple-blue grain burned in for depth.
export default function HackWesternHero() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #F5E8F7 0%, #FFC7F9 100%)" }}
      />
      <GrainOverlay hex="#000000" />
    </>
  )
}
