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
  // Which breakpoint releases the box back to its own ratio: `md` (768px,
  // default — Case Studies) or `lg` (960px — Discover More, whose 4 columns
  // need more room before `md` stops being too narrow). Only meaningful
  // alongside mobileImageRatio.
  mobileBreakpoint?: "md" | "lg"
  // Where a cropped video thumbnail anchors within its box — `center`
  // (default) or `top` to keep the top of the frame intact and crop from
  // the bottom instead. No effect on images or on boxes that don't crop.
  videoPosition?: "center" | "top"
  // Shrinks the image within its box by this percentage on every side
  // instead of filling the box edge-to-edge. Only sensible when the asset's
  // own background — baked into the file, or transparent over the card's bg
  // color — matches the box color, so the margin this reveals reads as
  // intentional padding rather than a mismatched border.
  imageInset?: number
  // How the image fills the inset box: `contain` (default) shows the whole
  // asset uncropped, so any padding baked into the file stays exactly as
  // drawn. `cover` scales up and crops instead — for an asset whose own
  // canvas has uneven built-in padding (e.g. Snippets: ~12% empty margin
  // above the screenshots, ~0% below), cropping into the excess is the only
  // way to balance it without re-exporting the file, and is only safe
  // toward the edge that actually has slack to spare. No effect without
  // imageInset.
  imageFit?: "contain" | "cover"
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

export function CaseStudyCard({
  project,
  imageRatio,
  mobileImageRatio,
  mobileBreakpoint = "md",
  videoPosition = "center",
  imageInset,
  imageFit = "contain",
}: Props) {
  const { slug, title, name, status, disciplines, bg, thumbnail, thumbnailWidth, thumbnailHeight, href } = project

  const isGradient = bg.startsWith("linear-gradient")
  const bgStyle = isGradient ? { background: bg } : { backgroundColor: bg }
  const isVideo = thumbnail?.endsWith(".mp4") || thumbnail?.endsWith(".webm")
  const hasMetadata = name || status || (disciplines && disciplines.length > 0)
  const isExternal = Boolean(href)
  const isWideMobile = mobileBreakpoint === "lg"

  // With no explicit imageRatio, size the box to the thumbnail's own aspect
  // ratio instead of forcing a uniform crop — lets Discover More's bento
  // layout follow each asset's natural dimensions.
  const usesThumbnailRatio = !imageRatio && thumbnailWidth && thumbnailHeight
  const ratio = imageRatio ?? (usesThumbnailRatio ? [thumbnailWidth!, thumbnailHeight!] : undefined)

  // aspect-ratio (not a pixel height) so the box scales proportionally with
  // its fluid grid-column width instead of stretching width while height
  // stays fixed. Set as CSS custom properties rather than `aspectRatio`
  // directly so globals.css can swap in `--thumb-ratio-mobile` below `md`
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
        className="flex flex-col gap-4 md:gap-3 rounded-[--radius-xl] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
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
                    ? "absolute inset-0 h-full w-full object-cover lg:object-contain"
                    : "absolute inset-0 h-full w-full object-cover md:object-contain"
                  : "absolute inset-0 h-full w-full object-cover") +
                (videoPosition === "top" ? " object-top" : "")
              }
            />
          )}
          {thumbnail && !isVideo && (imageInset ? (
            // `fill` forces width/height:100% of its own positioned parent
            // (Next throws if you fight that in style) — so to inset the
            // image, inset a wrapper instead and let `fill` fill that.
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

        {/* Text block */}
        <div className="card-text flex items-start justify-between gap-6 px-0 md:px-3.5">
          {/* gap-0/md:gap-1 above and gap-4/md:gap-3 on the Link wrapper
              (thumbnail-to-text) are left as-is: tightening the title from
              leading-[1.4] to leading-[1.3] trims only ~0.8px off its
              half-leading (16px text-base * 0.1 / 2), which rounds back
              down to these same gap tokens — nothing to compensate at that
              scale. */}
          <div className="flex flex-col gap-0 md:gap-1">
            <h3 className="text-balance text-base font-medium leading-[1.3] text-neutral-800">
              {title}
            </h3>

            {hasMetadata && (
              <p className="text-balance text-base text-neutral-500">
                {name}
                {name && (status || disciplines?.length) && <Separator className="mx-1.5">•</Separator>}
                {status}
                {status && disciplines?.length && <Separator className="mx-2">/</Separator>}
                {disciplines?.join(" / ")}
              </p>
            )}
          </div>

          {/* Hover-reveal arrow — desktop only (see `hover: hover` gate in
              globals.css); dropped on mobile since there's no hover to reveal it. */}
          <span className="card-arrow hidden shrink-0 leading-none text-neutral-200 md:inline" aria-hidden="true">
            <ArrowUpRight />
          </span>
        </div>
      </Link>
    </article>
  )
}
