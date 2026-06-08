import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/content/work"

type Props = {
  project: Project
  imageHeight?: number
}

export function CaseStudyCard({ project, imageHeight = 340 }: Props) {
  const { slug, title, org, status, disciplines, bg, image } = project

  const isGradient = bg.startsWith("linear-gradient")

  return (
    <article className="case-study-card flex flex-col gap-3">
      <Link href={`/work/${slug}`} className="block">
        <div
          className="relative w-full overflow-hidden rounded-[--radius-lg]"
          style={{ height: imageHeight, background: isGradient ? bg : undefined, backgroundColor: isGradient ? undefined : bg }}
        >
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="card-thumb-img object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-1">
        <Link href={`/work/${slug}`} className="group">
          <h3 className="text-base font-extrabold text-black leading-snug">
            {title}
          </h3>
        </Link>

        <p className="text-sm font-normal text-black">
          {org}
          <span className="mx-1.5">•</span>
          {status}
          <span className="mx-2 text-subtle">/</span>
          {disciplines.join(" / ")}
        </p>
      </div>
    </article>
  )
}
