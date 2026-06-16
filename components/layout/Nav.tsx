import Link from "next/link"

const links = [
  { label: "Work",   href: "#work" },
  { label: "About",  href: "#about" },
  { label: "Resume", href: "/resume.pdf" },
]

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-0 bg-chrome">
      <nav
        className="container-chrome flex items-center justify-between py-4"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="text-base font-medium text-chrome-muted hover:text-chrome-text transition-colors duration-75"
        >
          Jessica Wang
        </Link>

        <ul className="flex items-center gap-7 list-none m-0 p-0">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-base font-medium text-chrome-muted hover:text-chrome-text transition-colors duration-75"
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
