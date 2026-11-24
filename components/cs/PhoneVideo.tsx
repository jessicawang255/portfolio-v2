import Image from "next/image"

type PhoneVideoProps = {
  // A bare screen recording (.mp4) or still: no device frame or status bar,
  // both composited here.
  src: string
  alt: string
  className?: string
  // Controlled playback, for groups where only one clip should play at a time
  // (see PhoneVideoCompare). Omit to autoplay.
  videoRef?: React.Ref<HTMLVideoElement>
  autoPlay?: boolean
  // Layered over the screen, under the status bar and frame.
  overlay?: React.ReactNode
}

// Same device frame and status bar assets as IPhoneFrame, but sized as
// percentages of its container so it scales with the column instead of
// IPhoneFrame's fixed 219px screen. Native measurements (frame 1313×2674,
// cutout at 67,59 sized 1179×2556, 165px corner radius) come from that file.
const FRAME_W = 1313
const FRAME_H = 2674
const SCREEN_X = 67
const SCREEN_Y = 59
const SCREEN_W = 1179
const SCREEN_H = 2556
const SCREEN_RADIUS = 165
// Status bar SVG is 402×62 natively, scaled to the screen's width.
const STATUS_BAR_RATIO = 62 / 402

const pct = (n: number, of: number) => `${(n / of) * 100}%`

export function PhoneVideo({ src, alt, className, videoRef, autoPlay = true, overlay }: PhoneVideoProps) {
  return (
    <div className={`relative w-full ${className ?? ""}`} style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}>
      <div
        className="absolute overflow-hidden bg-black"
        style={{
          left: pct(SCREEN_X, FRAME_W),
          top: pct(SCREEN_Y, FRAME_H),
          width: pct(SCREEN_W, FRAME_W),
          height: pct(SCREEN_H, FRAME_H),
          // Elliptical percentages (horizontal / vertical) so the curve
          // tracks the frame's own corner at any rendered size.
          borderRadius: `${pct(SCREEN_RADIUS, SCREEN_W)} / ${pct(SCREEN_RADIUS, SCREEN_H)}`,
        }}
      >
        {src.endsWith(".mp4") ? (
          <video
            ref={videoRef}
            src={src}
            autoPlay={autoPlay}
            loop
            muted
            playsInline
            aria-label={alt}
            className="block h-full w-full object-cover object-top"
          />
        ) : (
          <Image src={src} alt={alt} fill sizes="320px" className="object-cover object-top" />
        )}
        {overlay}
        {/* eslint-disable-next-line @next/next/no-img-element -- a static
            decorative SVG; next/image adds no benefit over a plain img here */}
        <img
          aria-hidden="true"
          src="/devices/iphone-status-bar.svg"
          alt=""
          className="pointer-events-none absolute inset-x-0 top-0 w-full"
          style={{ aspectRatio: `1 / ${STATUS_BAR_RATIO}` }}
        />
      </div>

      <Image
        aria-hidden="true"
        src="/devices/iphone-16-frame.png"
        alt=""
        fill
        sizes="320px"
        className="pointer-events-none select-none"
      />
    </div>
  )
}
