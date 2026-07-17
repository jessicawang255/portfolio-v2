// Maps an icon asset path to its human-readable tooltip, so IconButton can
// derive a tooltip/aria-label from the icon alone when no explicit tooltip
// is given — e.g. every community entry that reuses /icons/instagram.svg
// gets "Instagram" without repeating it per item.
const WEBSITE_ICON = "/icons/global-line.svg"

const ICON_TOOLTIPS: Record<string, string> = {
  "/icons/instagram.svg": "Instagram",
  "/icons/linkedin.svg": "LinkedIn",
  "/icons/x.svg": "X",
  "/icons/mail.svg": "Email",
  "/icons/github.svg": "GitHub",
  "/icons/link.svg": "Link",
}

function hostname(href: string): string | null {
  try {
    return new URL(href).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

export function getIconTooltip(icon: string, href: string): string {
  // The globe icon links out to varied destinations, so its tooltip is the
  // site it points to (e.g. "framer.com") rather than a fixed word.
  if (icon === WEBSITE_ICON) {
    return hostname(href) ?? "Website"
  }
  return ICON_TOOLTIPS[icon] ?? "Link"
}
