import Image from "next/image"

type ImageBlockProps =
  | { src: string; alt: string; width: number; height: number; className?: string; caption?: string }
  | { src?: undefined; alt?: never; width?: never; height?: number; className?: string; caption?: string }

export function ImageBlock(props: ImageBlockProps) {
  if (props.src) {
    const { src, alt, width, height, className, caption } = props
    return (
      <div>
        {caption && <p className="mb-2 text-xs leading-[1.5] text-neutral-400 italic">{caption}</p>}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="100vw"
          className={`w-full h-auto rounded-[8px] border border-neutral-100 ${className ?? ""}`}
        />
      </div>
    )
  }
  const { height = 240, className, caption } = props
  return (
    <div>
      {caption && <p className="mb-2 text-xs leading-[1.5] text-neutral-500 italic">{caption}</p>}
      <div
        className={`w-full rounded-[8px] border border-neutral-100 bg-neutral-100 ${className ?? ""}`}
        style={{ height }}
      />
    </div>
  )
}
