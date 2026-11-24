"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type FigmaEmbedProps = {
  // Any Figma share link (file, prototype, or Slides deck). It must be
  // shared as "Anyone with the link can view", or visitors see a login wall.
  url: string
  title: string
  openLabel?: string
  closeLabel?: string
}

const EXPAND = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }

// An optional walkthrough behind a toggle. The iframe only mounts once it's
// opened, since Figma's player is heavy and most readers will skip it.
export function FigmaEmbed({ url, title, openLabel = "Watch the walkthrough", closeLabel = "Hide walkthrough" }: FigmaEmbedProps) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const panelId = useId()
  const src = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`

  return (
    <div className="flex w-full flex-col items-start">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        // TertiaryLink's treatment (components/ui/TertiaryLink), as a button.
        className="group inline-flex cursor-pointer items-center gap-1 text-base leading-normal text-neutral-700 transition-colors duration-150 hover:text-neutral-900 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {/* Right when closed, rotating down to point at the open panel. */}
        <span
          aria-hidden="true"
          className={`block h-4 w-4 bg-current transition-transform duration-base ease-out ${open ? "rotate-90" : ""}`}
          style={{
            WebkitMaskImage: "url(/icons/arrow-right-s-line.svg)",
            maskImage: "url(/icons/arrow-right-s-line.svg)",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        />
        <span className="underline decoration-current/30 underline-offset-[0.14em] transition-[text-decoration-color] duration-150 group-hover:decoration-current/100">
          {open ? closeLabel : openLabel}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="w-full overflow-hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={EXPAND}
          >
            <div className="pt-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-[8px] border border-media-stroke bg-neutral-900">
                <iframe
                  src={src}
                  title={title}
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
