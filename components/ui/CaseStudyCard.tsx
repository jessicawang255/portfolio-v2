import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/content/work"

type Props = {
  project: Project
  imageHeight?: number
}

function ArrowUpRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 14L14 4M14 4H7M14 4V11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CaseStudyCard({ project, imageHeight = 340 }: Props) {
  const { slug, title, org, status, disciplines, bg, image } = project

  const isGradient = bg.startsWith("linear-gradient")
  const bgStyle = isGradient ? { background: bg } : { backgroundColor: bg }

  return (
    <article className="case-study-card">
      <Link
        href={`/work/${slug}`}
        className="flex flex-col gap-4 rounded-[--radius-xl] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      >
        {/* Thumbnail */}
        <div
          className="card-thumb relative w-full overflow-hidden"
          style={{ height: imageHeight, borderRadius: 18, ...bgStyle }}
        >
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        {/* Text block */}
        <div className="card-text flex flex-col gap-1.5 px-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-extrabold leading-snug text-primary">
              {title}
            </h3>
            <span className="card-arrow shrink-0 mt-1 text-primary" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </div>

          <p className="text-sm text-muted">
            {org}
            <span className="mx-1.5">•</span>
            {status}
            <span className="mx-2 text-subtle">/</span>
            {disciplines.join(" / ")}
          </p>
        </div>
      </Link>
    </article>
  )
}
