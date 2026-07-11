import Link from "next/link";
import { getQuizzesIndex } from "@/lib/actions";

export default async function QuizzesIndex() {
    const quizzes = await getQuizzesIndex();

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
                <section>
                    <h1 className="font-sans text-2xl font-semibold text-ink md:text-3xl">Quizzes</h1>
                    <p className="mt-2 text-sm text-ink-muted">Your generated quizzes and past results.</p>

                    {quizzes.length === 0 ? (
                        <div className="mt-6 rounded-lg border border-dashed border-rule bg-card p-6 text-sm text-ink-muted">
                            No quizzes yet. Create one from a study set to test your knowledge.
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map((q) => {
                                const lastAttempt = q.attempts[0] ?? null;
                                const scoreColor = lastAttempt === null ? "" : lastAttempt.score >= 70 ? "text-mastered" : "text-review";
                                return (
                                    <Link
                                        key={q.id}
                                        href={`/dashboard/quizzes/${q.id}`}
                                        className="rounded-lg border border-rule bg-card p-5 transition hover:bg-paper-hover"
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Quiz</p>
                                        <h2 className="mt-3 font-sans text-base font-semibold text-ink">{q.title}</h2>
                                        <p className="mt-2 text-sm leading-6 text-ink-muted">
                                            {q.studySet.title}
                                        </p>
                                        {lastAttempt && (
                                            <p className={`mt-3 text-xs font-semibold ${scoreColor}`}>
                                                Last score: {lastAttempt.score}%
                                            </p>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
