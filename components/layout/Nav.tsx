"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links: { label: string; href: string; target?: string }[] = [
  { label: "Work",   href: "/" },
  { label: "About",  href: "/about" },
  { label: "Resume", href: "/resume.pdf", target: "_blank" },
]

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Nav() {
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-0 top-0 z-[2] bg-chrome/75 backdrop-blur-md">
      <nav
        className="container-chrome flex items-center justify-between py-4"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
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
