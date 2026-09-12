import type { Metadata } from "next"
import { TertiaryLink } from "@/components/ui/TertiaryLink"
import { HideFooter } from "@/components/layout/HideFooter"

export const metadata: Metadata = {
  title: "Page Not Found",
}

export default function NotFound() {
  return (
    <>
      <HideFooter />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative flex flex-col items-center gap-6">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-full mb-6 select-none font-mono text-[length:clamp(3.5rem,16vw,12rem)] font-medium leading-none text-neutral-100"
          >
            404
          </span>
          <h1 className="max-w-md">Oh no! This page could not be found.</h1>
          <TertiaryLink href="/" icon={{ type: "custom", src: "/icon.svg", alt: "Jessica Wang" }}>
            Go back home
          </TertiaryLink>
        </div>
      </main>
    </>
  )
}
