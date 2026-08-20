import Image from "next/image"

type IPhoneFrameProps = {
  children: React.ReactNode
  className?: string
}

// The screen cutout this frame is built around — ScreenSpotlight's own
// scrollable screen window renders inside at exactly this size, so this is
// the single source of truth both files size themselves against.
export const IPHONE_SCREEN_WIDTH = 219

// Real device frame + status bar, both supplied assets (not hand-drawn) —
// see public/devices/. The frame PNG's intrinsic size and its screen
// cutout's position/size were measured directly off the source file (its
// alpha channel — the cutout is genuinely transparent, not just white) so
// this frame renders at the asset's own proportions rather than an
// approximation:
//   native canvas   1313 × 2674
//   native cutout   67,59 → 1179 × 2556 (aspect ≈ 0.461, matching our own
//                    screen crops' 860:1864 ≈ 0.462 closely enough that
//                    nothing here is stretched to fit)
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

// 165 = Apple's own 55pt corner radius for this exact screen, at the same
// 3x scale the native cutout (1179×2556) is already in — i.e. this asset
// is pixel-accurate to a real iPhone 15/16 Pro screen, not an approximate
// mockup. Scaled down by the same FRAME_SCALE as everything else here so
// it lands on the frame PNG's own corner curve at any size. Without this,
// the screen-content div below is a plain square-cornered rectangle sitting
// inside the frame's rounded cutout — at each corner, the sliver of cutout
// the div's square corner doesn't cover exposes whatever's behind this
// whole component (the card's own background) as a small light triangle.
const SCREEN_RADIUS = 165 * FRAME_SCALE

// Exported so ScreenSpotlight can size the card it wraps this frame in
// (frame height + that card's own padding) without duplicating this
// module's own scale math — same reasoning as IPHONE_SCREEN_WIDTH/HEIGHT
// below being exported for the screen window's own consumers.
export const IPHONE_FRAME_WIDTH = FRAME_WIDTH
export const IPHONE_FRAME_HEIGHT = FRAME_HEIGHT

// Rounded up, not to nearest or down. This is ScreenSpotlight's own
// scrollable screen window (bg-black), which paints *behind* the frame PNG's
// opaque bezel below. 2556 × FRAME_SCALE lands on 474.77, a fractional px a
// hardcoded 474 used to fall short of — leaving the frame's real (taller)
// transparent cutout peeking past this div's bottom edge and showing the
// card's own light background through it as a hairline gap right above the
// bottom curve. Rounding up instead means any excess height here lands
// under the opaque bezel that paints on top of it, which hides it for free.
export const IPHONE_SCREEN_HEIGHT = Math.ceil(FRAME_NATIVE_SCREEN_HEIGHT * FRAME_SCALE)

// Status bar SVG is 402×62 (its own native proportions) — scaled to the
// screen's width the same way, not stretched to some arbitrary height.
const STATUS_BAR_WIDTH = IPHONE_SCREEN_WIDTH
const STATUS_BAR_HEIGHT = Math.round((STATUS_BAR_WIDTH * 62) / 402)

// Three stacked layers, back to front:
//  1. Screen content — the real HTML element ScreenSpotlight renders its
//     scrollable crop into (unchanged by this frame).
//  2. Status bar — fixed above the scrolling content, same as the real one
//     staying in place while the screen underneath it scrolls. Our crops
//     don't have one baked in, so it's composited here instead.
//  3. Frame — the device photo itself (bezel, buttons, Dynamic Island all
//     baked into one asset), laid on top with its screen cutout aligned
//     exactly over layers 1–2. pointer-events-none so scrolling/clicking
//     the screen underneath still works through the transparent cutout.
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
