import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

// Single sitewide counter — the footer is a fixture in the root layout,
// identical on every page, so there's no per-route count to key off of.
const VIEWS_KEY = "site:views"

// Only constructed when both env vars are present. Upstash isn't provisioned
// yet locally (see .env.local) — falling back to a null client (rather than
// letting `Redis.fromEnv()` throw) keeps `npm run dev`/`npm run build`
// working before the Vercel integration is set up.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

// Read-only — used once a visitor's session has already counted its view,
// so re-fetching the total (e.g. a second tab, or remounting after a hard
// refresh later in the same session) doesn't increment it again.
export async function GET() {
  if (!redis) return NextResponse.json({ count: 0 })
  const count = (await redis.get<number>(VIEWS_KEY)) ?? 0
  return NextResponse.json({ count })
}

// Increments and returns the new total in one round trip. Called at most
// once per browser session — see ViewCounter in Footer.tsx.
export async function POST() {
  if (!redis) return NextResponse.json({ count: 0 })
  const count = await redis.incr(VIEWS_KEY)
  return NextResponse.json({ count })
}
