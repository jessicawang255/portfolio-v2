import { HeroShell } from "@/components/layout/HeroShell"
import { AboutHero } from "@/components/sections/AboutHero"

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroShell fallbackSpacer={340}>
        <AboutHero />
      </HeroShell>
      <main id="main-frame" className="relative z-10 flex-1 bg-surface">
        {children}
      </main>
    </>
  )
}
