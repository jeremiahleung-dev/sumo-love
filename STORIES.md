# User Stories — Sumo Love

User types referenced throughout:
- **Casual viewer** — watches sumo occasionally, needs context to follow along
- **Regular fan** — follows basho actively, knows the ranks and top wrestlers
- **Enthusiast** — deep knowledge of sumo, wants data and detail
- **New fan** — just discovered sumo, learning the sport from scratch

---

## Pages

---

### Home Page (`/`)

**US-01** — Live tournament pulse
> As a regular fan, I want to see the current basho standings the moment I open the app, so that I can check where my favourite wrestlers stand without navigating anywhere.

Acceptance criteria:
- Active basho standings are visible above the fold
- Top 15 wrestlers shown, sorted by wins
- Each entry links to the wrestler's profile
- If no basho is active, the most recent basho's final standings are shown instead
- "LIVE" label is present during an active basho

---

**US-02** — Featured wrestlers at a glance
> As a casual viewer, I want to see the top-ranked wrestlers (Yokozuna and Ozeki) with photos and their current record, so that I know who the stars are without having to search.

Acceptance criteria:
- At least 4 top-ranked wrestlers displayed with photo, rank badge, and current record
- Cards link to individual profiles
- Fallback character (力) shown when photo is unavailable

---

**US-03** — Recent highlights
> As a casual viewer, I want to watch recent bout highlights directly on the home page, so that I can catch up on the action without leaving the app.

Acceptance criteria:
- Up to 3 recent bouts with YouTube highlights are shown
- Videos are lazy-loaded (thumbnail shown first, iframe loads on click)
- Each highlight shows which wrestlers fought

---

**US-04** — Empty state guidance
> As a new visitor before any data is synced, I want to see a helpful message instead of a blank page, so that I understand the app and know what to do next.

Acceptance criteria:
- If no active basho data exists, a clear empty state is shown
- CTA directs the user to browse kimarite or understand the app

---

### Rikishi Archive (`/rikishi`)

**US-05** — Browse all active wrestlers
> As a regular fan, I want to browse the full banzuke (ranking list) grouped by rank tier, so that I can quickly find any wrestler by their position.

Acceptance criteria:
- Wrestlers grouped into Sanyaku, Maegashira, and Other sections
- Each section has a clear visual divider and label
- Wrestlers within each group sorted by rank (Yokozuna first, then by number)
- Total wrestler count shown in the header

---

**US-06** — Recognise wrestlers visually
> As a casual viewer, I want to see wrestler photos and rank badges together, so that I can recognise faces and understand status at the same time.

Acceptance criteria:
- Photo displayed at consistent 3:4 aspect ratio
- Rank badge overlaid on photo (colour-coded by rank tier)
- Fallback character (力) shown when photo unavailable

---

**US-07** — Quick record check
> As a regular fan browsing the roster during a live basho, I want to see each wrestler's current tournament record on their card, so that I can scan standings while browsing.

Acceptance criteria:
- Current basho wins-losses-absences shown on each card
- Record visible without needing to open the profile

---

### Rikishi Profile (`/rikishi/[id]`)

**US-08** — Wrestler career overview
> As an enthusiast, I want to see a wrestler's career summary — total wins, win rate, championship count, and basho count — so that I can assess their overall record at a glance.

Acceptance criteria:
- Stats calculated from last 12 basho
- Win rate displayed as a percentage
- Yusho count highlighted in red if greater than zero
- All four stats visible in a 2×2 grid above the fold

---

**US-09** — Tournament history
> As a regular fan, I want to see a wrestler's performance across recent tournaments, so that I can track whether they are improving, declining, or peaking.

Acceptance criteria:
- Last 12 basho shown in reverse chronological order
- Each row shows: basho name (linked), rank held, win-loss-absence record, any prize won
- Champion basho rows visually highlighted
- Basho names link to the basho detail page

---

**US-10** — Physical and personal profile
> As a new fan, I want to know a wrestler's height, weight, birthdate, hometown, debut date, and stable, so that I can connect with them as a person beyond just their ranking.

Acceptance criteria:
- All available profile fields displayed (with graceful omission if data missing)
- Optional biography section shown when available
- Stable name displayed

---

### Basho Archive (`/basho`)

**US-11** — Find any tournament
> As an enthusiast, I want to browse all past tournaments organised by year, so that I can find a specific basho quickly without remembering its exact date.

Acceptance criteria:
- All basho grouped by year, descending (most recent at top)
- Each card shows: tournament name (JP + EN), location, date range, champion, bout count
- Active basho pinned at the top with a "LIVE" badge

---

**US-12** — Know who won at a glance
> As a casual viewer browsing past tournaments, I want to see the champion for each basho without opening the detail page, so that I can quickly scan historical results.

Acceptance criteria:
- Champion's name shown on the basho card with a trophy icon
- If no champion recorded, the field is gracefully omitted

