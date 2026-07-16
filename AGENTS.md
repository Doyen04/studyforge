## Preferences

- **No shadows**: Do not add `shadow-*` classes to components unless explicitly asked.
- **Ask before CLI**: Do not run any CLI commands (`npx`, `npm`, `git`, etc.) without asking for permission first.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint (next core-web-vitals + typescript configs)
- `npx prisma migrate dev --name <name>` — create migration
- `npx prisma generate` — regenerate client (runs automatically via `postinstall`)
- `npx tsx prisma/seed.ts` — seed database

No test script exists. No CI workflows are configured.

## Stack

Next.js 16.2.10 (App Router), React 19, Tailwind CSS v4, Prisma 7.8 (PostgreSQL on Neon), Google Gemini AI (`@google/genai`, model `gemini-3.1-flash-lite`).

## Architecture

**StudyForge** turns uploaded documents (PDF/DOCX/PPTX) into active-study materials via AI.

Core flow: Upload document → AI generates 4 question types → browse study sets → create quizzes → take quizzes → AI grades theory answers.

### Key paths

| Path | Role |
|---|---|
| `src/app/page.tsx` | Landing page (home) |
| `src/app/dashboard/page.tsx` | Dashboard (stats, continue studying, recent sets, recent quizzes) |
| `src/app/dashboard/study-sets/page.tsx` | Study sets index (search, card-wrap with catalog tags, delete) |
| `src/app/dashboard/study-sets/[id]/page.tsx` | Study set detail (questions w/ selection checkboxes, quizzes tab, create quiz from selection) |
| `src/app/dashboard/quizzes/page.tsx` | Quizzes index (search, card-wrap, delete) |
| `src/app/dashboard/quizzes/[id]/page.tsx` | Quiz runner (single-question flow, progress bar, Previous/Next/Submit) |
| `src/app/dashboard/quizzes/[id]/results/[attemptId]/page.tsx` | Quiz results (score hero, per-question graded review) |
| `src/app/dashboard/documents/page.tsx` | Documents index (upload, search, card-wrap, click-to-generate, delete) |
| `src/app/dashboard/settings/page.tsx` | Settings (BYO Gemini key, test, remove) |
| `src/app/api/dashboard/route.ts` | GET: stats, continueStudying, recentStudySets (4), documentsWithoutStudySet count, recentAttempts (5) |
| `src/app/api/documents/route.ts` | POST: upload+parse (via officeparser), GET: list with search |
| `src/app/api/study-sets/route.ts` | POST: generate study set (AI → DB), GET: list w/ search, itemCounts, bestScore, order by lastAccessedAt |
| `src/app/api/study-sets/[id]/route.ts` | GET: full detail (fields + quizzes w/ attempt scores), DELETE |
| `src/app/api/quizzes/route.ts` | POST: create (supports explicit questionRefs or random pick), GET: list w/ search |
| `src/app/api/quizzes/[id]/route.ts` | GET: quiz questions, DELETE |
| `src/app/api/quizzes/[id]/attempts/route.ts` | POST: submit+grade all answer types (MCQ eq, FIB string match, theory AI-grade via Gemini) |
| `src/app/api/quizzes/[id]/results/[attemptId]/route.ts` | GET: attempt details + graded answers |
| `src/lib/db.ts` | Prisma singleton (reads `DATABASE_URL` or `POSTGRES_URL`) |
| `src/lib/anthropic.ts` | Gemini wrapper (named `anthropic.ts` but uses Google Gemini) |
| `src/lib/chunk.ts` | Text chunking (~3000 words/chunk) + count distribution |
| `src/lib/parseDocument.ts` | officeparser: .docx/.pptx/.pdf → text (rejects <30 words) |
| `src/lib/deserialize.ts` | `parseJsonArray<T>()` for Prisma JSON-as-text fields |
| `src/lib/types.ts` | Shared interfaces (`QuestionType`, `GradedAnswer`, etc.) |
| `src/lib/prompts/` | One file per question type + theory grading |
| `prisma/schema.prisma` | 7 models: Document, StudySet, Flashcard, McqQuestion, FillInBlank, TheoryQuestion, Quiz, QuizAttempt |
| `src/generated/prisma/` | Auto-generated Prisma client (do not edit) |

### Design tokens

Tailwind v4 theme in `src/app/globals.css`. Accent is wine (`#6e2140`), not blue. Score colors: `mastered` (`#2c7a4d`) ≥ 70%, `review` (`#9c7009`) < 70%. Tint colors: wine-tint, blue-tint, green-tint, amber-tint, red-tint. Paper: `#f0f0ec`. Surface-2: `#e6e4de`. Custom font stacks: `--font-display` (Fraunces), `--font-sans` (Inter), `--font-data` (IBM Plex Mono) — loaded via `next/font/google` in layout.tsx. Dark mode via `.dark` class on `<html>`.

### Component class style

All components use inline Tailwind utilities (no `@apply`, no named spec CSS classes). Skeleton loading uses `animate-pulse` with `bg-rule`.

### Cards

Card-wrap offset effect: `absolute top-2 left-2 right-0 bottom-0` for shadow layer, `relative z-10` content layer with `group-hover:-translate-x-0.5 group-hover:-translate-y-0.5`. Standard shadow: `shadow-[0_1px_2px_rgba(32,28,26,.05),0_8px_20px_-10px_rgba(32,28,26,.14)]` (dark variant: `shadow-[0_1px_2px_rgba(0,0,0,.3),0_8px_20px_-10px_rgba(0,0,0,.5)]`).

### Aliases

`@/*` maps to `src/*` (tsconfig paths).

### JSON fields in Prisma

Several models store JSON-serialized arrays as `String` (options, acceptableAnswers, keyPoints, questionRefs, answers). Always deserialize with `parseJsonArray()` from `src/lib/deserialize.ts`.

### Env vars

`.env` is gitignored. Required: `DATABASE_URL` (PostgreSQL), `GEMINI_API_KEY`. The `prisma.config.ts` also reads `DATABASE_URL` via dotenv.

## Implementation status

All 8 spec phases complete:
- **Phase 0** — globals.css tokens (spec hex values, .dark variant, custom fonts kept)
- **Phase 1** — SiteHeader (padding), ConfirmModal (type-to-confirm variant), UploadZone (4-state: idle/uploading/processing/error)
- **Phase 2** — Dashboard API (extended shape), Dashboard page (empty-state when studySetCount===0), StatsRow (4 metric cards w/ tint icons + captions), ContinueStudyingCard (hero card w/ composition bar + legend), StudySetCard (card-wrap + catalog tag + overflow delete)
- **Phase 3** — Study sets index (card-wrap, catalog tags, overflow delete, search, empty state)
- **Phase 4** — Study set detail (pagehead, Questions|Quizzes tabs, question cards w/ checkboxes, sticky selection bar, create quiz from selection, quizzes tab w/ scores)
- **Phase 5** — Quiz runner (spec re-theme, Previous/Next/Submit, progress bar), Quiz results (score hero, per-question graded review, retake)
- **Phase 6** — Quizzes index (card-wrap, search, delete, empty state)
- **Phase 7** — Documents index (card-wrap, overflow delete, upload, click-to-generate modal, search)
- **Phase 8** — Settings (BYO key, test, remove, preferences static sections)
