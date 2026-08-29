# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server (requires build first)
```

There are no tests configured yet.

## Git workflow

Commit in small, specific increments rather than bundling several unrelated changes into one commit. Keep commit messages brief and simple (a short, plain-language summary — no elaborate bodies).

Don't commit after every small edit — the user may be experimenting. Commit when a distinct chunk of work is actually finished: a bug is fixed, a feature works end-to-end, a refactor lands cleanly. Style/visual tweaks and in-progress exploration should stay uncommitted until they settle.

## Stack

- **Next.js 16.2.7** with App Router — read `node_modules/next/dist/docs/01-app/` before writing routing or rendering code; this version has breaking changes from prior releases
- **React 19.2.4**
- **Tailwind CSS v4** — configured entirely in CSS, not via `tailwind.config.js`
- **TypeScript**

## Architecture

This is a single-route App Router project. All pages live under `app/`:

- `app/layout.tsx` — root layout; sets up Geist fonts via CSS variables (`--font-geist-sans`, `--font-geist-mono`) and applies them through `@theme inline` in `globals.css`
- `app/page.tsx` — home page (currently the Create Next App placeholder, to be replaced with portfolio content)
- `app/globals.css` — global styles; uses `@import "tailwindcss"` (Tailwind v4 syntax) and defines `--background`/`--foreground` CSS variables with dark mode via `@media (prefers-color-scheme: dark)`

## Tailwind v4 notes

Tailwind v4 drops `tailwind.config.js` — theme customization goes in CSS using `@theme`:

Use `@import "tailwindcss"` at the top of the CSS entry point, not the old `@tailwind base/components/utilities` directives.
