# StudyForge — Dashboard Redesign

> Third file in the set, alongside `README.md` (data/API/prompts) and `UI_DESIGN.md` (the base design system and all four pages). This one replaces the accent palette app-wide and redesigns `/` — the current build is upload-zone-plus-a-list every time you visit, even once you have real history; this makes it an actual dashboard.

---

## Table of Contents

1. [What's Changing](#1-whats-changing)
2. [New Color System](#2-new-color-system)
3. [Why This Palette](#3-why-this-palette)
4. [Dashboard Information Architecture](#4-dashboard-information-architecture)
5. [New Data Requirements](#5-new-data-requirements)
6. [Wireframes](#6-wireframes)
7. [Component Specs](#7-component-specs)
8. [States](#8-states)
9. [Full Code](#9-full-code)
10. [Migration Notes](#10-migration-notes)
11. [What This Avoids](#11-what-this-avoids)

---

## 1. What's Changing

Two changes, bundled because the second doesn't look right without the first:

1. **The accent color changes app-wide** — `--color-focus` (blue, `#3B5BA9`) is retired. §2 is a full replacement palette: plum accent, no blue, no terracotta anywhere, including the error/danger role (a lot of "not blue" defaults land on orange-red by reflex, which drifts straight back toward terracotta — §2 avoids that too).
2. **`/` becomes a real dashboard** — stats, a "continue studying" card that actually reflects your last quiz score, and study-set cards that carry more than a filename. Upload stops being a giant always-there dropzone once there's something to show — it becomes one tile in the same grid as everything else.

`/study-sets/[id]`, `/quizzes/[id]`, and the results page keep the layouts from `UI_DESIGN.md` §6.2–6.4 unchanged — only their colors update to match §2. This file's structural redesign is scoped to `/`.

---

## 2. New Color System

| Token | Old value | New value | Role |
|---|---|---|---|
| `--color-ink` | `#1B1F1D` | `#211C1F` | Primary text |
| `--color-ink-muted` | `#5B615E` | `#6B6266` | Secondary text, captions |
| `--color-paper` | `#F5F6F3` | `#F7F5F5` | App background |
| `--color-paper-hover` | `#ECEDE9` | `#EFEBEC` | Hover background, list rows |
| `--color-card` | `#FFFFFF` | `#FFFFFF` | Unchanged |
| `--color-rule` | `#D8DAD3` | `#DEDADC` | Hairline borders |
| `--color-accent` *(was `--color-focus`)* | `#3B5BA9` | `#5B3A5C` | Primary accent — buttons, links, active states |
| `--color-accent-hover` *(was `--color-focus-hover`)* | `#2E4A87` | `#452D46` | Hover/active shade of accent |
| `--color-mastered` | `#2F8F6E` | `#3A6B4D` | Correct / matched key point |
| `--color-review` | `#B8862E` | `#A67C2E` | Needs review / missed key point |
| `--color-error` *(was closer to a clay-red)* | `#B23A3A` | `#8C3A3A` | Genuine system errors |

Contrast, rechecked against the new `--color-paper` (not assumed carried over — the base color moved too, so every pairing was re-verified, not just the accent):

| Token as text on `paper` | Ratio | Verdict |
|---|---|---|
| `--color-ink` | ~14.7:1 | ✅ |
| `--color-ink-muted` | ~5.5:1 | ✅ normal text |
| `--color-accent` | ~9.3:1 | ✅ normal text, comfortably |
| `--color-mastered` | ~5.8:1 | ✅ normal text — this is actually an *improvement* over the old value, which only cleared large-text contrast. The new forest tone is dark enough to use as small body text, not just fills/icons/badges. |
| `--color-review` | ~3.6:1 | ⚠️ large/bold text only, or fills/icons — same restriction as before, unchanged reasoning |
| `--color-error` | ~7.2:1 | ✅ normal text |

Rename note: every `focus`/`focus-hover` reference across `README.md` and `UI_DESIGN.md` becomes `accent`/`accent-hover`. "Focus" as a name was fine when the color was a literal focus-ring blue; it reads oddly for a plum, so the token name changes along with the value.

```css
/* src/app/globals.css — replaces the @theme block in UI_DESIGN.md §2.1 */
@import "tailwindcss";

@theme {
  --color-ink: #211c1f;
  --color-ink-muted: #6b6266;
  --color-paper: #f7f5f5;
  --color-paper-hover: #efebec;
  --color-card: #ffffff;
  --color-rule: #dedadc;
  --color-accent: #5b3a5c;
  --color-accent-hover: #452d46;
  --color-mastered: #3a6b4d;
  --color-review: #a67c2e;
  --color-error: #8c3a3a;

  --font-display: var(--font-fraunces), ui-serif, Georgia, serif;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-data: var(--font-plex-mono), ui-monospace, monospace;
}
```

---

## 3. Why This Palette

Blue and terracotta are excluded for the same underlying reason, not two separate ones: they're the two most reflexive choices available right now — terracotta because it reads as this exact assistant's own accent color, blue because it's the default accent of nearly every SaaS product built in the last decade. Neither is *wrong*, both are *predictable*, and predictable is the thing being designed away from here.

The replacement stays inside the vernacular `UI_DESIGN.md` §1 already established — studying as marking things up — rather than reaching for a third arbitrary hue:

- **Plum** reads as fountain-pen ink. Violet-black and blue-black were genuinely common historical ink colors, so this isn't a decorative purple, it's "the color of the pen in your hand" — a better fit for a studying app than blue ever was, independent of the exclusion rule.
- **Forest green** stays in the same family as before (it was already the "mastered" color) — the classic alternate to red-pen grading, which a studying app has every reason to lean into.
- **Ochre** is unchanged reasoning from before: highlighter-gold, "revisit this" rather than "you failed."
- **Oxblood** (the new error color) is deliberately kept further from orange than the old error red was — closer to a ledger-book binding than a warning light, and far enough from terracotta's salmon-orange that the two don't read as cousins.

---

## 4. Dashboard Information Architecture

Top to bottom, only shown once there's at least one study set (§8 covers the empty state separately):

1. **Header** — unchanged from `UI_DESIGN.md` §3, plus the "All study sets" link already in the current build (§10 folds this into the spec rather than removing it).
2. **Stats row** — study sets, questions generated, quizzes taken, average score. Quiet, four blocks, `--font-data` numerals — this is a status strip, not the page's subject, so it doesn't out-compete anything below it.
3. **Continue studying** — the study set with the most recent activity, featured: title, item counts, last quiz score (or "not quizzed yet"), one CTA.
4. **Your study sets** — a grid of every study set, upload folded in as the grid's first tile rather than a separate section.
5. **Recent quiz results** *(new, optional — include if you want the extra section; the mockup in this conversation didn't render it, to keep that preview compact, but it's a real part of this spec)* — last 5 completed attempts across every study set, each showing the quiz's study set, score, and date. This is the one place the dashboard shows change over time rather than a current snapshot.

---

## 5. New Data Requirements

Two additions to `README.md` §4 — neither changes anything already built, both are pure additions.

### 5.1 Schema

```prisma
model StudySet {
  id              String           @id @default(cuid())
  documentId      String
  document        Document         @relation(fields: [documentId], references: [id], onDelete: Cascade)
  title           String
  createdAt       DateTime         @default(now())
  lastAccessedAt  DateTime         @default(now())   // new
  flashcards      Flashcard[]
  mcqQuestions    McqQuestion[]
  fillInBlanks    FillInBlank[]
  theoryQuestions TheoryQuestion[]
  quizzes         Quiz[]
}
```

Run `npx prisma migrate dev --name add_last_accessed_at` after adding the field. Touch it in two places:
- Whenever a study set is opened (`/study-sets/[id]`'s Server Component, or that route if you kept it — either way, one `prisma.studySet.update({ where: { id }, data: { lastAccessedAt: new Date() } })` call).
- Whenever a quiz attempt against it completes (add the same update inside `POST /api/quizzes/[id]/attempts`, keyed off `quiz.studySetId`).

### 5.2 Dashboard queries

Six parallel queries in the `/` Server Component — no new API route needed, this is exactly the "Server Components can query Prisma directly" pattern from `UI_DESIGN.md` §5:

```ts
// src/app/page.tsx (excerpt — the data-fetching half)
const [studySetCount, flashcardCount, mcqCount, fillInBlankCount, theoryCount, attemptAgg] =
  await Promise.all([
    prisma.studySet.count(),
    prisma.flashcard.count(),
    prisma.mcqQuestion.count(),
    prisma.fillInBlank.count(),
    prisma.theoryQuestion.count(),
    prisma.quizAttempt.aggregate({
      where: { completedAt: { not: null } },
      _count: { _all: true },
      _avg: { score: true },
    }),
  ]);

const stats = {
  studySets: studySetCount,
  questionsGenerated: flashcardCount + mcqCount + fillInBlankCount + theoryCount,
  quizzesTaken: attemptAgg._count._all,
  averageScore: attemptAgg._avg.score !== null ? Math.round(attemptAgg._avg.score) : null,
};
```

One query serves both "Your study sets" (§9.5's grid) and "Continue studying" — they need overlapping data (every study set, ordered by recency, each with its own item counts and its own last quiz score), so this runs once rather than fetching the same rows twice under two different queries:

```ts
const studySetRows = await prisma.studySet.findMany({
  orderBy: { lastAccessedAt: "desc" },
  include: {
    document: true,
    _count: {
      select: { flashcards: true, mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
    },
    quizzes: {
      include: {
        attempts: {
          where: { completedAt: { not: null } },
          orderBy: { completedAt: "desc" },
          take: 1,
        },
      },
    },
  },
});

const studySets = studySetRows.map((set) => ({
  id: set.id,
  title: set.title,
  filename: set.document.filename,
  itemCounts: {
    flashcards: set._count.flashcards,
    mcq: set._count.mcqQuestions,
    fillInBlank: set._count.fillInBlanks,
    theory: set._count.theoryQuestions,
  },
  lastScore:
    set.quizzes
      .flatMap((q) => q.attempts)
      .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0))[0]?.score ?? null,
}));

// studySets is already sorted by lastAccessedAt desc, so the first entry
// (if any) is exactly the "continue studying" candidate — no second query.
const mostRecent = studySets[0] ?? null;
```

`mostRecent?.lastScore === null` with `mostRecent` non-null means "has a study set, never quizzed it" — §8 covers both states for the card. `studySets` (the full array, in the same recency order) is what `§9.5`'s grid maps over — every card gets its own `itemCounts` and `lastScore` from this single query, including the `StudySetCard` badge in §9.4.

"Recent quiz results" (only if you're including §4's item 5) — this one is genuinely separate, since it's about individual attempts across sets, not per-set summaries:

```ts
const recentAttempts = await prisma.quizAttempt.findMany({
  where: { completedAt: { not: null } },
  orderBy: { completedAt: "desc" },
  take: 5,
  include: { quiz: { include: { studySet: true } } },
});
```

---

## 6. Wireframes

Populated state, mobile (the primary target, same reasoning as `UI_DESIGN.md` §2.4):

```
┌─────────────────────────────┐
│  StudyForge     All sets →  │
├─────────────────────────────┤
│ ┌────────┐┌────────┐        │
│ │ 7 sets ││246 made│        │  stats row — 2 cols on
│ └────────┘└────────┘        │  mobile, wraps to fit
│ ┌────────┐┌────────┐        │
│ │11 quiz ││ 78% avg│        │
│ └────────┘└────────┘        │
├─────────────────────────────┤
│  Continue studying          │
│ ┌─────────────────────────┐ │
│ │ cse 402                 │ │
│ │ Last score 78% · 15c... │ │
│ │            [Quiz again] │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│  Your study sets            │
│ ┌─────────┐  ┌─────────┐    │
│ │+ Upload │  │ cse 402 │    │  upload is a grid tile,
│ │material │  │ 15c·10m…│    │  not a separate section
│ └─────────┘  └─────────┘    │
│ ┌─────────┐                 │
│ │ Econ 201│                 │
│ │ 20c·12m…│                 │
│ └─────────┘                 │
├─────────────────────────────┤
│  Recent quiz results        │
│  cse 402 · 78% · Jul 8      │
│  Econ 201 · 65% · Jul 6     │
└─────────────────────────────┘
```

At `md:` and up: stats become a single 4-column row, the study-set grid goes to 3 columns, "Continue studying" and "Recent quiz results" can sit side by side in a `lg:grid-cols-[2fr_1fr]` split if you want the wider viewport to do more than stretch margins — reasonable either way; stacked is simpler to implement and loses nothing.

---

## 7. Component Specs

New or changed since `UI_DESIGN.md` §5 — same table format, same convention (default Server Component, opt into client only for real interactivity):

| Component | Purpose | Variants / states | Layer |
|---|---|---|---|
| `StatsRow` | The four-block stats strip | hidden entirely in the empty state (§8) | Server |
| `ContinueStudyingCard` | Featured most-recent study set | has-score / never-quizzed | Server |
| `StudySetCard` *(updated)* | One tile in the grid | now optionally shows a last-score badge (`mastered`/`review` colored, same threshold logic as elsewhere: ≥70 → mastered tint, <70 → review tint) | Server |
| `UploadTile` *(new)* | The "+ Upload material" grid tile | idle / opens the upload modal on click | Client — only because it opens the modal; the tile itself has no other state |
| `UploadModal` | Wraps the existing `UploadZone` + `GenerateOptionsPanel` in an overlay | open / closed | Client — holds open/closed state |
| `RecentQuizList` | The last-5-attempts list | empty (omit the section, don't show "no results") | Server |

`UploadModal` is the one genuinely new interaction pattern here — everything else in the dashboard is either static display or a single click that navigates or opens the modal. Build the modal as a plain centered overlay (`fixed inset-0` is fine in the real app — the "no `position: fixed`" rule earlier in this conversation was a Visualizer sandbox constraint, not a rule for your actual Next.js build).

---

## 8. States

| State | What shows |
|---|---|
| Zero study sets (true first visit) | Header + full-size `UploadZone` (as originally specced) + a one-line note beneath it. No stats row, no "Continue studying," no grid — showing four stat cards reading "0" is a worse first impression than not showing them at all. |
| ≥1 study set, none ever quizzed | Stats row (quizzes taken = 0, average score shows "—" not "0%" — a real distinction, since 0% implies attempts happened and went badly, "—" means none happened yet). "Continue studying" shows "Not quizzed yet" with a "Take a quiz" CTA instead of "Quiz again." No "Recent quiz results" section. |
| ≥1 study set, ≥1 completed quiz | The full layout in §6. |
| Dashboard data loading | Stats row and grid render as skeleton blocks (plain `--color-rule`-tinted rectangles, no shimmer animation needed — a static skeleton is enough for a Server-Component page that resolves in one round trip, not a long-polling client state). |
| A stat query fails | Degrade per-section, not page-wide — if the aggregate query throws, show the study-set grid (which has its own simpler query) without the stats row, plus a small `ErrorBanner` ("Couldn't load your stats right now.") rather than blanking the whole page for one failed query. |

---

## 9. Full Code

### 9.1 `StatsRow`

```tsx
// src/components/StatsRow.tsx
export function StatsRow({
  stats,
}: {
  stats: { studySets: number; questionsGenerated: number; quizzesTaken: number; averageScore: number | null };
}) {
  const items = [
    { label: "Study sets", value: stats.studySets },
    { label: "Questions made", value: stats.questionsGenerated },
    { label: "Quizzes taken", value: stats.quizzesTaken },
    { label: "Avg. score", value: stats.averageScore !== null ? `${stats.averageScore}%` : "—" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-rule bg-card p-3">
          <p className="text-xs text-ink-muted">{item.label}</p>
          <p className="font-data text-xl font-medium text-ink">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
```

### 9.2 `ContinueStudyingCard`

```tsx
// src/components/ContinueStudyingCard.tsx
export function ContinueStudyingCard({
  studySet,
  itemCounts,
  lastScore,
}: {
  studySet: { id: string; title: string };
  itemCounts: { flashcards: number; mcq: number; fillInBlank: number; theory: number };
  lastScore: number | null;
}) {
  const scoreColor = lastScore === null ? "text-ink-muted" : lastScore >= 70 ? "text-mastered" : "text-review";
  const scoreLabel = lastScore === null ? "Not quizzed yet" : `Last score ${lastScore}%`;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-rule bg-card p-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-muted">Continue studying</p>
        <p className="font-sans text-base font-semibold text-ink">{studySet.title}</p>
        <p className="text-sm">
          <span className={`font-medium ${scoreColor}`}>{scoreLabel}</span>
          <span className="text-ink-muted">
            {" "}
            · {itemCounts.flashcards} cards · {itemCounts.mcq} MCQ · {itemCounts.fillInBlank} fill ·{" "}
            {itemCounts.theory} theory
          </span>
        </p>
      </div>
      <a
        href={`/study-sets/${studySet.id}`}
        className="whitespace-nowrap rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        {lastScore === null ? "Take a quiz" : "Quiz again"}
      </a>
    </div>
  );
}
```

### 9.3 `UploadTile` + `UploadModal`

```tsx
// src/components/UploadTile.tsx
"use client";

import { useState } from "react";
import { UploadModal } from "./UploadModal";

export function UploadTile() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-lg border border-dashed border-rule bg-card p-4 text-sm text-ink-muted hover:bg-paper-hover"
      >
        + Upload material
      </button>
      {open && <UploadModal onClose={() => setOpen(false)} />}
    </>
  );
}
```

```tsx
// src/components/UploadModal.tsx
"use client";

import { UploadZone } from "./UploadZone";

export function UploadModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-rule bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="font-sans text-base font-semibold text-ink">Upload material</p>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-muted">
            ✕
          </button>
        </div>
        <UploadZone />
      </div>
    </div>
  );
}
```

`bg-ink/40` uses Tailwind's opacity-modifier syntax against the `--color-ink` token — a 40%-opaque scrim in the same ink color as the rest of the design rather than a generic `black/40`, a small consistency detail that costs nothing extra to implement.

### 9.4 `StudySetCard` — the score badge addition

Only the new part — `lastScore` arrives as a prop (the composition in §9.5 passes `set.lastScore`); everything else matches the `StudySetCard` already implied by `UI_DESIGN.md` §6.2:

```tsx
{lastScore !== null && (
  <span
    className={`rounded-md px-2 py-0.5 text-xs font-medium ${
      lastScore >= 70 ? "bg-mastered/10 text-mastered" : "bg-review/10 text-review"
    }`}
  >
    {lastScore}%
  </span>
)}
```

### 9.5 Dashboard page composition

```tsx
// src/app/page.tsx (structure — data fetching per §5.2 goes above this)
export default async function DashboardPage() {
  // ...stats Promise.all, studySetRows query + studySets/mostRecent derivation,
  // recentAttempts query, all from §5.2, go here...

  if (stats.studySets === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <PageHeader />
        <UploadZone />
        <p className="mt-4 text-sm text-ink-muted">
          Nothing here yet. Upload a slide deck, document, or PDF to turn it into flashcards and quizzes.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <PageHeader />
      <StatsRow stats={stats} />
      {mostRecent && (
        <ContinueStudyingCard
          studySet={mostRecent}
          itemCounts={mostRecent.itemCounts}
          lastScore={mostRecent.lastScore}
        />
      )}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-ink">Your study sets</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <UploadTile />
          {studySets.map((set) => (
            <StudySetCard
              key={set.id}
              studySet={set}
              itemCounts={set.itemCounts}
              lastScore={set.lastScore}
            />
          ))}
        </div>
      </section>
      {recentAttempts.length > 0 && <RecentQuizList attempts={recentAttempts} />}
    </main>
  );
}
```

`mostRecent` already carries `itemCounts` and `lastScore` in exactly the shape both components expect — it's one entry from the same `studySets` array the grid maps over (§5.2), so there's no separate reshaping step here the way an earlier draft of this section needed.

### 9.6 `RecentQuizList`

```tsx
// src/components/RecentQuizList.tsx
export function RecentQuizList({
  attempts,
}: {
  attempts: {
    id: string;
    score: number;
    completedAt: Date | null;
    quiz: { studySet: { title: string } };
  }[];
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-ink">Recent quiz results</h2>
      <div className="divide-y divide-rule rounded-lg border border-rule bg-card">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span className="text-ink">{attempt.quiz.studySet.title}</span>
            <span className="flex items-center gap-3">
              <span className={attempt.score >= 70 ? "text-mastered" : "text-review"}>{attempt.score}%</span>
              <span className="font-data text-xs text-ink-muted">
                {attempt.completedAt?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

Same ≥70 threshold as the `StudySetCard` badge (§9.4) and the same color pairing — one rule, applied consistently everywhere a score gets colored, rather than each component inventing its own cutoff.

---

## 10. Migration Notes

Specific to the current build (the screenshot this conversation started from):

- The header already has "All study sets" — keep it exactly as built; §4's spec assumed it would need adding but it's already there.
- The upload dropzone currently renders full-size on every visit, including when study sets already exist — that's the main thing this file changes. Once `stats.studySets > 0`, it moves into the grid as `UploadTile` (§9.3); the full-size `UploadZone` only appears in the true-empty state (§8).
- Recolor pass: search the current codebase for the old hex values in §2's table (or the Tailwind classes `bg-focus`/`text-focus`/`border-focus` if they made it into the build under that name) and replace with `accent`. This is a find-and-replace, not a rebuild — nothing about component structure changes because of the color swap alone.
- "cse 402" in the current screenshot has no score/progress shown, which is correct for its actual state if it's never been quizzed — confirm that's the real state before assuming the "not quizzed yet" branch (§8) needs debugging.

---

## 11. What This Avoids

- **No blue, anywhere** — not the accent, not links, not a "primary" button color, not the error state either (a common miss: banning blue from the accent and then reaching for it in a secondary role instead).
- **No terracotta, or anything adjacent to it** — the error color was deliberately pulled toward brown (oxblood) rather than left as a bright orange-red, specifically because orange-red is one hue-shift away from terracotta.
- **No stat cards in the empty state.** Four boxes reading "0 / 0 / 0 / —" is a worse welcome than the plain upload prompt it would replace.
- **No shimmer/skeleton animation.** A static tinted rectangle is enough for a page that resolves in one server round trip — animated loading states are worth it for genuinely slow or streaming content, not a page that's fast by construction.
- **No separate "dashboard" and "home" routes.** `/` is both — a second route would just be the same six queries with a different URL.