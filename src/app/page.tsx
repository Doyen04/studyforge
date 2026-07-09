import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <section className="overflow-hidden rounded-4xl border border-rule bg-card shadow-[0_20px_60px_rgba(27,31,29,0.08)]">
                    <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-focus">
                                StudyForge
                            </div>
                            <div className="space-y-4">
                                <h1 className="max-w-2xl font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
                                    Turn slides, docs, and PDFs into flashcards, quizzes, and graded theory practice.
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-ink/75 sm:text-lg">
                                    Upload course material, generate active-recall practice, and review theory answers with an LLM-backed rubric.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/upload"
                                    className="rounded-full bg-focus px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                                >
                                    Start with a file
                                </Link>
                                <Link
                                    href="/study-sets"
                                    className="rounded-full border border-rule bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-focus hover:text-focus"
                                >
                                    Study sets
                                </Link>
                                <Link
                                    href="/quizzes"
                                    className="rounded-full border border-rule bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-focus hover:text-focus"
                                >
                                    Quizzes
                                </Link>
                                <Link
                                    href="/study-sets/demo"
                                    className="rounded-full border border-rule bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-focus hover:text-focus"
                                >
                                    Demo set
                                </Link>
                            </div>
                        </div>
                        <div className="grid gap-3 rounded-3xl border border-rule bg-paper p-4 text-sm text-ink/75">
                            <div className="rounded-2xl bg-white p-4">
                                <div className="font-semibold text-ink">What it does</div>
                                <p className="mt-2 leading-6">Extracts text, chunks it, generates questions, then grades quiz answers with deterministic scoring plus theory grading.</p>
                            </div>
                            <div className="rounded-2xl bg-white p-4">
                                <div className="font-semibold text-ink">Study flow</div>
                                <p className="mt-2 leading-6">Upload, generate, review, quiz, and inspect results with a graded margin for theory answers.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="upload" className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="rounded-[1.75rem] border border-rule bg-card p-6 shadow-[0_16px_40px_rgba(27,31,29,0.06)] sm:p-8">
                        <h2 className="font-display text-3xl text-ink">Upload and generate</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
                            The implementation now includes the app shell and core routing surfaces. Add your Anthropic and Prisma environment values, then hook these screens to the API routes.
                        </p>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-rule bg-paper p-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">Default counts</div>
                                <div className="mt-3 grid grid-cols-2 gap-3 font-data text-sm">
                                    <span>Flashcards</span><span className="text-right">15</span>
                                    <span>MCQ</span><span className="text-right">10</span>
                                    <span>Fill blank</span><span className="text-right">8</span>
                                    <span>Theory</span><span className="text-right">5</span>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-rule bg-paper p-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">Routes</div>
                                <div className="mt-3 space-y-2 text-sm">
                                    <div>/api/documents</div>
                                    <div>/api/study-sets</div>
                                    <div>/api/quizzes</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="rounded-[1.75rem] border border-rule bg-card p-6 shadow-[0_16px_40px_rgba(27,31,29,0.06)] sm:p-8">
                        <h2 className="font-display text-2xl text-ink">Core stack</h2>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/75">
                            <li>Next.js App Router</li>
                            <li>Prisma 7 with SQLite</li>
                            <li>Anthropic structured outputs</li>
                            <li>Tailwind CSS v4 tokens</li>
                        </ul>
                    </aside>
                </section>
            </div>
        </main>
    );
}
