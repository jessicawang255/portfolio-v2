import type { MouseEvent } from "react"

// next/link is a no-op when href matches the current route — no scroll, no
// re-render. Wrong for a nav link, which should behave like landing fresh
// (scrolled to top, entrance animations replayed). Client state can't be
// reset in place without a real navigation, so this forces a hard reload.
// Safe on every nav link — a no-op whenever href doesn't match the path.
export function samePageReload(pathname: string, href: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== href) return
    e.preventDefault()
    window.location.href = href
  }
}
