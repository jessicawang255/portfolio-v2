<p>
  <img src="app/icon.svg" width="64" height="64" alt="Jessica Wang logo" />
</p>

<h1>Jessica Wang · Product Designer</h1>

<p>Hi, I'm Jessica. Welcome to the source for my product design portfolio, and my little corner of the internet. Designed in Figma, built with Next.js.</p>

## What you'll find

- **Home**: landing page and project index
- **Case studies**: in-depth write-ups:
  - `hack-western`: designing an inviting application experience for 2,000 hackers
  - `retrospect`: a digital time capsule to capture memories with friends
  - `glucal`: easing the daily burdens of diabetes management
  - `autumn`: boosting discovery for a grief support platform
- **About**: my experiences, communities, hobbies, and favourite songs
- More coming soon!

## Tech stack
- Framework: Next.js App Router
- Styling: Tailwind CSS
- Language: TypeScript
- Animation: Framer Motion, Lottie
- Data: Redis (page view counts), Spotify Web API (about page playlist)
- Analytics: Vercel Analytics
- Deployment: Vercel

## Project structure

```
app/                  routes (App Router)
  (home)/             landing page
  about/               about page
  work/[slug]/        case study pages
  api/views/           view-count endpoint (Redis)
content/              case study copy & section data
components/
  ui/ layout/ sections/ cs/ motion/
lib/                  shared utilities (site config, Spotify, motion helpers)
public/               static assets & images
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` with:

```
REDIS_URL=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

`NEXT_PUBLIC_SITE_URL` can also be set to override the canonical site URL used for metadata and OG images (defaults to the Vercel deployment URL).

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm start        # start production server (run build first)
npm run lint     # run ESLint
```

## Deployment

Deployed on [Vercel](https://vercel.com), building from the `main` branch.

## Ownership

Designed and built by Jessica Wang. All content, case studies, and imagery are my own!
