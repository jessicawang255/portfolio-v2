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

// Universal tertiary text link — one shade darker than body text at rest
// (neutral-700 vs. body's neutral-600), so it reads as distinct regardless
// of the underline's opacity, while staying comfortably above AA contrast
// (unlike a lighter-than-body alternative, which drops below it). Darkens
// further to neutral-900 on hover — the underline (30%→100% opacity) is the
// real hover signal, but 700→900 gives the color shift enough of its own
// gap to read as a change too, rather than 700→800's near-imperceptible one.
// Optional leading icon: none, the linked site's favicon (auto-fetched from
// its domain), or a custom image.
export function TertiaryLink({ href, children, icon = { type: "none" }, className, ...rest }: Props) {
  const iconSrc = icon.type === "favicon" ? faviconUrl(href) : icon.type === "custom" ? icon.src : null

  return (
    <a
      href={href}
      className={`group ${iconSrc ? "inline-flex items-baseline gap-1" : "inline"} text-neutral-700 transition-colors duration-150 hover:text-neutral-900 ${className ?? ""}`}
      {...rest}
    >
      {iconSrc && (
        <span
          className="relative top-[0.15em] h-[1em] w-[1em] shrink-0 bg-contain bg-center bg-no-repeat motion-safe:group-hover:animate-[icon-tick-wide_380ms_var(--ease-out)]"
          style={{ backgroundImage: `url(${iconSrc})` }}
        />
      )}
      <span className="underline decoration-current/30 underline-offset-[0.14em] transition-[text-decoration-color] duration-150 group-hover:decoration-current/100">
        {children}
      </span>
    </a>
  )
}
