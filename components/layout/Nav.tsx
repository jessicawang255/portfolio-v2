"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { samePageReload } from "@/lib/samePageNav"

const links: { label: string; href: string; target?: string }[] = [
  { label: "Work",   href: "/" },
  { label: "About",  href: "/about" },
  { label: "Resume", href: "/JessicaWang_Resume.pdf", target: "_blank" },
]

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Nav() {
  const pathname = usePathname()

  // Case study pages render their own nav overlay (see CaseStudyLayout).
  if (pathname.startsWith("/work/")) return null

  return (
    // Bottom pill nav takes over below `sm`; matches HeroShell's fixed-position
    // breakpoint so this bar never sits above a still-scrolling hero.
    <header id="site-nav" className="fixed inset-x-0 top-0 z-[2] hidden bg-chrome/50 sm:block">
      <nav
        className="container-chrome flex items-center justify-between py-4"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          onClick={samePageReload(pathname, "/")}
          className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-150"
        >
          Jessica Wang
        </Link>

        <ul className="flex items-center gap-7 list-none m-0 p-0">
          {links.map(({ label, href, target }) => (
            <li key={label}>
              <Link
                href={href}
                target={target}
                rel={target === "_blank" ? "noopener noreferrer" : undefined}
                onClick={samePageReload(pathname, href)}
                className={`text-base font-normal transition-colors duration-150 hover:text-nav-link-hover ${
                  isActive(pathname, href) ? "text-neutral-900" : "text-nav-link"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
