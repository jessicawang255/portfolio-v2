import { ViewTransition } from "react"
import type { Metadata } from "next"
import { DotBackground } from "@/components/layout/DotBackground"
import { Nav } from "@/components/layout/Nav"
import { Footer } from "@/components/layout/Footer"
import { ScrollRadiusController } from "@/components/layout/ScrollRadiusController"
import "./globals.css"

export const metadata: Metadata = {
  title: "Jessica Wang",
  description:
    "I'm Jessica. I'm a product designer. 🥑",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <DotBackground />
        <Nav />
        <ViewTransition name="page-content">{children}</ViewTransition>
        <Footer />
        <ScrollRadiusController />
      </body>
    </html>
  )
}
