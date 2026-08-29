import { createClient, type RedisClientType } from "redis"
import { NextResponse } from "next/server"

// Single sitewide counter — the footer is a fixture in the root layout,
// identical on every page, so there's no per-route count to key off of.
const VIEWS_KEY = "site:views"

// Vercel's Redis marketplace product (Upstash-backed) only exposes a plain
// `REDIS_URL` connection string — no REST API credentials — so this talks
// node-redis over TCP rather than Upstash's REST client. Client + in-flight
// connection promise are kept at module scope: Node reuses that scope across
// warm invocations of the same serverless instance, so a warm request skips
// reconnecting, and two cold requests racing to connect both await the same
// promise instead of opening two connections. `REDIS_URL` isn't provisioned
// locally until `vercel env pull` (see .env.local), so a missing var just
// skips connecting and every handler below falls back to `{ count: 0 }`.
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

// Read-only — used once a visitor's session has already counted its view,
// so re-fetching the total (e.g. a second tab, or remounting after a hard
// refresh later in the same session) doesn't increment it again.
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
