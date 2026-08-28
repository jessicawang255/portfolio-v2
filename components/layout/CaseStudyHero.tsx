// Mirrors HeroShell.tsx's fixed/static split for Work/About: from `sm` up —
// the site's chrome breakpoint, see --breakpoint-sm in globals.css — the
// hero (background + foreground both, as `children`) pins to the
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
// fixed vh-based height's leftover space beneath it. Deliberately not `md`:
// this switch is the hero's own peel mechanic, a different concern from how
// the content inside #cs-content is laid out.
//
// Unlike HeroShell, `height`/`spacerHeight` are deterministic props (CSS
// calc() formulas, not organic text content), so the spacer can be sized
// with a plain calc() instead of HeroShell's ResizeObserver measurement.
type Props = {
  // The *fixed background container's* own height — taller than
  // `spacerHeight` by the scroll-peel buffer (see CaseStudyLayout's
  // HERO_BG_EXTRA). Being `position: fixed`, this container is out of flow
  // entirely, so its extra height costs nothing visually at rest — #cs-
  // content (higher z-index) simply covers that extra sliver until the user
  // scrolls, at which point it's there so the background doesn't run out
  // from behind the frame's still-peeling corner.
  height: string
  // Where #cs-content actually rests in flow — the hero image's own real
  // height, no buffer added, so the frame's top edge lands flush against
  // the bottom of the visible hero image instead of leaving a gap.
  spacerHeight: string
  children: React.ReactNode
}

export function CaseStudyHero({ height, spacerHeight, children }: Props) {
  return (
    <>
      {/* id="cs-hero-frame" + pointer-events-none: this box is purely
          decorative (background + foreground screenshot, nothing
          interactive), but with neither of those it was a real hazard —
          being `position: fixed`, it's *always* present at this viewport
          position, whether or not #cs-content currently covers it, and
          without pointer-events-none it silently intercepted clicks meant
          for whatever sat beneath it (the footer's own links, in the exact
          overlap case below) even where it was invisible-looking to the eye.
          pointer-events-none fixes that unconditionally, at any scroll
          position. The id lets ScrollRevealController also force
          visibility:hidden on it once #cs-content is guaranteed to have
          fully covered it (see the `p >= 1` check there) — needed because,
          unlike the foreground image (#cs-hero-content, faded/scaled below),
          this outer box's background never fades on its own, so on a short
          viewport where this box's height runs past the gap above the
          footer, its background could otherwise paint straight over it. */}
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
