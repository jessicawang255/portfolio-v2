"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const navLinks: { label: string; href: string; target?: string }[] = [
  { label: "Work",   href: "/" },
  { label: "About",  href: "/about" },
  { label: "Resume", href: "/JessicaWang_Resume.pdf", target: "_blank" },
]

const socialLinks = [
  { label: "Email",    href: "mailto:jessica.wang255@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/jwang255" },
  { label: "X",        href: "https://x.com/jossici" },
  { label: "GitHub",   href: "https://github.com/jessicawang255" },
]

function TimeIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3.5 w-3.5 shrink-0 bg-current"
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  )
}

function getTimeIcon(hour: number) {
  if (hour >= 5  && hour < 8)  return <TimeIcon src="/icons/sun-foggy-fill.svg" /> // dawn
  if (hour >= 8  && hour < 18) return <TimeIcon src="/icons/sun-fill.svg" />       // day
  if (hour >= 18 && hour < 21) return <TimeIcon src="/icons/sun-foggy-fill.svg" /> // dusk
  return <TimeIcon src="/icons/moon-clear-fill.svg" />                            // night
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
    <span className="inline-flex items-center gap-1.5 text-sm font-normal text-neutral-400">
      {getTimeIcon(info.hour)}
      {info.time}, Toronto
    </span>
  )
}

// Static (scrolls with content) below `sm`, matching the header/nav's mobile
// behavior. Fixed from `sm` up — pinned behind #main-frame so its bottom
// corners can peel back to reveal it on scroll (see ScrollRadiusController /
// CaseStudyRadiusController, which only animate that peel and reserve body
// padding-bottom for it at the desktop breakpoint).
export function Footer() {
  return (
    <footer id="site-footer" className="static sm:fixed sm:inset-x-0 sm:bottom-0 sm:z-0 bg-chrome">
      <div className="container-chrome grid grid-cols-1 gap-8 pt-9 pb-16 sm:grid-cols-4">
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
                  className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-150"
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
                  className="text-base font-normal text-nav-link hover:text-nav-link-hover transition-colors duration-150"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Reserved for future footer content */}
        <div className="flex flex-col items-start gap-1 sm:items-end" />
      </div>
    </footer>
  )
}
