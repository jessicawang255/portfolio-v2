import Link from "next/link"
import Image from "next/image"
import type { StaticImageData } from "next/image"
import { projects } from "@/content/work"
import { ArrowUpRight, Separator } from "@/components/ui/CaseStudyCard"

type Props = {
  currentSlug: string
}

// Rendered inline inside CaseStudyLayout's content column (cs-header-content),
// after {children} — inherits that column's width/alignment rather than
// defining its own, so it lines up exactly with the case study body above it.
export async function MoreCaseStudies({ currentSlug }: Props) {
  const others = projects.filter((p) => p.slug !== currentSlug)
  if (others.length === 0) return null

  // Same per-slug lazy-loading pattern as the hero background in
  // app/work/[slug]/page.tsx — falls back to the project's flat color when a
  // case study doesn't have a hero image yet.
  const rows = await Promise.all(
    others.map(async (project) => {
      let heroImg: StaticImageData | null = null
      try {
        const mod = await import(`@/content/case-studies/hero/${project.slug}-hero.png`)
        heroImg = mod.default
      } catch {
        // No hero image for this case study yet
      }
      return { project, heroImg }
    })
  )

  return (
    <div className="mt-20">
      <hr className="border-divider" />

      <p className="mt-10 mb-4 font-mono text-sm uppercase leading-[1.2] text-neutral-400">
        More Case Studies
      </p>

      <div className="flex flex-col">
        {rows.map(({ project, heroImg }) => {
          const { slug, title, name, status, bg } = project
          const isGradient = bg.startsWith("linear-gradient")
          const bgStyle = isGradient ? { background: bg } : { backgroundColor: bg }

          return (
            <Link
              key={slug}
              href={`/work/${slug}`}
              // Same row-hover language as JourneyRow/SongRow in AboutContent:
              // full-bleed background on hover, instant on enter (duration-0),
              // eased back out on leave (duration-150).
              className="group -mx-3 flex items-center justify-between gap-6 border-x border-x-transparent border-y border-y-transparent px-3 py-4 outline-none transition-colors duration-150 hover:border-y-neutral-900/3 hover:bg-neutral-75 hover:duration-0 focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="flex min-w-0 items-center gap-6">
                {/* Scales down 100x60 -> 95x57, anchored at its own center —
                    the title stays put rather than shifting with it. */}
                <div
                  className="relative h-[60px] w-[100px] shrink-0 overflow-hidden rounded-base transition-[scale] duration-200 group-hover:scale-95"
                  style={bgStyle}
                >
                  {heroImg && (
                    <Image src={heroImg} alt="" fill className="object-contain" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-medium leading-[1.4] text-neutral-800">
                    {title}
                  </h3>
                  <p className="mt-1 font-mono text-sm text-neutral-300">
                    {name}
                    {name && status && <Separator className="mx-1.5">•</Separator>}
                    {status}
                  </p>
                </div>
              </div>

              <span
                className="hidden shrink-0 items-center leading-none text-neutral-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100 sm:flex"
                aria-hidden="true"
              >
                <ArrowUpRight />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
