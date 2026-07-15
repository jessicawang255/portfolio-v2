// Colored film-grain texture, composited with color-burn so it only darkens
// whatever's beneath it (never lightens) — gives a flat gradient depth
// without tinting the whole thing. feTurbulence's alpha channel is a smooth
// mid-range cloud, not sparse speckle — a gamma curve on that alpha pushes
// most of it toward 0 so only the peaks burn in.
function grainDataUri(hex: string, peakAlpha = 0.5, sharpness = 5) {
  const clean = hex.replace("#", "")
  const r = (parseInt(clean.slice(0, 2), 16) / 255).toFixed(3)
  const g = (parseInt(clean.slice(2, 4), 16) / 255).toFixed(3)
  const b = (parseInt(clean.slice(4, 6), 16) / 255).toFixed(3)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg">` +
    `<filter id="n">` +
    `<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" stitchTiles="stitch" result="t"/>` +
    `<feColorMatrix in="t" type="matrix" values="0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 1 0" result="c"/>` +
    `<feComponentTransfer in="c"><feFuncA type="gamma" amplitude="${peakAlpha}" exponent="${sharpness}" offset="0"/></feComponentTransfer>` +
    `</filter>` +
    `<rect width="100%" height="100%" filter="url(#n)"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// Drop this inside a `relative`/`absolute` hero layer to color-burn a tinted
// grain over whatever's beneath it.
export function GrainOverlay({ hex, size = 240 }: { hex: string; size?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: grainDataUri(hex),
        backgroundSize: `${size}px ${size}px`,
        mixBlendMode: "color-burn",
      }}
    />
  )
}
