import { createClient, type RedisClientType } from "redis"
import { NextResponse } from "next/server"

// Single sitewide counter — the footer is a fixture in the root layout,
// identical on every page, so there's no per-route count to key off of.
const VIEWS_KEY = "site:views"

// Vercel's Redis marketplace product only exposes a plain REDIS_URL
// connection string (no REST credentials), so this talks node-redis over
// TCP. Client + connect promise live at module scope so warm invocations
// reuse the connection, and concurrent cold starts share one connect()
// call instead of racing. REDIS_URL isn't set locally without
// `vercel env pull`, so a missing var just skips connecting and every
// handler falls back to `{ count: 0 }`.
let client: RedisClientType | null = null
let connecting: Promise<RedisClientType> | null = null

function getClient(): Promise<RedisClientType> | null {
  if (!process.env.REDIS_URL) return null
  if (client?.isOpen) return Promise.resolve(client)
  if (!connecting) {
    const next = createClient({ url: process.env.REDIS_URL }) as RedisClientType
    // node-redis emits 'error' on connection drops — without a listener that
    // crashes the process instead of just failing the in-flight command.
    next.on("error", () => {})
    connecting = next.connect().then(() => {
      client = next
      return next
    })
  }
  return connecting
}

// Read-only — used once a session has already counted its view, so
// re-fetching the total doesn't increment it again.
export async function GET() {
  const redis = await getClient()
  if (!redis) return NextResponse.json({ count: 0 })
  const raw = await redis.get(VIEWS_KEY)
  return NextResponse.json({ count: raw ? Number(raw) : 0 })
}

// Increments and returns the new total in one round trip. Called at most
// once per browser session — see ViewCounter in Footer.tsx.
export async function POST() {
  const redis = await getClient()
  if (!redis) return NextResponse.json({ count: 0 })
  const count = await redis.incr(VIEWS_KEY)
  return NextResponse.json({ count })
}
