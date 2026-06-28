import { Hero } from "@/components/sections/Hero"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Hero />
      <main id="main-frame" className="relative z-10 flex-1 bg-surface">
        {children}
      </main>
    </>
  )
}
