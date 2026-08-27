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

// Universal tertiary text link — gray wavy-underlined text that darkens to
// neutral-900 on hover, with an optional leading icon: none, the linked
// site's favicon (auto-fetched from its domain), or a custom image.
export function TertiaryLink({ href, children, icon = { type: "none" }, className, ...rest }: Props) {
  const iconSrc = icon.type === "favicon" ? faviconUrl(href) : icon.type === "custom" ? icon.src : null

  return (
    <a
      href={href}
      className={`group ${iconSrc ? "inline-flex items-center gap-1" : "inline"} text-neutral-600 transition-colors duration-150 hover:text-neutral-900 ${className ?? ""}`}
      {...rest}
    >
      {iconSrc && (
        <span
          className="relative top-[0.15em] h-[1em] w-[1em] shrink-0 bg-contain bg-center bg-no-repeat motion-safe:group-hover:animate-[icon-tick-wide_380ms_var(--ease-out)]"
          style={{ backgroundImage: `url(${iconSrc})` }}
        />
      )}
      <span className="underline decoration-neutral-300 decoration-wavy decoration-[0.06em] underline-offset-[0.14em] transition-colors duration-150 group-hover:decoration-neutral-900">
        {children}
      </span>
    </a>
  )
}
