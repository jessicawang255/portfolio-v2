import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/content/work"
import type { CSSProperties, ReactNode } from "react"

type Props = {
  project: Project
  // Explicit [width, height] box ratio for cards without a real thumbnail
  // image (bento layout on the home page). Overrides thumbnailWidth/Height.
  imageRatio?: [number, number]
  // Overrides the box ratio below `mobileBreakpoint` only (see
  // --thumb-ratio-mobile in globals.css) — lets a grid of cards with
  // different natural ratios line up to one shared ratio on mobile while
  // each card keeps its own ratio above that breakpoint.
  mobileImageRatio?: [number, number]
  // Which breakpoint releases the box back to its own ratio: `sm` (640px,
  // default — Case Studies) or `wide` (--breakpoint-discover-wide, 960px —
  // Discover More, whose 4 columns need more room before `sm` stops being
  // too narrow). Only meaningful alongside mobileImageRatio.
  mobileBreakpoint?: "sm" | "wide"
  // Where a cropped video thumbnail anchors within its box — `center`
  // (default) or `top` to keep the top of the frame intact and crop from
  // the bottom instead. No effect on images or on boxes that don't crop.
  videoPosition?: "center" | "top"
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
        width: 24,
        height: 24,
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

export function CaseStudyCard({ project, imageRatio, mobileImageRatio, mobileBreakpoint = "sm", videoPosition = "center" }: Props) {
  const { slug, title, name, status, disciplines, bg, thumbnail, thumbnailWidth, thumbnailHeight, href } = project

  const isGradient = bg.startsWith("linear-gradient")
  const bgStyle = isGradient ? { background: bg } : { backgroundColor: bg }
  const isVideo = thumbnail?.endsWith(".mp4") || thumbnail?.endsWith(".webm")
  const hasMetadata = name || status || (disciplines && disciplines.length > 0)
  const isExternal = Boolean(href)
  const isWideMobile = mobileBreakpoint === "wide"

  // With no explicit imageRatio, size the box to the thumbnail's own aspect
  // ratio instead of forcing a uniform crop — lets Discover More's bento
  // layout follow each asset's natural dimensions.
  const usesThumbnailRatio = !imageRatio && thumbnailWidth && thumbnailHeight
  const ratio = imageRatio ?? (usesThumbnailRatio ? [thumbnailWidth!, thumbnailHeight!] : undefined)

  // aspect-ratio (not a pixel height) so the box scales proportionally with
  // its fluid grid-column width instead of stretching width while height
  // stays fixed. Set as CSS custom properties rather than `aspectRatio`
  // directly so globals.css can swap in `--thumb-ratio-mobile` below `sm`
  // when a section (Discover More) opts every card into one shared ratio.
  const thumbStyle = {
    ...(ratio ? { "--thumb-ratio-desktop": `${ratio[0]} / ${ratio[1]}` } : {}),
    ...(mobileImageRatio
      ? { "--thumb-ratio-mobile": `${mobileImageRatio[0]} / ${mobileImageRatio[1]}` }
      : {}),
    borderRadius: 16,
    ...bgStyle,
  } as CSSProperties

  return (
    <article className="case-study-card">
      <Link
        href={href ?? `/work/${slug}`}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="flex flex-col gap-4 sm:gap-3 rounded-[--radius-xl] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      >
        {/* Thumbnail — aspect-ratio (set in thumbStyle) governs the box at
            every width, mobile included, so height shrinks with width
            instead of the box holding a fixed mobile height and letting the
            crop vary card-to-card. */}
        <div
          className={`card-thumb relative w-full overflow-hidden${isWideMobile ? " card-thumb-mobile-wide" : ""}`}
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
                (usesThumbnailRatio
                  ? isWideMobile
                    ? "absolute inset-0 h-full w-full object-cover discover-wide:object-contain"
                    : "absolute inset-0 h-full w-full object-cover sm:object-contain"
                  : "absolute inset-0 h-full w-full object-cover") +
                (videoPosition === "top" ? " object-top" : "")
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
                  ? isWideMobile
                    ? "object-cover discover-wide:object-contain"
                    : "object-cover sm:object-contain"
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
            <span className="card-arrow hidden shrink-0 leading-none text-neutral-200 sm:inline" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </div>

          {hasMetadata && (
            <p className="font-mono text-sm text-neutral-400">
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
