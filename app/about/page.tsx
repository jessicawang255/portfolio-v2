import type { Metadata } from "next"
import { AboutContent } from "@/components/sections/AboutContent"
import { getTopTracks } from "@/lib/spotify"

// No description/openGraph/twitter here on purpose — the root layout's
// site-wide versions (and its one OG image) carry through unchanged.
export const metadata: Metadata = {
  title: "About",
}

// Re-fetch top tracks at most once a day.
export const revalidate = 86400

// The playlist grid is laid out for 9 rows (3×3 / 2-col×5 / 1-col).
const PLAYLIST_LENGTH = 9

export default async function AboutPage() {
  const spotifyPlaylist = await getTopTracks(PLAYLIST_LENGTH)
  return <AboutContent spotifyPlaylist={spotifyPlaylist} />
}