---

### Basho Detail (`/basho/[id]`)

**US-13** — Live standings during a basho
> As a regular fan following a live basho, I want to see the current standings table sorted by wins, so that I can track who is in the yusho race.

Acceptance criteria:
- Standings table always visible alongside the bout list
- Sorted by wins descending, losses ascending
- Leader row visually highlighted
- Champion badge shown if basho is complete

---

**US-14** — Day-by-day bout results
> As an enthusiast, I want to see every bout from every day of the basho with the winning technique listed, so that I can analyse how wrestlers are winning and losing.

Acceptance criteria:
- Bouts grouped by day, with each day clearly labelled
- Each bout shows: east wrestler, west wrestler, winner (indicated), kimarite used
- Kimarite name links to the technique detail page
- Loser's name visually dimmed; winner indicated with green marker

---

**US-15** — Watch highlights in context
> As a casual viewer, I want to watch a bout highlight without leaving the standings page, so that I can watch the action and immediately see its impact on the leaderboard.

Acceptance criteria:
- Play button shown on bouts that have a highlight video
- Clicking expands an embedded YouTube player inline (does not navigate away)
- Video is lazy-loaded (thumbnail first)

---

### Kimarite Encyclopedia (`/kimarite`)

**US-16** — Discover winning techniques
> As a new fan, I want to browse all 82 official kimarite organised by category, so that I can learn the names and meanings of the techniques I see announced during bouts.

Acceptance criteria:
- All techniques displayed in a grid
- Grouped by category when viewing "All"
- Each card shows technique name (EN + JP), category badge, description excerpt, and usage count

---

**US-17** — Filter by technique type
> As a casual viewer who just saw a throw-based finish, I want to filter techniques by category (e.g. "Throw"), so that I can quickly find and learn the specific move I'm curious about.

Acceptance criteria:
- Filter tabs visible at top of page: All + one per category
- Selecting a category filters the grid immediately (no page reload)
- Active tab visually distinct from inactive tabs
- Tabs only shown for categories that have at least one technique

---

### Kimarite Detail (`/kimarite/[id]`)

**US-18** — Understand how a technique works
> As a new fan who just heard an unfamiliar technique name called, I want to see an animation and plain-English description of the move, so that I understand what happened in the bout.

Acceptance criteria:
- Animated SVG illustration plays automatically (loops)
- Technique name shown in both English and Japanese
- Category badge visible
- Plain-English description explains the technique
- Total number of recorded uses shown for context

---

**US-19** — See the technique used in real bouts
> As an enthusiast, I want to see recent bouts where a specific technique was used, so that I can watch examples and understand the technique in context.

Acceptance criteria:
- Up to 10 most recent bouts using this technique are listed
- Each bout shows: wrestlers involved, basho, day
- Play button shown if a highlight video exists
- Bout rows consistent with the rest of the app (MatchRow component)

---

## Key Components

---

### LeaderBoard

**US-20** — Scan standings at speed
> As a regular fan, I want to read the standings table in seconds, so that I don't have to do mental work to understand the race.

Acceptance criteria:
- Rank number, wrestler name, rank badge, and win-loss record all visible per row
- Row 1 highlighted to signal the leader
- Champion badge ("優勝") shown if basho is complete
- Wrestler names are clickable links to their profiles
- Default sort: wins descending, losses ascending

---

### MatchRow

**US-21** — Read a bout result clearly
> As a casual viewer, I want to understand who won a bout and how, with the loser clearly distinguished from the winner, so that I don't have to guess.

Acceptance criteria:
- Winner's name full-opacity; loser's name dimmed
- Winner indicated with a green bullet (●)
- Kimarite shown as a link between the two names
- East/West orientation preserved (east on left, west on right)

---

**US-22** — Expand a highlight without losing context
> As a regular fan reading through a day's bouts, I want to watch a highlight inline without the page jumping or navigating away, so that I can watch and continue reading.

Acceptance criteria:
- Play button only visible when a highlight URL exists
- Clicking toggles the video embed open/closed
- Rest of the bout list remains visible while video plays

---

### RikishiCard

**US-23** — Identify a wrestler instantly
> As any user, I want to recognise wrestlers from their card by photo, name, and rank badge, so that I can pick them out of a grid without reading every name.

Acceptance criteria:
- Photo fills the card at consistent 3:4 ratio
- Rank badge colour-coded and overlaid on photo corner
- Ring name (EN) and shikona (JP) both shown
- Stable name shown below
- Entire card is a clickable link to the profile

---

### KimariteCard

**US-24** — Evaluate a technique from the card
> As a new fan browsing techniques, I want to understand the category and gist of a technique from the card alone, so that I can decide which ones to explore further.

Acceptance criteria:
- Technique name in English and Japanese
- Category badge visible on the card
- Two-line description excerpt shown
- Usage count shown (how many recorded bouts used it)
- Card links to technique detail page

