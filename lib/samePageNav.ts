import type { MouseEvent } from "react"

// next/link's <Link> is a no-op when its href matches the route you're
// already on — no scroll, no re-render, nothing happens on click. That's
// wrong for a nav link: clicking "Work" while already on Work (or the logo
// while already home) should behave like landing on that page fresh —
// scrolled to top, entrance animations replayed. Client component state
// (scroll position, mounted motion state) can't be reset in place without
// a real navigation, so this forces a hard reload rather than faking it
// with router.refresh() + scrollTo. Safe to attach to every nav link
// (external/PDF ones included) — it's a no-op whenever href doesn't match
// the current path.
export function samePageReload(pathname: string, href: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== href) return
    e.preventDefault()
    window.location.href = href
  }
}
