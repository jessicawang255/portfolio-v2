import { ViewTransition } from "react"
import type { Metadata, Viewport } from "next"
import { Roboto_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { DotField } from "@/components/ui/DotField"
import { Nav } from "@/components/layout/Nav"
import { MobileNav } from "@/components/layout/MobileNav"
import { Footer } from "@/components/layout/Footer"
import { ScrollRevealController } from "@/components/layout/ScrollRevealController"
import { ScrollToTop } from "@/components/layout/ScrollToTop"
import { siteDescription, siteName, siteUrl } from "@/lib/site"
import "./globals.css"

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})

const defaultTitle = "Jessica Wang · Product Designer"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s · Jessica Wang",
    default: defaultTitle,
  },
  description: siteDescription,
  openGraph: {
    title: defaultTitle,
    description: siteDescription,
    url: "/",
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteDescription,
  },
}

// Matches --color-chrome (#F9FAFB) so mobile Safari's UI chrome blends into
// the page background — the site has no dark mode to branch on.
export const viewport: Viewport = {
  themeColor: "#F9FAFB",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${robotoMono.variable} flex min-h-screen flex-col`}>
        <DotField viewport />
        <Nav />
        <ViewTransition name="page-content">{children}</ViewTransition>
        <Footer />
        <MobileNav />
        <ScrollRevealController frameId="main-frame" heroId="hero-content" heroFrameId="hero-content" />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  )
}
