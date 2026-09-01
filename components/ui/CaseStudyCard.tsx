import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/content/work"
import type { CSSProperties } from "react"

type Props = {
  project: Project
  // Explicit [width, height] box ratio for cards without a real thumbnail
  // image (bento layout on the home page). Overrides thumbnailWidth/Height.
  imageRatio?: [number, number]
  // Overrides the box ratio below `mobileBreakpoint` only (see
  // --thumb-ratio-mobile in globals.css), so a grid of cards with different
  // natural ratios can share one ratio on mobile.
  mobileImageRatio?: [number, number]
  // Breakpoint that releases the box back to its own ratio: `md` (768px,
  // default) or `lg` (960px, for grids that need more room before `md`).
  // Only meaningful alongside mobileImageRatio.
  mobileBreakpoint?: "md" | "lg"
  // Where a cropped video thumbnail anchors: `center` (default) or `top` to
  // crop from the bottom instead. No effect on images.
  videoPosition?: "center" | "top"
  // Shrinks the image within its box by this percentage per side instead of
  // filling edge-to-edge. Only looks right when the asset's own background
  // matches the box color, so the reveal reads as padding, not a border.
  imageInset?: number
  // How the image fills the inset box: `contain` (default) shows it
  // uncropped; `cover` scales up and crops, for an asset with uneven
  // built-in padding. No effect without imageInset.
  imageFit?: "contain" | "cover"
  // Title size: `lg` (default, flat 18px) or `responsive` (16px below `lg`,
  // 18px above) for narrower grids that need the extra room. Pinned to the
  // same `lg` breakpoint as Discover More's grid-cols switch.
  titleSize?: "lg" | "responsive"
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

export function CaseStudyCard({
  project,
  imageRatio,
  mobileImageRatio,
  mobileBreakpoint = "md",
  videoPosition = "center",
  imageInset,
  imageFit = "contain",
  titleSize = "lg",
}: Props) {
  const { slug, title, name, status, bg, thumbnail, thumbnailWidth, thumbnailHeight, href } = project

  const isGradient = bg.startsWith("linear-gradient")
  const bgStyle = isGradient ? { background: bg } : { backgroundColor: bg }
  const isVideo = thumbnail?.endsWith(".mp4") || thumbnail?.endsWith(".webm")
  const hasMetadata = name || status
  const isExternal = Boolean(href)
  const isWideMobile = mobileBreakpoint === "lg"

  // With no explicit imageRatio, size the box to the thumbnail's own aspect
  // ratio instead of forcing a uniform crop.
  const usesThumbnailRatio = !imageRatio && thumbnailWidth && thumbnailHeight
  const ratio = imageRatio ?? (usesThumbnailRatio ? [thumbnailWidth!, thumbnailHeight!] : undefined)

  // aspect-ratio (not a pixel height) scales the box with its fluid
  // grid-column width. Set as CSS custom properties so globals.css can swap
  // in `--thumb-ratio-mobile` below `md`.
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
        className="flex flex-col gap-4 md:gap-3 rounded-[--radius-xl] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      >
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
                    ? "absolute inset-0 h-full w-full object-cover lg:object-contain"
                    : "absolute inset-0 h-full w-full object-cover md:object-contain"
                  : "absolute inset-0 h-full w-full object-cover") +
                (videoPosition === "top" ? " object-top" : "")
              }
            />
          )}
          {thumbnail && !isVideo && (imageInset ? (
            // `fill` forces width/height:100% of its positioned parent, so
            // inset a wrapper instead and let `fill` fill that.
            <div className="absolute" style={{ inset: `${imageInset}%` }}>
              <Image
                src={thumbnail}
                alt={title}
                fill
                className={imageFit === "cover" ? "object-cover object-bottom" : "object-contain"}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className={
                usesThumbnailRatio
                  ? isWideMobile
                    ? "object-cover lg:object-contain"
                    : "object-cover md:object-contain"
                  : "object-cover"
              }
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ))}
        </div>

        <div className="card-text flex items-start justify-between gap-6 px-0 md:px-3.5">
          <div className="flex flex-col gap-0.5">
            <h3
              className={`text-balance font-medium leading-[1.3] text-neutral-800 ${
                titleSize === "responsive" ? "text-base lg:text-lg" : "text-lg"
              }`}
            >
              {title}
            </h3>

            {hasMetadata && (
              <p className="text-balance text-base text-neutral-500">
                {name}
                {name && status && (
                  <span className="mx-1.5" aria-hidden="true">·</span>
                )}
                {status}
              </p>
            )}
          </div>

          {/* Desktop only — no hover to reveal it on mobile. */}
          <span className="card-arrow hidden shrink-0 leading-none text-neutral-200 md:inline" aria-hidden="true">
            <ArrowUpRight />
          </span>
        </div>
      </Link>
    </article>
  )
}
