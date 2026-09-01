// Mirrors HeroShell.tsx's fixed/static split for Work/About: from `sm` up
// the hero (background + foreground, as `children`) pins to the viewport so
// #cs-content can visually slide up and cover it, the same effect
// Work/About gets from #main-frame. A spacer of the same height reserves
// its place in flow so #cs-content still lands in the right spot.
//
// Below `sm` the hero stays in normal static flow — no covering effect, so
// no spacer either — and `height` doesn't apply: the container is left at
// its natural height, driven by the foreground screenshot's in-flow height.
//
// Unlike HeroShell, `height`/`spacerHeight` are deterministic calc()
// formulas rather than organic text content, so the spacer can be sized
// directly instead of via HeroShell's ResizeObserver measurement.
type Props = {
  // The fixed background container's own height — taller than
  // `spacerHeight` by the scroll-peel buffer (see CaseStudyLayout's
  // HERO_BG_EXTRA). Being fixed, this container is out of flow, so the
  // extra height costs nothing visually at rest.
  height: string
  // Where #cs-content actually rests in flow — the hero image's real
  // height, no buffer, so the frame's top edge lands flush against it.
  spacerHeight: string
  children: React.ReactNode
}

export function CaseStudyHero({ height, spacerHeight, children }: Props) {
  return (
    <>
      {/* pointer-events-none: purely decorative, but being `position: fixed`
          it's always present at this viewport position and would otherwise
          intercept clicks meant for whatever sits beneath it (e.g. footer
          links). The id lets ScrollRevealController force visibility:hidden
          on it once #cs-content has fully covered it — this box's
          background never fades on its own, so on a short viewport it could
          otherwise paint over the footer. */}
      <div
        id="cs-hero-frame"
        className="static sm:fixed inset-x-0 top-0 overflow-hidden pointer-events-none mt-[calc(-1*var(--nav-height))] sm:mt-0 h-auto sm:h-[var(--cs-hero-height)]"
        style={{ zIndex: 5, ["--cs-hero-height" as string]: height }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        style={{ height: `calc(${spacerHeight} - var(--nav-height))` }}
        className="hidden sm:block"
      />
    </>
  )
}
