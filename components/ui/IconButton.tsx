"use client"

import { useEffect, useRef, useState } from "react"
import { getIconTooltip } from "@/lib/iconTooltips"

type Props = {
  href: string
  // Falls back to a label derived from `icon`/`href` via getIconTooltip when
  // omitted — set explicitly only when the derived default doesn't fit.
  label?: string
  icon: string
  size?: number
  className?: string
  // When set, a click copies this string instead of navigating (`href` is
  // kept as the mailto:/etc. fallback for right-click and no-JS cases). The
  // tooltip flips to "Copied!" for a beat as confirmation.
  copyText?: string
  // "plain" (default): naked mask-image icon, scales up on hover. "boxed":
  // skeuomorphic 44px card around the icon (hero social row) — the icon
  // still wiggles on hover but the card itself doesn't scale, it rises.
  variant?: "plain" | "boxed"
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "aria-label">

const COPIED_RESET_MS = 1600

// Icon-only link: mask-image icon that tints on hover, plus a floating
// label tooltip that fades in after a beat of sustained hover and drops
// out instantly on mouse-leave.
export function IconButton({ href, label, icon, size = 24, className, copyText, variant = "plain", onClick, ...rest }: Props) {
  const external = href.startsWith("http")
  const resolvedLabel = label ?? getIconTooltip(icon, href)
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const boxed = variant === "boxed"

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (!copyText || e.defaultPrevented) return
    e.preventDefault()

    navigator.clipboard.writeText(copyText).then(
      () => {
        setCopied(true)
        clearTimeout(resetTimer.current)
        resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS)
      },
      () => {
        // Clipboard API unavailable (e.g. insecure context) — fall back to
        // the plain link this button still points at.
        window.location.href = href
      }
    )
  }

  const displayLabel = copied ? "Copied!" : resolvedLabel

  return (
    // `before:inset-[-11px]` pads the hit area out to ~44px square (the
    // touch-target minimum) without growing the visible icon. `z-50` stays
    // on at all times so a still-fading tooltip never gets clipped by the
    // icon dropping back into normal paint order on mouse-leave.
    <a
      href={href}
      aria-label={displayLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={
        boxed
          ? `group/icon relative z-50 inline-flex h-11 w-11 items-center justify-center text-icon-social transition-colors duration-150 before:absolute before:inset-[-11px] before:content-[''] hover:text-nav-link-hover ${className ?? ""}`
          : `group/icon relative z-50 inline-flex text-icon-social transition-[color,scale] duration-150 before:absolute before:inset-[-11px] before:content-[''] hover:scale-110 hover:text-nav-link-hover motion-safe:hover:animate-[icon-tick_var(--duration-slow)_var(--ease-out)] ${className ?? ""}`
      }
      {...rest}
    >
      {boxed && (
        // The visual card, separate from the `<a>`'s own layout box: it's
        // absolutely positioned so resizing it on hover/press (top moves,
        // bottom stays put) never resizes the `<a>` itself — nothing in the
        // flex row it sits in has to reflow. Bottom border width and `top`
        // move together: thicker + higher reads as the block rising on
        // hover, thinner + lower reads as it sinking flush on press.
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-base border border-neutral-100/80 border-b-[2px] bg-surface shadow-[0px_2px_2px_0_rgba(0,0,0,0.04)] transition-[top,border-bottom-width,box-shadow,background-color] duration-150 group-hover/icon:top-[-2px] group-hover/icon:border-b-[4px] group-hover/icon:shadow-[0px_4px_8px_0_rgba(0,0,0,0.04)] group-active/icon:top-[1px] group-active/icon:border-b-[1px] group-active/icon:bg-neutral-100/80 group-active/icon:shadow-[0px_1px_1px_0_rgba(0,0,0,0.04)]"
        />
      )}
      <span
        aria-hidden="true"
        // Tracks the card's top offset 1:1 in both directions — up 2px when
        // the card rises on hover, down 1px when it sinks on press — so the
        // icon stays visually centered on the card instead of staying
        // pinned to the (unmoving) anchor underneath.
        className={boxed ? "relative z-10 transition-[translate] duration-150 group-hover/icon:-translate-y-[2px] group-active/icon:translate-y-[1px] motion-safe:group-hover/icon:animate-[icon-tick_var(--duration-slow)_var(--ease-out)]" : undefined}
        style={{
          display: "inline-block",
          width: size,
          height: size,
          WebkitMaskImage: `url(${icon})`,
          maskImage: `url(${icon})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          backgroundColor: "currentColor",
        }}
      />
      {/* Hidden below `md`: hover has no meaning on touch, and this
          tooltip's whitespace-nowrap box still counts toward page width at
          opacity-0, which can push a narrow viewport into horizontal scroll. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 hidden origin-bottom
        -translate-x-1/2 scale-90 whitespace-nowrap rounded-[var(--radius-sm)] bg-neutral-900/90
        px-1.5 py-0.5 text-xs text-neutral-50 opacity-0 transition-[opacity,scale] duration-[var(--duration-slow)]
        ease-in group-hover/icon:scale-100 group-hover/icon:opacity-100 group-hover/icon:ease-[var(--ease-out)] group-hover/icon:delay-400 md:block"
      >
        {displayLabel}
      </span>
    </a>
  )
}
