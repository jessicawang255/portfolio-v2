import Image from "next/image"

type ImageBlockProps = {
  src?: string
  alt?: string
  height?: number
  className?: string
}

export function ImageBlock({ src, alt = "", height = 240, className }: ImageBlockProps) {
  if (src) {
    return (
      <div
        className={`relative w-full rounded-xl overflow-hidden ${className ?? ""}`}
        style={{ height }}
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    )
  }
  return (
    <div
      className={`w-full rounded-xl bg-neutral-100 ${className ?? ""}`}
      style={{ height }}
    />
  )
}
