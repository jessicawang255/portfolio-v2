import Link from "next/link"
import type { Project } from "@/content/work"
import { TableOfContents } from "@/components/ui/TableOfContents"
import { MoreCaseStudies } from "@/components/ui/MoreCaseStudies"
import { ScrollRevealController } from "@/components/layout/ScrollRevealController"
import { CaseStudyHero } from "@/components/layout/CaseStudyHero"
import { DefaultHeroBackground } from "@/components/layout/DefaultHeroBackground"

type Props = {
  project: Project
  children: React.ReactNode
  // Per-case-study hero background — a static gradient, an image, a canvas
  // with mouse-driven noise, whatever the case study calls for. Falls back
  // to a plain color/gradient when a case study doesn't define one.
  heroBackground?: React.ComponentType<{ project: Project }> | null
  // The hero foreground image's width/height ratio (see hero/*.tsx's
  // `heroAspectRatio` export) — sizes the hero container to that image's
  // real proportions instead of a fixed vh guess, see HERO_HEIGHT below.
  // Undefined when a case study has no custom hero image to size against.
  heroAspectRatio?: number
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M9 11L5 7L9 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const navLinks: { label: string; href: string; target?: string }[] = [
  { label: "Work",   href: "/" },
  { label: "About",  href: "/about" },
  { label: "Resume", href: "/JessicaWang_Resume.pdf", target: "_blank" },
]

// Fallback when a case study has no hero image to size against (plain
// DefaultHeroBackground color/gradient, no intrinsic proportions) — a flat
// 65vh guess, same as every case study used before heroAspectRatio existed.
const FALLBACK_HERO_HEIGHT = "65vh"

// Extra height on the *fixed background container only* (see CaseStudyHero's
// `height` vs `spacerHeight`) — not visible at rest, since #cs-content sits
// flush against the hero image's real height and simply covers this sliver.
// It exists purely as a buffer during the scroll-peel: without it, the
// background would run out from behind the frame's still-rounding top
// corner right before the reveal finishes, showing a flash of empty space.
const HERO_BG_EXTRA = 80

export function CaseStudyLayout({ project, children, heroBackground, heroAspectRatio }: Props) {
  const { title, name, role, timeline, team, skills, accent, toc = [] } = project

  const HeroBackground = heroBackground ?? DefaultHeroBackground

  // The hero foreground image renders at `w-full` inside a full-viewport-width
  // container (see HeroForeground/CaseStudyHero), so its real rendered height
  // is always `100vw / aspectRatio` — a plain CSS calc, re-evaluated on every
  // resize exactly like the old 65vh was, so it tracks width shrinking even
  // when viewport height doesn't change (65vh alone never would). Falls back
  // to the flat vh guess when there's no image (see FALLBACK_HERO_HEIGHT).
  const HERO_HEIGHT = heroAspectRatio
    ? `calc(100vw / ${heroAspectRatio})`
    : FALLBACK_HERO_HEIGHT

  const metaFields = [
    { label: "Role",     value: role },
    { label: "Timeline", value: timeline },
    { label: "Team",     value: team },
    { label: "Skills",   value: skills },
  ].filter(f => f.value)

  return (
    <>
      {/* Transparent nav overlay — above hero (z:5), below content card (z:10).
          Below `sm`, the bottom pill nav takes over — no top bar to show. */}
      <header className="fixed inset-x-0 top-0 hidden pointer-events-none sm:block" style={{ zIndex: 6 }}>
        <nav
          className="container-chrome flex items-center justify-between py-4 pointer-events-auto"
          aria-label="Primary navigation"
        >
          <Link
            href="/"
            className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-150"
          >
            Jessica Wang
          </Link>
          <ul className="flex items-center gap-7 list-none m-0 p-0">
            {navLinks.map(({ label, href, target }) => (
              <li key={label}>
                <Link
                  href={href}
                  target={target}
                  rel={target === "_blank" ? "noopener noreferrer" : undefined}
                  className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-150"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        <ScrollRevealController frameId="cs-content" heroId="cs-hero-content" />

        {/* Hero — pinned to the viewport from `sm` up (see CaseStudyHero), so
            #cs-content can visually slide up and cover it, same as
            #main-frame covers Work/About's hero. Background stays fully
            static; only the foreground screenshot (HeroForeground) fades +
            scales as it's covered — see ScrollRevealController. Below `sm`
            the hero stays in normal static flow instead, with no covering
            effect. Background + foreground are both owned by the
            per-case-study hero component (whatever it renders: gradient,
            image, canvas, plus its own foreground screenshot if any). */}
        <CaseStudyHero
          height={`calc(${HERO_HEIGHT} + ${HERO_BG_EXTRA}px)`}
          // #cs-content pulls itself up by `-var(--radius-frame)` (see its
          // own marginTop below) so its rounded corner nests against the
          // hero instead of leaving a hard seam — spacerHeight has to give
          // that same amount back, or the pull-up bites into the image
          // itself instead of into slack space above it.
          spacerHeight={`calc(${HERO_HEIGHT} + var(--radius-frame))`}
        >
          <HeroBackground project={project} />
        </CaseStudyHero>

        {/* Content card — its top corners round off as it slides up over the
            fixed hero (see ScrollRevealController); the hero fades + scales
            in place as it's covered, matching Work/About. */}
        <section
          id="cs-content"
          className="relative bg-surface"
          data-accent={accent}
          style={{
            zIndex: 10,
            marginTop: "calc(-1 * var(--radius-frame))",
            borderTopLeftRadius:  "var(--radius-frame)",
            borderTopRightRadius: "var(--radius-frame)",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.07)",
          }}
        >
          {/* The content column is truly centered (mx-auto) — its margins are
              always equal, at any max-width. The TOC lives in the left
              margin: it's absolutely positioned outside the column's own
              left edge (left-[-17.5rem] = its w-60 + the gap), so it never
              factors into the column's width or centering math at all. */}
          <div className="container-main">
            {/* min(...) guarantees the column's margin never drops below 17.5rem
                (the TOC's w-60 + gap) — otherwise the TOC gets pushed off-screen
                to the left on any viewport narrower than max-w + 2*17.5rem.
                Only applied from `sm` up — below that there's no TOC to
                reserve space for, and `calc(100% - 35rem)` goes negative on
                narrow viewports, collapsing the whole column. */}
            <div className="relative mx-auto max-w-full sm:max-w-[min(100rem,calc(100%-35rem))]">
              <aside className="absolute top-0 h-full w-60 left-[-17.5rem]">
                <div className="sticky top-0 pt-9 pb-16">
                  <Link
                    href="/"
                    className="flex items-center gap-1 text-base text-subtle font-normal hover:text-[var(--cs-accent)] transition-colors duration-150 mb-8"
                  >
                    <ChevronLeft />
                    Back
                  </Link>
                  <TableOfContents sections={toc} />
                </div>
              </aside>

              {/* max-w-[100rem] above caps the content column — tune it freely, it never affects the TOC's own w-60 */}
              <div className="cs-header-content pt-9 pb-16">
                <p className="font-mono text-sm uppercase leading-[1.2] text-neutral-400 mb-4.5">{name}</p>
                <h1 className="text-4xl font-medium text-primary leading-[1.2] w-full">
                  {title}
                </h1>

                {metaFields.length > 0 && (
                  // Below `sm`, a real 2-column grid — `flex flex-wrap` let
                  // each row's second column start wherever the first
                  // item's own content width happened to end (varies row to
                  // row: "Role" vs "Team" render at different widths), so
                  // "Timeline" and "Skills" never lined up. `grid-cols-2`'s
                  // tracks are fixed and equal-width, so every column
                  // aligns regardless of content length. Desktop's
                  // single-row flex-wrap layout is unchanged from `sm` up.
                  <div className="grid grid-cols-2 gap-x-14 gap-y-4 mt-9 sm:flex sm:flex-wrap">
                    {metaFields.map(({ label, value }) => (
                      <div key={label}>
                        <p className="font-mono text-sm text-neutral-400 mb-1">{label}</p>
                        {Array.isArray(value) ? (
                          <div className="text-base text-neutral-500">
                            {value.map((item, i) => (
                              <p key={i} className="m-0">{item}</p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-base text-neutral-500">{value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <hr className="mt-10 border-divider" />

                <div className="pt-12">
                  {children}
                </div>

                <MoreCaseStudies currentSlug={project.slug} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
