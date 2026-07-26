"use client";

import Link from "next/link";
import { IconChevronRight, IconAward, IconAlertCircle } from "@tabler/icons-react";

export function RecentQuizList({
    attempts,
}: {
    attempts: {
        id: string;
        score: number;
        completedAt: Date | null;
        quiz: { id?: string; studySet: { title: string } };
    }[];
}) {
    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-display text-lg font-semibold text-ink">Recent Evaluation Activity</h2>
                    <p className="text-xs text-ink-muted">Historical scores and mastery evaluations</p>
                </div>
                <Link
                    href="/dashboard/quizzes"
                    className="text-xs font-semibold text-accent hover:text-accent-hover transition font-data"
                >
                    View Quizzes →
                </Link>
            </div>

            <div className="divide-y divide-rule overflow-hidden rounded-xl border border-rule bg-card">
                {attempts.map((attempt) => {
                    const isMastered = attempt.score >= 70;
                    const href = attempt.quiz.id ? `/dashboard/quizzes/${attempt.quiz.id}` : "/dashboard/quizzes";
                    return (
                        <Link
                            key={attempt.id}
                            href={href}
                            className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition-colors hover:bg-paper-hover group"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                                    isMastered ? "bg-green-tint text-mastered" : "bg-amber-tint text-review"
                                }`}>
                                    {isMastered ? <IconAward size={16} /> : <IconAlertCircle size={16} />}
                                </div>
                                <span className="truncate font-medium text-ink group-hover:text-accent transition-colors">
                                    {attempt.quiz.studySet.title}
                                </span>
                            </div>

                            <span className="flex items-center gap-4 shrink-0">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-data ${
                                    isMastered
                                        ? "bg-green-tint border border-mastered/30 text-mastered"
                                        : "bg-amber-tint border border-review/30 text-review"
                                }`}>
                                    {attempt.score}% · {isMastered ? "Mastered" : "Review"}
                                </span>

                                <span className="font-data text-xs text-ink-muted hidden sm:inline">
                                    {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : null}
                                </span>

                                <IconChevronRight size={16} className="text-ink-muted group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

