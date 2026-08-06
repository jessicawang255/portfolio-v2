// Mirrors HeroShell.tsx's fixed/static split for Work/About: from `sm` up,
// the hero (background + foreground both, as `children`) pins to the
// viewport — removed from flow — so #cs-content can visually slide up and
// cover it, the same "frame scrolls over hero" effect Work/About gets from
// #main-frame. A spacer of the same height reserves its place in the flow
// so #cs-content still lands in the right spot.
//
// Below `sm`, the hero stays in normal static flow instead (matching
// HeroShell's mobile behavior) — no covering effect there, so no spacer is
// needed either. `height` also only applies from `sm` up there: below it,
// the container is left at its natural (auto) height, which the foreground
// screenshot's own in-flow height determines (see HeroForeground) and the
// absolutely-positioned background matches — so #cs-content's frame butts
// straight up against the bottom of the hero image instead of leaving the
// fixed vh-based height's leftover space beneath it.
//
// Unlike HeroShell, `height` is a deterministic prop (a fixed vh-based
// formula, not organic text content), so the spacer can be sized with a
// plain CSS calc() instead of HeroShell's ResizeObserver measurement.
type Props = {
  height: string
  children: React.ReactNode
}

export function CaseStudyHero({ height, children }: Props) {
  return (
    <>
      <div
        className="static sm:fixed inset-x-0 top-0 overflow-hidden mt-[calc(-1*var(--nav-height))] sm:mt-0 h-auto sm:h-[var(--cs-hero-height)]"
        style={{ zIndex: 5, ["--cs-hero-height" as string]: height }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        style={{ height: `calc(${height} - var(--nav-height))` }}
        className="hidden sm:block"
      />
    </>
  )
}
