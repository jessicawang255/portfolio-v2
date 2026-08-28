import Link from "next/link"
import type { Project } from "@/content/work"
import { TableOfContents } from "@/components/ui/TableOfContents"
import { MoreCaseStudies } from "@/components/ui/MoreCaseStudies"
import { ScrollRevealController } from "@/components/layout/ScrollRevealController"
import { CaseStudyHero } from "@/components/layout/CaseStudyHero"
import { DefaultHeroBackground } from "@/components/layout/DefaultHeroBackground"
import { CaseStudyMeta, type MetaField } from "@/components/layout/CaseStudyMeta"

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

  const metaFieldCandidates: { label: string; value: string | string[] | undefined }[] = [
    { label: "Role",     value: role },
    { label: "Timeline", value: timeline },
    { label: "Team",     value: team },
    { label: "Skills",   value: skills },
  ]
  const metaFields = metaFieldCandidates.filter((f): f is MetaField => Boolean(f.value))

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
        <ScrollRevealController frameId="cs-content" heroId="cs-hero-content" heroFrameId="cs-hero-frame" />

        {/* Hero — pinned to the viewport from `md` up (see CaseStudyHero), so
            #cs-content can visually slide up and cover it, same as
            #main-frame covers Work/About's hero. Background stays fully
            static; only the foreground screenshot (HeroForeground) fades +
            scales as it's covered — see ScrollRevealController. Below `md`
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
        {/* box-shadow lives on #cs-content itself (globals.css) — see the
            comment on #main-frame there for why it's not a separate layer. */}
        <section
          id="cs-content"
          className="relative bg-surface"
          data-accent={accent}
          style={{
            zIndex: 10,
            marginTop: "calc(-1 * var(--radius-frame))",
            borderTopLeftRadius:  "var(--radius-frame)",
            borderTopRightRadius: "var(--radius-frame)",
          }}
        >
          {/* The content column is truly centered (mx-auto, equal margins on
              both sides) from `xl` (1152px, see globals.css) up — same as
              it's always been. Below that, down to `md`, is a squeezed tablet
              zone the original symmetric split never accounted for: it
              reserved an identical, unused block of whitespace on the right
              (mirroring the TOC's left-side space) at *every* width, which
              starves the column exactly where it can least afford it — a
              ~900px viewport was down to a ~270px column. Between `md` and
              `xl` the column instead gets a plain left margin (just the
              TOC + gap) and eats every remaining pixel, no mirrored margin —
              then `xl`+ reverts to the original centered treatment, since
              by then the symmetric column is already comfortable on its own.
              This does mean a real jump at 1152px (content suddenly loses
              the right-hand space it had a pixel below) rather than a smooth
              taper — deliberate: interpolating the two would need a
              continuous width formula instead of a breakpoint, and the seam
              only ever lands on an already-workable column on both sides of
              it (~800px just below, ~520px just above) rather than back in
              badly-squeezed territory. */}
          <div className="container-main">
            {/* min(...) guarantees the column's left margin never drops below
                16rem in the `md`–`xl` tablet tier (17.5rem again at
                `xl`+, see the aside's own left offset below) — otherwise
                the TOC gets pushed off-screen to the left on any viewport
                narrower than max-w + that margin. Only applied from `md` up
                — below that there's no TOC to reserve space for, and a
                positive left margin goes negative on narrow viewports,
                collapsing the whole column.
                The tablet tier's TOC↔content gap is tighter than `xl`+'s
                (16rem vs. 17.5rem, i.e. 16px vs. 40px between the TOC's own
                w-60 and the column) — this tier is already reclaiming space
                from the old mirrored right-margin bug, so the gap itself can
                afford to give a little more of that space to the column too,
                rather than sitting at the same width the roomier desktop
                tier uses. */}
            <div className="relative max-w-full md:ml-[16rem] md:max-w-[calc(100%-16rem)] xl:mx-auto xl:max-w-[min(120rem,calc(100%-35rem))]">
              <aside className="absolute top-0 h-full w-60 left-[-17.5rem] md:left-[-16rem] xl:left-[-17.5rem]">
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

              {/* max-w-[120rem] above caps the content column — tune it freely, it never affects the TOC's own w-60 */}
              <div className="cs-header-content pt-9 pb-16">
                <p className="font-mono text-sm uppercase leading-[1.2] text-neutral-400 mb-4.5">{name}</p>
                <h1 className="text-balance text-4xl font-medium text-primary leading-[1.2] w-full">
                  {title}
                </h1>

                <CaseStudyMeta fields={metaFields} />

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
