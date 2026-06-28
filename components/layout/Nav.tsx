import Link from "next/link"

const links: { label: string; href: string; target?: string }[] = [
  { label: "Work",   href: "/" },
  { label: "About",  href: "/about" },
  { label: "Resume", href: "/resume.pdf", target: "_blank" },
]

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[2] bg-chrome/75 backdrop-blur-md">
      <nav
        className="container-chrome flex items-center justify-between py-4"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-75"
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
                className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-75"
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
