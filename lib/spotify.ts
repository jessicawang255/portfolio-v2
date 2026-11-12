import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from "obscenity"

export type Song = {
  id: string
  title: string
  artist: string
  art: string
  href: string
}

type SpotifyTrack = {
  id: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[] }
  external_urls: { spotify: string }
}

// Explicit songs are fine; only the title text shows on the site, so titles
// with profanity are skipped. The asterisk check catches already-censored
// titles ("F**k"), which obscenity's matcher doesn't.
const profanityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})
const CENSORED_WORD = /\w\*+\w/

function hasProfanity(title: string): boolean {
  return profanityMatcher.hasMatch(title) || CENSORED_WORD.test(title)
}

async function getAccessToken(): Promise<string | null> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN }),
  })
  if (!res.ok) return null

  const data: { access_token?: string } = await res.json()
  return data.access_token ?? null
}

// medium_term is Spotify's ~6-month window. Requires the refresh token to
// carry the user-top-read scope.
export async function getTopTracks(limit: number): Promise<Song[] | null> {
  try {
    const token = await getAccessToken()
    if (!token) return null

    // Over-fetch (50 is the API max) so filtered titles get backfilled.
    const res = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50",
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!res.ok) {
      console.error(`Spotify top tracks fetch failed: ${res.status}`)
      return null
    }

    const data: { items: SpotifyTrack[] } = await res.json()
    const songs = data.items
      .filter((track) => !hasProfanity(track.name))
      .slice(0, limit)
      .map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        art: track.album.images[0]?.url ?? "",
        href: track.external_urls.spotify,
      }))
    return songs.length > 0 ? songs : null
  } catch (err) {
    console.error("Spotify top tracks fetch failed:", err)
    return null
  }
}
