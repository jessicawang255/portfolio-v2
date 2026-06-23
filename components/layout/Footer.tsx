"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const navLinks: { label: string; href: string; target?: string }[] = [
  { label: "Work",   href: "/" },
  { label: "About",  href: "/about" },
  { label: "Resume", href: "/resume.pdf", target: "_blank" },
]

const socialLinks = [
  { label: "Email",    href: "mailto:jessica.wang255@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/jwang255" },
  { label: "X",        href: "https://x.com/jossici" },
  { label: "GitHub",   href: "https://github.com/jessicawang255" },
]

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
         stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="7" cy="7" r="2.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
        <line key={a} x1="7" y1="1.8" x2="7" y2="3.5" transform={`rotate(${a} 7 7)`} />
      ))}
    </svg>
  )
}

function HorizonSunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
         stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      {/* Sun arc above horizon — semicircle centered at (7, 9.5) r=4.5 */}
      <path d="M 2.5 9.5 A 4.5 4.5 0 0 1 11.5 9.5" />
      {/* Horizon line */}
      <line x1="0.5" y1="9.5" x2="13.5" y2="9.5" />
      {/* Three rays above the sun */}
      <line x1="7"    y1="2"   x2="7"    y2="4"   />
      <line x1="3"    y1="5.5" x2="2"    y2="4.5" />
      <line x1="11"   y1="5.5" x2="12"   y2="4.5" />
    </svg>
  )
}

function MoonIcon() {
  // Crescent: outer circle (c=7,7 r=5) minus shadow circle (c=5,7 r=4.5)
  // Intersection points ≈ (4.8, 2.5) and (4.8, 11.5) — lit side faces right (☽)
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M 4.8 2.5 A 5 5 0 1 1 4.8 11.5 A 4.5 4.5 0 0 0 4.8 2.5 Z" />
    </svg>
  )
}

function getTimeIcon(hour: number) {
  if (hour >= 5  && hour < 7)  return <HorizonSunIcon />  // dawn
  if (hour >= 7  && hour < 18) return <SunIcon />          // day
  if (hour >= 18 && hour < 21) return <HorizonSunIcon />  // dusk
  return <MoonIcon />                                       // night
}

function LiveClock() {
  const [info, setInfo] = useState<{ time: string; hour: number } | null>(null)

  useEffect(() => {
    function update() {
      const now = new Date()
      const time = new Intl.DateTimeFormat("en-US", {
        hour: "numeric", minute: "2-digit", second: "2-digit",
        hour12: true, timeZone: "America/Toronto",
      }).format(now)
      const hourStr = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit", hour12: false, timeZone: "America/Toronto",
      }).format(now)
      const hour = parseInt(hourStr) % 24
      setInfo({ time, hour })
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  if (!info) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-normal text-neutral-500">
      {getTimeIcon(info.hour)}
      {info.time}, Toronto
    </span>
  )
}

export function Footer() {
  return (
    <footer id="site-footer" className="fixed inset-x-0 bottom-0 z-0 bg-chrome">
      <div className="container-chrome grid grid-cols-4 gap-8 pt-9 pb-16">
        {/* Name + clock */}
        <div className="flex flex-col gap-1">
          <span className="text-[18px] font-medium text-neutral-900">Jessica Wang</span>
          <LiveClock />
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {navLinks.map(({ label, href, target }) => (
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

        {/* Social links */}
        <nav aria-label="Social links">
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {socialLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-75"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Version */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-base text-nav-link">Portfolio V1</span>
        </div>
      </div>
    </footer>
  )
}
