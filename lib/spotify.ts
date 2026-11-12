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

// Explicit songs are fine; only the title text shows on the site. Stems
// catch variants ("fucking", "shitty"); short words that are prefixes of
// innocent ones ("ass" → "assume") match exactly.
const BLOCKED_STEMS = ["fuck", "shit", "bitch", "cunt", "pussy", "motherf", "bastard", "whore", "slut", "nigg", "fag"]
const BLOCKED_WORDS = ["ass", "asses", "asshole", "assholes", "cock", "cocks", "damn", "dick", "dicks", "dickhead", "goddamn", "hoe", "hoes", "piss", "pissed", "tits", "twat"]
const BLOCKED_TITLE = new RegExp(
  `\\b(?:(?:${BLOCKED_STEMS.join("|")})\\w*|(?:${BLOCKED_WORDS.join("|")})\\b)|\\w\\*+\\w`,
  "i",
)

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
      .filter((track) => !BLOCKED_TITLE.test(track.name))
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
