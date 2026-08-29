// Canonical production URL, used to build metadataBase, OG/twitter tags,
// robots.ts, and sitemap.ts. Override with NEXT_PUBLIC_SITE_URL once the
// custom domain is live — everything downstream reads from here.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-v2-two-lovat-90.vercel.app"

export const siteName = "Jessica Wang"

// Reused everywhere (meta description, OG/twitter descriptions) so they
// stay in sync with each other instead of drifting.
export const siteDescription = "I design and build thoughtful things."
