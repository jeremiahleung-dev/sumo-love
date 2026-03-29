# CLAUDE.md

This file provides guidance to AI assistants (Claude and others) working in this repository.

## Repository Overview

**Repository:** `jeremiahleung-dev/sumo-love`
**Description:** Live sumo basho tracker — follow Makuuchi and Sanyaku rikishi through every tournament.
**Deploy target:** Vercel
**Status:** Active development

---

## Development Branch

Always develop on the designated feature branch. Do **not** push directly to `main` without explicit permission.

---

## Project Structure

```
sumo-love/
├── prisma/
│   ├── schema.prisma         # DB models: Rikishi, Basho, BashoEntry, Match, Kimarite
│   └── seed.ts               # Seeds all ~82 kimarite techniques
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout (Navbar, Footer, fonts)
│   │   ├── page.tsx          # Home: hero + live standings + featured rikishi
│   │   ├── rikishi/
│   │   │   ├── page.tsx      # Rikishi roster (Sanyaku + Maegashira)
│   │   │   └── [id]/page.tsx # Rikishi profile: stats, career history
│   │   ├── basho/
│   │   │   ├── page.tsx      # Basho archive by year
│   │   │   └── [id]/page.tsx # Basho detail: standings + day-by-day bouts
│   │   ├── kimarite/
│   │   │   ├── page.tsx      # Techniques encyclopedia (filterable by category)
│   │   │   └── [id]/page.tsx # Technique detail with animation + example matches
│   │   └── api/
│   │       ├── sync/route.ts           # POST — cron data sync
│   │       ├── rikishi/route.ts        # GET rikishi list
│   │       └── basho/[id]/route.ts     # GET basho detail
│   ├── components/
│   │   ├── layout/Navbar.tsx
│   │   ├── layout/Footer.tsx
│   │   ├── ui/
│   │   │   ├── RankBadge.tsx           # Yokozuna / Ozeki / etc. coloured badge
│   │   │   ├── RecordPill.tsx          # "10W – 5L" display
│   │   │   └── YoutubeEmbed.tsx        # Lazy-load YouTube embed with thumbnail
│   │   ├── rikishi/RikishiCard.tsx
│   │   ├── basho/
│   │   │   ├── LeaderBoard.tsx         # Standings table
│   │   │   └── MatchRow.tsx            # Bout row with inline highlight toggle
│   │   └── kimarite/
│   │       ├── KimariteCard.tsx
│   │       └── animations/             # Framer Motion SVG animations
│   │           ├── PushAnimation.tsx
│   │           ├── ThrowAnimation.tsx
│   │           ├── TripAnimation.tsx
│   │           ├── LiftAnimation.tsx
│   │           ├── TwistAnimation.tsx
│   │           ├── SpecialAnimation.tsx
│   │           └── PullAnimation.tsx   (reuses PushAnimation)
│   └── lib/
│       ├── db.ts                       # Prisma client singleton
│       ├── sumo-api/
│       │   ├── client.ts               # Typed fetch wrapper for sumo-api.com
│       │   └── types.ts                # API response type definitions
│       ├── scraper/
│       │   ├── jsa.ts                  # Cheerio scraper for sumo.or.jp photos
│       │   └── youtube.ts              # YouTube Data API highlight search
│       ├── sync.ts                     # Full sync orchestrator (called by /api/sync)
│       └── kimarite-seed-data.ts       # ~82 kimarite with EN descriptions
├── public/
├── vercel.json                         # Cron: POST /api/sync daily at 07:00 UTC
├── .env.example
└── CLAUDE.md
```

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| ORM | Prisma |
| Database | Neon (serverless PostgreSQL) |
| Data source A | sumo-api.com (rankings, basho results, rikishi) |
| Data source B | sumo.or.jp via Cheerio (rikishi photos) |
| Highlights | YouTube Data API + JSA channel |
| Cron | Vercel Cron Jobs |
| Icons | Lucide React |
| Fonts | Noto Serif JP (display) + Inter (body) |

---

## Getting Started

```bash
npm install

# Copy and fill in env vars
cp .env.example .env

# Push schema to Neon DB
npm run db:push

# Seed kimarite techniques
npm run db:seed

# Start dev server
npm run dev
```

