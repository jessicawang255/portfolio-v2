type TertiaryLinkIcon =
  | { type: "none" }
  | { type: "favicon" }
  | { type: "custom"; src: string; alt?: string }

type Props = {
  href: string
  children: React.ReactNode
  icon?: TertiaryLinkIcon
  className?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">

function faviconUrl(href: string): string | null {
  try {
    const { hostname } = new URL(href)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
  } catch {
    return null
  }
}

// Native `text-decoration-style: wavy` has no wavelength/amplitude control
// (browsers pick their own, inconsistently) — this SVG mask gives a longer,
// gentler oscillation than any browser's default wavy underline, and still
// picks up the hover color via the masked element's own background-color.
const WAVE_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="8" viewBox="0 0 32 8">' +
    '<path d="M0 4 C 4 1, 12 1, 16 4 C 20 7, 28 7, 32 4" stroke="black" stroke-width="1.6" fill="none"/>' +
    "</svg>"
)}")`

// Universal tertiary text link — gray wavy-underlined text that darkens to
// neutral-900 on hover, with an optional leading icon: none, the linked
// site's favicon (auto-fetched from its domain), or a custom image.
export function TertiaryLink({ href, children, icon = { type: "none" }, className, ...rest }: Props) {
  const iconSrc = icon.type === "favicon" ? faviconUrl(href) : icon.type === "custom" ? icon.src : null

  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-1 text-neutral-600 transition-colors duration-150 hover:text-neutral-900 ${className ?? ""}`}
      {...rest}
    >
      {iconSrc && (
        <span
          className="ml-2 h-[1em] w-[1em] shrink-0 rounded-full bg-neutral-200 bg-cover bg-center"
          style={{ backgroundImage: `url(${iconSrc})` }}
        />
      )}
      <span className="relative inline-block">
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bg-neutral-300 transition-colors duration-150 group-hover:bg-neutral-900"
          style={{
            bottom: "-0.15em",
            height: "0.4em",
            maskImage: WAVE_MASK,
            WebkitMaskImage: WAVE_MASK,
            maskRepeat: "repeat-x",
            WebkitMaskRepeat: "repeat-x",
            maskSize: "1.6em 0.4em",
            WebkitMaskSize: "1.6em 0.4em",
          }}
        />
      </span>
    </a>
  )
}
