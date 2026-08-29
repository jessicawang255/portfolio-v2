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

// Universal tertiary text link — matches body text at rest (neutral-600);
// the underline (30% opacity, going fully opaque on hover) is the link
// affordance, not the color. Darkens to neutral-800 on hover. Optional
// leading icon: none, the linked site's favicon (auto-fetched from its
// domain), or a custom image.
export function TertiaryLink({ href, children, icon = { type: "none" }, className, ...rest }: Props) {
  const iconSrc = icon.type === "favicon" ? faviconUrl(href) : icon.type === "custom" ? icon.src : null

  return (
    <a
      href={href}
      className={`group ${iconSrc ? "inline-flex items-baseline gap-1" : "inline"} text-neutral-600 transition-colors duration-150 hover:text-neutral-800 ${className ?? ""}`}
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
