import Link from "next/link";
import { prisma } from "@/lib/db";

function formatCount(value: number) {
    return new Intl.NumberFormat("en-US").format(value);
}

export default async function HomePage() {
    const recentStudySets = await prisma.studySet.findMany({
        include: { document: true, flashcards: true, mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
        orderBy: { createdAt: "desc" },
        take: 6,
    });

    return (
        <main className="min-h-screen px-4 py-4 sm:px-6 md:py-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <header className="flex items-center justify-between border-b border-rule pb-4">
                    <Link href="/" className="font-display text-2xl text-ink md:text-3xl">
                        StudyForge
                    </Link>
                    <nav className="hidden items-center gap-3 text-sm text-ink-muted md:flex">
                        <Link href="/study-sets" className="transition hover:text-focus">
                            Study sets
                        </Link>
                        <Link href="/upload" className="transition hover:text-focus">
                            Upload
                        </Link>
                    </nav>
                </header>

                <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-lg border border-rule bg-card p-6 md:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">Upload</p>
                        <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight text-ink md:text-5xl">
                            Turn one file into flashcards, quizzes, and graded theory practice.
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
                            Start with a slide deck, document, or PDF. StudyForge extracts the text, generates practice, and keeps the review surfaces calm and focused.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3 text-sm">
                            <Link href="/upload" className="rounded-md bg-focus px-4 py-2.5 font-semibold text-white transition hover:bg-focus-hover">
                                Upload a file
                            </Link>
                            <Link href="/study-sets" className="rounded-md border border-rule bg-white px-4 py-2.5 font-semibold text-ink transition hover:border-focus hover:text-focus">
                                Browse study sets
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-lg border border-rule bg-card p-6 md:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">What’s inside</p>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-ink-muted">
                            <p>Flashcards for recall speed.</p>
                            <p>MCQ, fill-in-the-blank, and theory review from the same source document.</p>
                            <p>Results that show matched and missed key points instead of just a raw score.</p>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-md border border-rule bg-paper p-4">
                                <div className="text-ink-muted">Recent sets</div>
                                <div className="mt-2 font-data text-2xl text-ink">{formatCount(recentStudySets.length)}</div>
                            </div>
                            <div className="rounded-md border border-rule bg-paper p-4">
                                <div className="text-ink-muted">Practice items</div>
                                <div className="mt-2 font-data text-2xl text-ink">
                                    {formatCount(recentStudySets.reduce((total, set) => total + set.flashcards.length + set.mcqQuestions.length + set.fillInBlanks.length + set.theoryQuestions.length, 0))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h2 className="font-sans text-xl font-semibold text-ink md:text-2xl">Recent study sets</h2>
                            <p className="mt-1 text-sm text-ink-muted">Newest first, pulled from the database.</p>
                        </div>
                        <Link href="/study-sets" className="text-sm font-semibold text-focus hover:text-focus-hover">
                            View all
                        </Link>
                    </div>

                    {recentStudySets.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-rule bg-card p-6 text-sm text-ink-muted">
                            Nothing here yet. Upload a slide deck, document, or PDF to turn it into flashcards and quizzes.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {recentStudySets.map((set) => (
                                <Link key={set.id} href={`/study-sets/${set.id}`} className="rounded-lg border border-rule bg-card p-5 transition hover:bg-paper-hover">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-focus">Study set</p>
                                    <h3 className="mt-3 font-sans text-base font-semibold text-ink">{set.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-ink-muted">
                                        {set.document.filename} · {set.flashcards.length} flashcards · {set.mcqQuestions.length} MCQ · {set.fillInBlanks.length} fill-in · {set.theoryQuestions.length} theory
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