### Initial Data Load

```bash
# Trigger a full sync (pulls from sumo-api.com + scrapers)
curl -X POST http://localhost:3000/api/sync \
  -H "x-cron-secret: your_cron_secret"
```

---

## Development Workflow

### Making Changes

1. Branch from `main` (or the designated base branch).
2. Make focused, atomic commits with clear messages.
3. Run tests before pushing.
4. Open a pull request for review.

### Commit Message Style

Use concise imperative messages:

```
Add rikishi profile page with career stats
Fix kimarite seed data deduplication
Update sync to handle missing basho days gracefully
```

---

## Data Flow

```
Cron (daily) → POST /api/sync
                 → sync.ts
                   → sumo-api.com: fetchBanzuke(), fetchTorikumi()
                   → jsa.ts: scrapeRikishiPhoto()
                   → youtube.ts: findMatchHighlight()
                   → Prisma upserts → Neon DB
                 → Pages read from DB at request time
```

### sumo-api.com Endpoints

- `GET /api/rikishi` — all active rikishi
- `GET /api/rikishi/{id}` — rikishi profile
- `GET /api/basho/{id}/banzuke` — standings
- `GET /api/basho/{id}/torikumi/{day}` — day's match results

---

## Database Schema (key models)

- **Rikishi** — profile, rank, stable, stats, image
- **Basho** — tournament metadata (name JP/EN, location, dates, isActive flag)
- **BashoEntry** — rikishi record in a specific basho (wins/losses, yusho, prize)
- **Match** — individual bout (day, east/west rikishi, winner, kimarite, highlightUrl)
- **Kimarite** — winning technique (nameJp, nameEn, category, description, animationId)

---

## Design System

```
Colors:
  --crimson:  #C0292A   (primary: rank badges, CTAs, active states)
  --ink:      #1A1A1A   (text, dark headers)
  --rice:     #FAF7F2   (page background)
  --clay:     #D4A97A   (accent, subtext)
  --sand:     #EDE0CC   (card borders, subtle backgrounds)
  --jade:     #2D6A4F   (win indicator)

Typography:
  Display: Noto Serif JP — shikona names, headings
  Body:    Inter — everything else
  Mono:    system mono — records, IDs

Rank badge colours:
  Yokozuna  → crimson (#C0292A) + white text
  Ozeki     → dark red (#8B1A1A) + white text
  Sekiwake  → clay (#D4A97A) + ink text
  Komusubi  → sand (#EDE0CC) + ink text
  Maegashira→ ink (#1A1A1A) + rice text
```

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `YOUTUBE_API_KEY` | No | YouTube Data API v3 key for highlight lookup |
| `CRON_SECRET` | Yes (prod) | Bearer token securing /api/sync |

Never commit `.env` or any secrets to the repository.

---

## Testing

```bash
npm run lint       # ESLint check
npm run build      # TypeScript + Next.js build (catches type errors)
```

All type errors must resolve before merging.

---

## Code Conventions

- Keep functions small and single-purpose.
- Validate at system boundaries (user input, external APIs); trust internal code.
- Do not add speculative abstractions.
- Do not leave dead code.
- All external API calls have `try/catch` and degrade gracefully (highlights, photos are optional).

---

## AI Assistant Guidelines

When working in this repository:

1. **Read before editing** — always read a file before modifying it.
2. **Minimal scope** — make only the changes requested; do not refactor surrounding code.
3. **No speculative features** — do not add config options, flags, or abstractions that weren't asked for.
4. **No extra documentation** — do not add docstrings, type annotations, or comments to code you didn't change.
5. **Security** — never introduce command injection, XSS, SQL injection, or other OWASP Top 10 vulnerabilities.
6. **Destructive operations** — confirm with the user before deleting files, force-pushing, or resetting history.
7. **Branch discipline** — develop on the designated branch; never push to `main` directly.
8. **Commit hygiene** — create new commits rather than amending. Never skip hooks (`--no-verify`).

---

## CI/CD

Deployed via Vercel. Push to the feature branch triggers a Vercel preview deploy.
`vercel.json` configures the daily cron job (`POST /api/sync` at 07:00 UTC).

---

_Last updated: 2026-03-29_
