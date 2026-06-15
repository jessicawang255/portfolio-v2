export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-frame" className="relative z-10 flex-1 bg-surface">
      {children}
    </main>
  )
}
