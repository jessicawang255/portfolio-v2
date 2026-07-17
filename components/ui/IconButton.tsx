import { getIconTooltip } from "@/lib/iconTooltips"

type Props = {
  href: string
  // Falls back to a label derived from `icon` (and `href` for the globe
  // icon) via getIconTooltip when omitted — set this explicitly only when
  // the derived default doesn't fit (e.g. "Copy Email" instead of "Email").
  label?: string
  icon: string
  size?: number
  className?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "aria-label">

// Icon-only link: mask-image icon that tints on hover, plus a floating
// label tooltip that fades in after a beat of sustained hover and drops
// out instantly on mouse-leave (group-hover:delay-500 has no matching
// delay on the base rule, so leaving skips straight to the fast fade-out).
export function IconButton({ href, label, icon, size = 22, className, ...rest }: Props) {
  const external = href.startsWith("http")
  const resolvedLabel = label ?? getIconTooltip(icon, href)

  return (
    <a
      href={href}
      aria-label={resolvedLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group relative inline-flex text-icon-social transition-[color,scale] duration-150 hover:scale-110 hover:text-nav-link-hover motion-safe:hover:animate-[icon-tick_var(--duration-slow)_var(--ease-out)] ${className ?? ""}`}
      {...rest}
    >
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: size,
          height: size,
          WebkitMaskImage: `url(${icon})`,
          maskImage: `url(${icon})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          backgroundColor: "currentColor",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 mb-1 origin-bottom
        -translate-x-1/2 scale-90 whitespace-nowrap rounded-[var(--radius-sm)] bg-neutral-900/90
        px-1.5 py-0.5 text-xs text-neutral-50 opacity-0 transition-[opacity,scale] duration-[var(--duration-slow)]
        ease-[var(--ease-out)] group-hover:scale-100 group-hover:opacity-100 group-hover:delay-500"
      >
        {resolvedLabel}
      </span>
    </a>
  )
}
