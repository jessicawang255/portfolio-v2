import type { MouseEvent } from "react"

export function samePageReload(pathname: string, href: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== href) return
    e.preventDefault()
    window.location.href = href
  }
}
