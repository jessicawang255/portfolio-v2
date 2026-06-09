"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const navLinks = [
  { label: "Work",   href: "#work" },
  { label: "About",  href: "#about" },
  { label: "Resume", href: "/resume.pdf" },
]

const socialLinks = [
  { label: "Email",    href: "mailto:jessica.wang255@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/jwang255" },
  { label: "X",        href: "https://x.com/jossici" },
  { label: "GitHub",   href: "https://github.com/jessicawang255" },
]

function LiveClock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    function format() {
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "America/Toronto",
      }).format(new Date())
    }

    setTime(format())
    const id = setInterval(() => setTime(format()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return null

  return (
    <span className="text-base font-medium text-chrome-text/60">
      {time}, Toronto
    </span>
  )
}

export function Footer() {
  return (
    <footer id="site-footer" className="fixed inset-x-0 bottom-0 z-0 bg-chrome">
      <div className="container-chrome grid grid-cols-4 gap-8 pt-6 pb-16">
        {/* Name + clock */}
        <div className="flex flex-col gap-1">
          <span className="text-[18px] font-medium text-white">Jessica Wang</span>
          <LiveClock />
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-base font-medium text-chrome-text/60 hover:text-chrome-text"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social links */}
        <nav aria-label="Social links">
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {socialLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-base font-medium text-chrome-text/60 hover:text-chrome-text"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Version */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-base text-chrome-text/60">Portfolio V1</span>
        </div>
      </div>
    </footer>
  )
}
