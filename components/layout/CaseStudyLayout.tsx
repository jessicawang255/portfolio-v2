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
  // `heroAspectRatio` export) — sizes the hero container to the image's
  // real proportions. Undefined when there's no custom hero image.
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
// DefaultHeroBackground color/gradient, no intrinsic proportions).
const FALLBACK_HERO_HEIGHT = "65vh"

// Extra height on the fixed background container only (see CaseStudyHero's
// `height` vs `spacerHeight`) — a buffer during the scroll-peel so the
// background doesn't run out from behind the frame's rounding top corner
// right before the reveal finishes. Not visible at rest: #cs-content covers
// this sliver.
const HERO_BG_EXTRA = 80

export function CaseStudyLayout({ project, children, heroBackground, heroAspectRatio }: Props) {
  const { title, name, role, timeline, team, skills, accent, toc = [] } = project

  const HeroBackground = heroBackground ?? DefaultHeroBackground

  // The hero foreground image renders at `w-full` inside a full-viewport-width
  // container (see HeroForeground/CaseStudyHero), so its real rendered height
  // is always `100vw / aspectRatio`. Falls back to a flat vh guess when
  // there's no image (see FALLBACK_HERO_HEIGHT).
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
          Bottom pill nav takes over below `sm`. */}
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
            #main-frame covers Work/About's hero. Background stays static;
            only the foreground screenshot (HeroForeground) fades + scales as
            it's covered — see ScrollRevealController. Below `md` the hero
            stays in normal static flow with no covering effect. */}
        <CaseStudyHero
          height={`calc(${HERO_HEIGHT} + ${HERO_BG_EXTRA}px)`}
          // #cs-content pulls itself up by `-var(--radius-frame)` (see its
          // own marginTop below) so its rounded corner nests against the
          // hero — spacerHeight gives that same amount back so the pull-up
          // bites into slack space above the image, not the image itself.
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
          {/* Content column is centered (mx-auto, equal margins) from `xl`
              (1152px) up. Between `md` and `xl` it instead gets a plain left
              margin (TOC + gap) and eats all remaining width, rather than
              also mirroring that space on the right — a symmetric split
              would starve the column on tablet widths. This is a hard jump
              at 1152px rather than a smooth taper, by design: the seam lands
              on an already-workable column width on both sides of it. */}
          <div className="container-main">
            {/* min(...) keeps the column's left margin from dropping below
                16rem in the `md`–`xl` tablet tier (17.5rem at `xl`+, matching
                the aside's own left offset below) — otherwise the TOC gets
                pushed off-screen on any viewport narrower than max-w + that
                margin. Only applied from `md` up, since below that there's
                no TOC to reserve space for. */}
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
                <p className="font-mono text-sm uppercase leading-[1.2] text-neutral-400 mb-6">{name}</p>
                <h1 className="text-balance text-4xl lg:text-5xl font-medium text-primary leading-[1.2] lg:leading-[1.1] lg:tracking-[-0.0125em] w-full">
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
