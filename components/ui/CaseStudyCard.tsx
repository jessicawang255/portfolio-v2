import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/content/work"
import type { ReactNode } from "react"

type Props = {
  project: Project
  imageHeight?: number
}

function ArrowUpRight() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        position: "relative",
        top: 2,
        width: 16,
        height: 16,
        WebkitMaskImage: "url(/icons/arrow-right-up-line.svg)",
        maskImage: "url(/icons/arrow-right-up-line.svg)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        backgroundColor: "currentColor",
      }}
    />
  )
}

function Separator({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-subtle ${className}`} aria-hidden="true">
      {children}
    </span>
  )
}

export function CaseStudyCard({ project, imageHeight }: Props) {
  const { slug, title, name, status, disciplines, bg, thumbnail, thumbnailWidth, thumbnailHeight, href } = project

  const isGradient = bg.startsWith("linear-gradient")
  const bgStyle = isGradient ? { background: bg } : { backgroundColor: bg }
  const hasMetadata = name || status || (disciplines && disciplines.length > 0)
  const isExternal = Boolean(href)

  // With no explicit imageHeight, size the box to the thumbnail's own aspect
  // ratio instead of forcing a uniform crop — lets Discover More's bento
  // layout follow each asset's natural dimensions.
  const thumbStyle =
    !imageHeight && thumbnailWidth && thumbnailHeight
      ? { aspectRatio: `${thumbnailWidth} / ${thumbnailHeight}`, borderRadius: 16, ...bgStyle }
      : ({ "--thumb-h": `${imageHeight ?? 340}px`, borderRadius: 16, ...bgStyle } as React.CSSProperties)

  return (
    <article className="case-study-card">
      <Link
        href={href ?? `/work/${slug}`}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="flex flex-col gap-4 rounded-[--radius-xl] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      >
        {/* Thumbnail */}
        <div
          className={`card-thumb relative w-full overflow-hidden ${
            !imageHeight && thumbnailWidth && thumbnailHeight ? "" : "card-thumb-fixed"
          }`}
          style={thumbStyle}
        >
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className={!imageHeight && thumbnailWidth && thumbnailHeight ? "object-contain" : "object-cover"}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        {/* Text block */}
        <div className="card-text flex flex-col gap-1 px-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-medium leading-[1.4] text-neutral-800">
              {title}
            </h3>
            <span className="card-arrow shrink-0 leading-none text-neutral-400" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </div>

          {hasMetadata && (
            <p className="font-mono text-sm text-neutral-300">
              {name}
              {name && (status || disciplines?.length) && <Separator className="mx-1.5">•</Separator>}
              {status}
              {status && disciplines?.length && <Separator className="mx-2">/</Separator>}
              {disciplines?.join(" / ")}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
