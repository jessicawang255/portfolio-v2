import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/content/work"
import { TableOfContents } from "@/components/ui/TableOfContents"
import { CaseStudyRadiusController } from "@/components/layout/CaseStudyRadiusController"

type Props = {
  project: Project
  children: React.ReactNode
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
  { label: "Resume", href: "/resume.pdf", target: "_blank" },
]

// Hero occupies 65vh of the viewport. The spacer below accounts for the
// body's padding-top (nav-height) so the content card aligns to the hero bottom.
const HERO_HEIGHT = "65vh"

export function CaseStudyLayout({ project, children }: Props) {
  const { title, name, role, timeline, team, skills, bg, accent, image, toc = [] } = project

  const isGradient = bg.startsWith("linear-gradient")
  const bgStyle = isGradient ? { background: bg } : { backgroundColor: bg }

  const metaFields = [
    { label: "Role",     value: role },
    { label: "Timeline", value: timeline },
    { label: "Team",     value: team },
    { label: "Skills",   value: skills },
  ].filter(f => f.value)

  return (
    <>
      {/* Transparent nav overlay — above hero (z:5), below content card (z:10) */}
      <header className="fixed inset-x-0 top-0 pointer-events-none" style={{ zIndex: 6 }}>
        <nav
          className="container-chrome flex items-center justify-between py-4 pointer-events-auto"
          aria-label="Primary navigation"
        >
          <Link
            href="/"
            className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-75"
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
                  className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-75"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        <CaseStudyRadiusController />

        {/* Hero — fixed, starts at viewport top, sits above root nav (z-0) */}
        <div
          className="fixed inset-x-0 top-0"
          style={{ zIndex: 5, height: HERO_HEIGHT, ...bgStyle }}
        >
          {image && (
            <div className="flex items-center justify-center h-full">
              <div className="relative w-full max-w-2xl" style={{ height: 340 }}>
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
            </div>
          )}
        </div>

        {/* Spacer — body has padding-top: nav-height (56px) so the first in-flow
            element starts at viewport y=56px. We need the content card to start
            at viewport y=65vh, so spacer height = 65vh - 56px. */}
        <div
          aria-hidden="true"
          style={{ height: `calc(${HERO_HEIGHT} - var(--nav-height))` }}
        />

        {/* Content card — scrolls over the fixed hero as user scrolls */}
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
                to the left on any viewport narrower than max-w + 2*17.5rem. */}
            <div className="relative mx-auto max-w-[min(100rem,calc(100%-35rem))]">
              <aside className="absolute top-0 h-full w-60 left-[-17.5rem]">
                <div className="sticky top-0 pt-12 pb-16">
                  <Link
                    href="/"
                    className="flex items-center gap-1 text-base text-subtle font-normal hover:text-[var(--cs-accent)] transition-colors duration-75 mb-8"
                  >
                    <ChevronLeft />
                    Back
                  </Link>
                  <TableOfContents sections={toc} />
                </div>
              </aside>

              {/* max-w-[100rem] above caps the content column — tune it freely, it never affects the TOC's own w-60 */}
              <div className="cs-header-content pt-12 pb-16">
                <p className="font-mono text-sm uppercase leading-[1.2] text-neutral-500 mb-4.5">{name}</p>
                <h1 className="text-4xl font-medium text-primary leading-[1.2] w-full">
                  {title}
                </h1>

                {metaFields.length > 0 && (
                  <div className="flex flex-wrap gap-x-14 gap-y-4 mt-9">
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