---

### RankBadge

**US-25** — Read rank without knowing Japanese
> As a new fan who doesn't know the rank system, I want rank badges to be colour-coded consistently, so that I can visually distinguish top-tier wrestlers from lower-ranked ones over time.

Acceptance criteria:
- Yokozuna: red
- Ozeki: dark red
- Sekiwake: gold
- Komusubi: tan/cream
- Maegashira: dark/black
- Badge always shows the full rank label (e.g. "Maegashira 3")
- Two sizes available (sm, md) for use in different contexts

---

### RecordPill

**US-26** — Read a win-loss record at a glance
> As any user, I want win-loss-absence records to be colour-coded and consistently formatted, so that I instantly know how a wrestler is performing without reading every number.

Acceptance criteria:
- Wins in green, losses in red, absences in gold
- Win percentage shown in parentheses for wrestlers with 15+ bouts
- Format: `10W – 5L` or `10W – 5L (67%)`
- Monospace font for alignment in tables

---

### YoutubeEmbed

**US-27** — Watch highlights without slowing the page
> As any user on a slower connection, I want video thumbnails to load instead of iframes by default, so that the page is fast even when many highlights are listed.

Acceptance criteria:
- Thumbnail shown on load; iframe only inserted after user clicks play
- Uses youtube-nocookie.com domain for privacy
- Returns nothing (no broken embed) if the video URL is invalid

---

### KimariteAnimation

**US-28** — See the technique before reading about it
> As a new fan landing on a technique page, I want an animation that shows the move immediately, so that I understand it visually before processing the text.

Acceptance criteria:
- Animation plays automatically and loops
- Each of the 7 technique categories has a distinct animation
- Falls back to a generic animation if the category is unrecognised
- Animation uses two stylised wrestler figures

---

### Navbar

**US-29** — Navigate from anywhere
> As any user, I want the navigation to always be accessible regardless of how far I've scrolled, so that I can move between sections without scrolling back to the top.

Acceptance criteria:
- Navbar is sticky (stays at top of viewport while scrolling)
- Links: Rikishi, Basho, Kimarite always visible on desktop
- Mobile: hamburger menu toggles a slide-out nav
- Active page link visually highlighted
- Logo links back to home

---

### Footer

**US-30** — Understand the app's sources and scope
> As a curious user, I want to know where the data comes from and that this is a fan project, so that I understand its limitations and can trust the information.

Acceptance criteria:
- Data sources linked (JSA, Sumo API)
- Disclaimer states: "Fan-made tracker. Not affiliated with the Japan Sumo Association."
- Navigation links duplicated in footer for convenience

---

## Summary Table

| ID | Page / Component | User Type | Core Need |
|----|-----------------|-----------|-----------|
| US-01 | Home | Regular fan | Live standings on load |
| US-02 | Home | Casual viewer | Featured wrestlers at a glance |
| US-03 | Home | Casual viewer | Watch recent highlights |
| US-04 | Home | New visitor | Empty state guidance |
| US-05 | Rikishi archive | Regular fan | Browse full banzuke |
| US-06 | Rikishi archive | Casual viewer | Visual wrestler recognition |
| US-07 | Rikishi archive | Regular fan | Quick record scan |
| US-08 | Rikishi profile | Enthusiast | Career stats overview |
| US-09 | Rikishi profile | Regular fan | Tournament history |
| US-10 | Rikishi profile | New fan | Personal profile |
| US-11 | Basho archive | Enthusiast | Find any past tournament |
| US-12 | Basho archive | Casual viewer | Champion at a glance |
| US-13 | Basho detail | Regular fan | Live standings |
| US-14 | Basho detail | Enthusiast | Day-by-day bouts + kimarite |
| US-15 | Basho detail | Casual viewer | Inline highlight viewing |
| US-16 | Kimarite encyclopedia | New fan | Discover techniques |
| US-17 | Kimarite encyclopedia | Casual viewer | Filter by category |
| US-18 | Kimarite detail | New fan | Animated technique explanation |
| US-19 | Kimarite detail | Enthusiast | Technique usage in real bouts |
| US-20 | LeaderBoard | Regular fan | Fast standings scan |
| US-21 | MatchRow | Casual viewer | Clear bout result reading |
| US-22 | MatchRow | Regular fan | Inline highlight without context loss |
| US-23 | RikishiCard | Any | Instant wrestler identification |
| US-24 | KimariteCard | New fan | Technique evaluation from card |
| US-25 | RankBadge | New fan | Colour-coded rank recognition |
| US-26 | RecordPill | Any | Colour-coded record reading |
| US-27 | YoutubeEmbed | Any | Fast page load with lazy video |
| US-28 | KimariteAnimation | New fan | Visual technique understanding |
| US-29 | Navbar | Any | Always-accessible navigation |
| US-30 | Footer | Curious user | Source transparency |
