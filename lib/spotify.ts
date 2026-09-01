export type Song = {
  id: string
  title: string
  artist: string
  art: string
  href: string
}

function extractTrackId(url: string): string | null {
  const match = url.match(/track\/([a-zA-Z0-9]+)/)
  return match?.[1] ?? null
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
}

function extractMetaContent(html: string, property: string): string | null {
  const match = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`))
  return match ? decodeHtmlEntities(match[1]) : null
}

// Spotify's public track page exposes title/artist/art via Open Graph meta
// tags — auth-free, but unofficial, so it could break if the markup changes.
async function getTrackMetadata(url: string): Promise<Song | null> {
  const id = extractTrackId(url)
  if (!id) return null

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null

    const html = await res.text()
    const title = extractMetaContent(html, "og:title")
    const description = extractMetaContent(html, "og:description")
    const art = extractMetaContent(html, "og:image")
    if (!title || !description || !art) return null

    const artist = description.split(" · ")[0]
    const href = extractMetaContent(html, "og:url") ?? url

    return { id, title, artist, art, href }
  } catch (err) {
    console.error(`Spotify metadata fetch failed for ${url}:`, err)
    return null
  }
}

export async function getTracksByUrls(urls: string[]): Promise<Song[] | null> {
  const results = await Promise.all(urls.map(getTrackMetadata))
  const songs = results.filter((song): song is Song => song !== null)
  return songs.length > 0 ? songs : null
}
