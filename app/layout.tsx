import type { Metadata } from "next"
import { Nav } from "@/components/layout/Nav"
import { Footer } from "@/components/layout/Footer"
import { ScrollRadiusController } from "@/components/layout/ScrollRadiusController"
import "./globals.css"

export const metadata: Metadata = {
  title: "Jessica Wang — Product Designer",
  description:
    "Portfolio of Jessica Wang, a product designer focused on interaction design and thoughtful user experiences.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main id="main-frame" className="relative z-10 mb-2 flex-1 bg-surface">
          {children}
        </main>
        <Footer />
        <ScrollRadiusController />
      </body>
    </html>
  )
}
