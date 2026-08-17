type MediaFrameProps = {
  height: number
  caption?: string
  className?: string
  children: React.ReactNode
}

// Close to the placeholder box ImageBlock draws when it has no `src`
// (rounded-[8px], border-neutral-100, fixed pixel height) — but bg-neutral-75
// instead of bg-neutral-100 (lighter, same chrome/panel tone as MobileNav and
// AboutContent's hover rows), and this one keeps the box as a permanent
// backdrop and centers real media inside it, instead of the box being the
// content. Used for mobile screen recordings/animations that read as a
// device mockup: letting the surrounding neutral-75 show through on every
// side is what sells "phone floating on a background" rather than "cropped
// video filling a rectangle."
export function MediaFrame({ height, caption, className, children }: MediaFrameProps) {
  return (
    <div>
      {caption && <p className="mb-2 text-xs leading-[1.5] text-neutral-500 italic">{caption}</p>}
      <div
        className={`flex w-full items-center justify-center rounded-[8px] border border-neutral-100 bg-neutral-75 ${className ?? ""}`}
        style={{ height }}
      >
        {children}
      </div>
    </div>
  )
}
