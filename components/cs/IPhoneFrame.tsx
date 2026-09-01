import Image from "next/image"

type IPhoneFrameProps = {
  children: React.ReactNode
  className?: string
}

// The screen cutout this frame is built around — ScreenSpotlight's own
// scrollable screen window renders inside at exactly this size, so this is
// the single source of truth both files size themselves against.
export const IPHONE_SCREEN_WIDTH = 219

// Real device frame + status bar assets (see public/devices/), measured
// directly off the source PNG's alpha channel: native canvas 1313×2674,
// cutout at 67,59 sized 1179×2556.
const FRAME_NATIVE_WIDTH = 1313
const FRAME_NATIVE_HEIGHT = 2674
const FRAME_NATIVE_SCREEN_X = 67
const FRAME_NATIVE_SCREEN_Y = 59
const FRAME_NATIVE_SCREEN_WIDTH = 1179
const FRAME_NATIVE_SCREEN_HEIGHT = 2556

const FRAME_SCALE = IPHONE_SCREEN_WIDTH / FRAME_NATIVE_SCREEN_WIDTH
const FRAME_WIDTH = Math.round(FRAME_NATIVE_WIDTH * FRAME_SCALE)
const FRAME_HEIGHT = Math.round(FRAME_NATIVE_HEIGHT * FRAME_SCALE)
const SCREEN_LEFT = FRAME_NATIVE_SCREEN_X * FRAME_SCALE
const SCREEN_TOP = FRAME_NATIVE_SCREEN_Y * FRAME_SCALE

// 165 = Apple's 55pt corner radius for this screen at the cutout's native 3x
// scale, so the screen content's corners land exactly on the frame PNG's own
// curve instead of leaving a square-cornered sliver exposed at each corner.
const SCREEN_RADIUS = 165 * FRAME_SCALE

// Exported so ScreenSpotlight can size the card it wraps this frame in
// (frame height + that card's own padding) without duplicating this
// module's scale math.
export const IPHONE_FRAME_WIDTH = FRAME_WIDTH
export const IPHONE_FRAME_HEIGHT = FRAME_HEIGHT

// Rounded up rather than to nearest, so any fractional excess lands under
// the frame's opaque bezel instead of leaving a hairline gap of the card's
// background peeking past the transparent cutout at the bottom curve.
export const IPHONE_SCREEN_HEIGHT = Math.ceil(FRAME_NATIVE_SCREEN_HEIGHT * FRAME_SCALE)

// Status bar SVG is 402×62 natively — scaled to the screen's width, not stretched to an arbitrary height.
const STATUS_BAR_WIDTH = IPHONE_SCREEN_WIDTH
const STATUS_BAR_HEIGHT = Math.round((STATUS_BAR_WIDTH * 62) / 402)

// Three stacked layers, back to front: scrollable screen content, a
// composited status bar (crops don't have one baked in), then the device
// frame photo on top with its cutout aligned over both — pointer-events-none
// so scrolling/clicking the screen still works through the cutout.
export function IPhoneFrame({ children, className }: IPhoneFrameProps) {
  return (
    <div className={`relative ${className ?? ""}`} style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}>
      <div
        className="no-scrollbar absolute overflow-y-auto bg-black"
        style={{
          left: SCREEN_LEFT,
          top: SCREEN_TOP,
          width: IPHONE_SCREEN_WIDTH,
          height: IPHONE_SCREEN_HEIGHT,
          borderRadius: SCREEN_RADIUS,
        }}
      >
        {children}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element -- a static
          decorative SVG; next/image adds no benefit over a plain img here */}
      <img
        aria-hidden="true"
        src="/devices/iphone-status-bar.svg"
        alt=""
        className="pointer-events-none absolute"
        style={{ left: SCREEN_LEFT, top: SCREEN_TOP, width: STATUS_BAR_WIDTH, height: STATUS_BAR_HEIGHT }}
      />

      <Image
        aria-hidden="true"
        src="/devices/iphone-16-frame.png"
        alt=""
        width={FRAME_NATIVE_WIDTH}
        height={FRAME_NATIVE_HEIGHT}
        className="pointer-events-none absolute inset-0"
        style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
      />
    </div>
  )
}
