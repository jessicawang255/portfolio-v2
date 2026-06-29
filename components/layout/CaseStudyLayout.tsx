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
  const { title, name, role, timeline, team, skills, bg, image, toc = [] } = project

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
          style={{
            zIndex: 10,
            marginTop: "calc(-1 * var(--radius-frame))",
            borderTopLeftRadius:  "var(--radius-frame)",
            borderTopRightRadius: "var(--radius-frame)",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.07)",
          }}
        >
          {/* TOC rail + content (title/meta inline with TOC) */}
          <div className="container-main flex gap-16">
            <aside className="w-60 shrink-0 sticky top-0 self-start pt-12 pb-16">
              <Link
                href="/"
                className="flex items-center gap-1 text-base text-subtle font-normal hover:text-accent transition-colors duration-75 mb-8"
              >
                <ChevronLeft />
                Back
              </Link>
              <TableOfContents sections={toc} />
            </aside>

            <div className="cs-header-content flex-1 min-w-0 pt-12 pb-16 pr-60">
              <p className="text-base font-medium mb-4.5 uppercase text-subtle">{name}</p>
              <h1 className="text-[1.875rem] font-medium text-primary leading-tight w-full">
                {title}
              </h1>

              {metaFields.length > 0 && (
                <div className="flex flex-wrap gap-x-12 gap-y-4 mt-9">
                  {metaFields.map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-sm text-neutral-300 mb-1">{label}</p>
                      <p className="text-base text-neutral-500">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              <hr className="mt-10 border-divider" />

              {children}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
