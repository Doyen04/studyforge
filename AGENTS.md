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
| `src/app/page.tsx` | Dashboard (home) |
| `src/app/dashboard/study-sets/[id]/page.tsx` | Study set viewer |
| `src/app/dashboard/quizzes/[id]/page.tsx` | Quiz runner |
| `src/app/dashboard/quizzes/[id]/results/[attemptId]/page.tsx` | Quiz results |
| `src/app/api/documents/route.ts` | File upload + parsing |
| `src/app/api/study-sets/route.ts` | Generate study set (POST), list (GET) |
| `src/app/api/quizzes/[id]/attempts/route.ts` | Submit + grade quiz answers |
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

Tailwind v4 theme in `src/app/globals.css`. Accent is plum (`#5b3a5c`), not blue. Score colors: green (`mastered`) ≥ 70%, amber (`review`) < 70%. Custom font stacks: `--font-display` (Fraunces), `--font-sans` (Inter), `--font-data` (IBM Plex Mono) — loaded via `next/font/google` in layout.tsx.

### Aliases

`@/*` maps to `src/*` (tsconfig paths).

### JSON fields in Prisma

Several models store JSON-serialized arrays as `String` (options, acceptableAnswers, keyPoints, questionRefs, answers). Always deserialize with `parseJsonArray()` from `src/lib/deserialize.ts`.

### Env vars

`.env` is gitignored. Required: `DATABASE_URL` (PostgreSQL), `GEMINI_API_KEY`. The `prisma.config.ts` also reads `DATABASE_URL` via dotenv.
