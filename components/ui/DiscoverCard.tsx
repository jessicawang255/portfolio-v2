import Image from "next/image"
import Link from "next/link"
import type { DiscoverItem } from "@/content/work"

type Props = {
  item: DiscoverItem
  imageHeight?: number
}

function ArrowUpRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 14L14 4M14 4H7M14 4V11"
        stroke="#A1AaA1"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DiscoverCard({ item}: Props) {
  const { slug, title, bg, image } = item

  const isGradient = bg.startsWith("linear-gradient")
  const bgStyle = isGradient ? { background: bg } : { backgroundColor: bg }

  return (
    <article className="case-study-card">
      <Link
        href={`/work/${slug}`}
        className="flex flex-col gap-4 rounded-[--radius-xl] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      >
        <div
          className="card-thumb relative w-full overflow-hidden"
          style={{ height: item.height, borderRadius: 18, ...bgStyle }}
        >
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>

        <div className="card-text flex flex-col px-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-normal leading-snug text-black">
              {title}
            </h3>
            <span className="card-arrow shrink-0 mt-0.5 text-primary" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
