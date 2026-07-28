import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/content/work"
import type { ReactNode } from "react"

type Props = {
  project: Project
  // Explicit [width, height] box ratio for cards without a real thumbnail
  // image (bento layout on the home page). Overrides thumbnailWidth/Height.
  imageRatio?: [number, number]
}

export function ArrowUpRight() {
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

export function Separator({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-subtle ${className}`} aria-hidden="true">
      {children}
    </span>
  )
}

export function CaseStudyCard({ project, imageRatio }: Props) {
  const { slug, title, name, status, disciplines, bg, thumbnail, thumbnailWidth, thumbnailHeight, href } = project

  const isGradient = bg.startsWith("linear-gradient")
  const bgStyle = isGradient ? { background: bg } : { backgroundColor: bg }
  const isVideo = thumbnail?.endsWith(".mp4") || thumbnail?.endsWith(".webm")
  const hasMetadata = name || status || (disciplines && disciplines.length > 0)
  const isExternal = Boolean(href)

  // With no explicit imageRatio, size the box to the thumbnail's own aspect
  // ratio instead of forcing a uniform crop — lets Discover More's bento
  // layout follow each asset's natural dimensions.
  const usesThumbnailRatio = !imageRatio && thumbnailWidth && thumbnailHeight
  const ratio = imageRatio ?? (usesThumbnailRatio ? [thumbnailWidth!, thumbnailHeight!] : undefined)

  // aspect-ratio (not a pixel height) so the box scales proportionally with
  // its fluid grid-column width instead of stretching width while height
  // stays fixed.
  const thumbStyle = {
    ...(ratio ? { aspectRatio: `${ratio[0]} / ${ratio[1]}` } : {}),
    borderRadius: 16,
    ...bgStyle,
  }

  return (
    <article className="case-study-card">
      <Link
        href={href ?? `/work/${slug}`}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="flex flex-col gap-4 sm:gap-3 rounded-[--radius-xl] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      >
        {/* Thumbnail — card-thumb-fixed always applies so every card is the
            same height on mobile (below `sm`, height is fixed at 200px; at
            `sm` and up it defers to the aspect-ratio set in thumbStyle so
            the box scales proportionally instead of stretching). */}
        <div
          className="card-thumb card-thumb-fixed relative w-full overflow-hidden"
          style={thumbStyle}
        >
          {thumbnail && isVideo && (
            <video
              src={thumbnail}
              autoPlay
              loop
              muted
              playsInline
              className={
                usesThumbnailRatio
                  ? "absolute inset-0 h-full w-full object-cover sm:object-contain"
                  : "absolute inset-0 h-full w-full object-cover"
              }
            />
          )}
          {thumbnail && !isVideo && (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className={
                usesThumbnailRatio
                  ? "object-cover sm:object-contain"
                  : "object-cover"
              }
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        {/* Text block */}
        <div className="card-text flex flex-col gap-0 sm:gap-1 px-0 sm:px-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-medium leading-[1.4] text-neutral-800">
              {title}
            </h3>
            {/* Hover-reveal arrow — desktop only (see `hover: hover` gate in
                globals.css); dropped on mobile since there's no hover to reveal it. */}
            <span className="card-arrow hidden shrink-0 leading-none text-neutral-400 sm:inline" aria-hidden="true">
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
