import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function StudySetsIndex() {
    const sets = await prisma.studySet.findMany({ include: { document: true }, orderBy: { createdAt: "desc" } });

    return (
        <main className="min-h-screen px-4 py-4 sm:px-6 md:py-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <header className="flex items-center justify-between border-b border-rule pb-4">
                    <Link href="/" className="font-display text-2xl text-ink md:text-3xl">
                        StudyForge
                    </Link>
                    <Link href="/upload" className="text-sm font-semibold text-focus hover:text-focus-hover">
                        Upload
                    </Link>
                </header>

                <section>
                    <h1 className="font-sans text-2xl font-semibold text-ink md:text-3xl">Study sets</h1>
                    <p className="mt-2 text-sm text-ink-muted">Latest generated sets, pulled directly from the database.</p>

                    {sets.length === 0 ? (
                        <div className="mt-6 rounded-lg border border-dashed border-rule bg-card p-6 text-sm text-ink-muted">
                            Nothing here yet. Upload a slide deck, document, or PDF to turn it into flashcards and quizzes.
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {sets.map((set) => (
                                <Link key={set.id} href={`/study-sets/${set.id}`} className="rounded-lg border border-rule bg-card p-5 transition hover:bg-paper-hover">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-focus">Study set</p>
                                    <h2 className="mt-3 font-sans text-base font-semibold text-ink">{set.title}</h2>
                                    <p className="mt-2 text-sm leading-6 text-ink-muted">
                                        {set.document.filename} · {set.document.wordCount} words
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
