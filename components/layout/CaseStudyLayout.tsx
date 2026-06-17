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
    <main className="relative z-10 flex-1 flex flex-col gap-6 bg-chrome">
      <CaseStudyRadiusController />
      {/* ── Hero ── */}
      <section
        id="cs-hero"
        className="w-full rounded-[48px] overflow-hidden"
        style={{ minHeight: "64vh", ...bgStyle }}
      >
        <div className="container-main flex flex-col h-full pt-12 pb-16" style={{ minHeight: "inherit" }}>
          <p className="text-lg font-bold uppercase tracking-widest text-primary/40 select-none">
            Placeholder Thumbnail
          </p>

          {image && (
            <div className="flex-1 flex items-center justify-center mt-8">
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
      </section>

      {/* ── Content card ── */}
      <section id="cs-content" className="bg-surface rounded-t-[48px]">

        {/* Project header */}
        <div className="cs-header-content container-main pt-16 pb-0 px-16">
          <p className="text-base font-medium mb-4.5 uppercase text-subtle">{name}</p>
          <h1 className="text-[2.25rem] font-semibold text-primary leading-tight w-full">
            {title}
          </h1>

          {/* Metadata row */}
          {metaFields.length > 0 && (
            <div className="flex flex-wrap gap-x-12 gap-y-4 mt-16">
              {metaFields.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-sm font-medium text-subtle mb-1">
                    {label}
                  </p>
                  <p className="text-[15px] text-secondary">{value}</p>
                </div>
              ))}
            </div>
          )}

          <hr className="mt-10 border-divider" />
        </div>

        {/* Two-column layout: TOC rail + content */}
        <div className="container-main flex px-16">
          {/* Sticky TOC rail */}
          <aside className="w-60 shrink-0 sticky top-16 self-start mt-16 pb-16">
          <Link
              href="/"
              className="flex items-center gap-1 text-base text-subtle font-normal hover:text-accent transition-colors duration-75 mb-8"
            >
              <ChevronLeft />
              Back
            </Link>

            <TableOfContents sections={toc} />
          </aside>

          {/* MDX content */}
          <div className="flex-1 min-w-0 p-16">
            {children}
          </div>
        </div>
      </section>
    </main>
  )
}
