import Image from "next/image"

type MediaProps = {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  className?: string
  sizes?: string
}

// One slot for either a still or a looping screen recording, picked by file
// extension, so swapping an exported .png for its .mp4 is a path change only.
export function Media({ src, alt, width, height, caption, className, sizes = "100vw" }: MediaProps) {
  const mediaClass = `block h-auto w-full rounded-[8px] border border-media-stroke ${className ?? ""}`
  return (
    <div>
      {caption && <p className="mb-2 text-[13px] leading-[1.5] text-neutral-400 italic">{caption}</p>}
      {src.endsWith(".mp4") ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          aria-label={alt}
          width={width}
          height={height}
          className={mediaClass}
        />
      ) : (
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className={mediaClass} />
      )}
    </div>
  )
}
