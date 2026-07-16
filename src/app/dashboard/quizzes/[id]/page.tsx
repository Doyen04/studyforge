"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { IconArrowLeft, IconPlayerPlay, IconHistory, IconTrophy } from "@tabler/icons-react";
import type { QuizPageData } from "@/types/page";

export default function QuizHistoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [quiz, setQuiz] = useState<QuizPageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/quizzes/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.quizId) throw new Error("Not found");
                setQuiz(data);
            })
            .catch(() => toast.error("Failed to load quiz."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-paper py-8">
                <div className="mx-auto max-w-2xl px-6 animate-pulse space-y-6">
                    <div className="h-8 w-64 rounded bg-rule" />
                    <div className="h-32 rounded-lg bg-rule" />
                </div>
            </main>
        );
    }

    if (!quiz) return <main className="py-10 text-center">Quiz not found.</main>;

    return (
        <main className="min-h-screen bg-paper py-8">
            <div className="mx-auto max-w-2xl px-6 space-y-8">
                <Link
                    href="/dashboard/quizzes"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition"
                >
                    <IconArrowLeft size={14} />
                    Back to quizzes
                </Link>

                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-ink">{quiz.title}</h1>
                        <p className="text-sm text-ink-muted mt-1">{quiz.questions.length} questions</p>
                    </div>
                    <Link
                        href={`/dashboard/quizzes/${id}/take`}
                        className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
                    >
                        <IconPlayerPlay size={16} />
                        Take Quiz
                    </Link>
                </div>

                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-ink">
                        <IconHistory size={18} />
                        <h2 className="font-semibold">Attempt History</h2>
                    </div>

                    {quiz.attempts.length === 0 ? (
                        <div className="rounded-lg border border-rule bg-card p-8 text-center text-sm text-ink-muted">
                            No attempts yet. Start the quiz to see your scores here!
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {quiz.attempts.map((attempt, i) => (
                                <div key={attempt.id} className="flex items-center justify-between rounded-lg border border-rule bg-card p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-paper font-data font-bold text-ink-muted">
                                            #{quiz.attempts.length - i}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-ink">Attempt #{quiz.attempts.length - i}</p>
                                            <p className="text-xs text-ink-muted">
                                                {attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : "In progress"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-mastered font-bold">
                                            <IconTrophy size={16} />
                                            {attempt.score}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
