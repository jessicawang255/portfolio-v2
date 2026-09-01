type MediaFrameProps = {
  height: number
  caption?: string
  className?: string
  children: React.ReactNode
}

// A permanent bg-neutral-75 backdrop that centers real media inside it,
// rather than the box itself being the content (unlike ImageBlock's
// placeholder). Used for mobile recordings/animations mocked up as a device
// floating on a background, rather than filling the whole box edge to edge.
export function MediaFrame({ height, caption, className, children }: MediaFrameProps) {
  return (
    <div>
      {caption && <p className="mb-2 text-[13px] leading-[1.5] text-neutral-500 italic">{caption}</p>}
      <div
        className={`flex w-full items-center justify-center rounded-[8px] border border-neutral-100 bg-neutral-75 ${className ?? ""}`}
        style={{ height }}
      >
        {children}
      </div>
    </div>
  )
}
