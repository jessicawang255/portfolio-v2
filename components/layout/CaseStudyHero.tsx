// Mirrors HeroShell.tsx's fixed/static split for Work/About: from `sm` up
// the hero pins to the viewport so #cs-content can slide up and cover it; a
// spacer of the same height reserves its place in flow. Below `sm` the hero
// stays static in flow — no spacer, no HERO_BG_EXTRA/radius-frame buffer.
//
// Below `lg` gets its own flat, viewport-relative height instead of the
// `lg`+ aspect-ratio formula, since the image's own proportions read as too
// short at those widths. The fixed/static pin point itself stays at `sm`
// (Footer/ScrollRevealController/Hack Western's physics sim are all keyed
// to it) — this just gives more room below `lg` for real content.
type Props = {
  // The fixed background container's own height — taller than
  // `spacerHeight` by the scroll-peel buffer (see CaseStudyLayout's
  // HERO_BG_EXTRA). Being fixed, this container is out of flow, so the
  // extra height costs nothing visually at rest.
  height: string
  // Where #cs-content actually rests in flow — the hero image's real
  // height, no buffer, so the frame's top edge lands flush against it.
  spacerHeight: string
  // `sm`–`lg` counterparts of `height`/`spacerHeight` (still fixed/out-of-flow
  // there, so they carry the same buffers).
  compactHeight: string
  compactSpacerHeight: string
  // Below `sm` only: the box is static/in-flow, so this is the plain,
  // unbuffered height — no HERO_BG_EXTRA, no radius-frame slack.
  compactFlowHeight: string
  children: React.ReactNode
}

export function CaseStudyHero({
  height,
  spacerHeight,
  compactHeight,
  compactSpacerHeight,
  compactFlowHeight,
  children,
}: Props) {
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
        // `relative`, not `static`, below `sm`: hero backgrounds size
        // themselves as a percentage of this box, which needs to be their
        // containing block. `static` let that fall through to the initial
        // containing block (~viewport height) instead of this box's real
        // ~40svh, rendering every background zoomed in.
        className="relative sm:fixed inset-x-0 top-0 overflow-hidden pointer-events-none mt-[calc(-1*var(--nav-height))] sm:mt-0 h-[var(--cs-hero-height-compact-flow)] sm:h-[var(--cs-hero-height-compact)] lg:h-[var(--cs-hero-height)]"
        style={{
          zIndex: 5,
          ["--cs-hero-height" as string]: height,
          ["--cs-hero-height-compact" as string]: compactHeight,
          ["--cs-hero-height-compact-flow" as string]: compactFlowHeight,
        }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        style={{
          ["--cs-spacer" as string]: `calc(${spacerHeight} - var(--nav-height))`,
          ["--cs-spacer-compact" as string]: `calc(${compactSpacerHeight} - var(--nav-height))`,
        }}
        className="hidden sm:block sm:h-[var(--cs-spacer-compact)] lg:h-[var(--cs-spacer)]"
      />
    </>
  )
}
