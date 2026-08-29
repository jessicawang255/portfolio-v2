import type { Metadata } from "next"
import { AboutContent } from "@/components/sections/AboutContent"
import { getTracksByUrls } from "@/lib/spotify"

// No description/openGraph/twitter here on purpose — the root layout's
// site-wide versions (and its one OG image) carry through unchanged.
export const metadata: Metadata = {
  title: "About",
}

const PLAYLIST_URLS = [
  "https://open.spotify.com/track/3heQu7YLQFf0WY4Z2giXhk",
  "https://open.spotify.com/track/6XuQzFKU3rJNNEEs6lyIuQ",
  "https://open.spotify.com/track/7Dexi5Z2IowCkHrnzlWysc",
  "https://open.spotify.com/track/5K8lOqPnsWh9QNSgNBqhO2",
  "https://open.spotify.com/track/6wm3t4VpTxSFfOUgTMlHZM",
  "https://open.spotify.com/track/5DTqcZlVd7HmXxRAIcWKZo",
  "https://open.spotify.com/track/5cvFePHQn46kDhgruTPV3M",
  "https://open.spotify.com/track/15vg0v6tZ1y8aZfpdz2KRY",
  "https://open.spotify.com/track/5YIVVzQcJG7pFhyNo0Ytlh",
]

export default async function AboutPage() {
  const spotifyPlaylist = await getTracksByUrls(PLAYLIST_URLS)
  return <AboutContent spotifyPlaylist={spotifyPlaylist} />
}
