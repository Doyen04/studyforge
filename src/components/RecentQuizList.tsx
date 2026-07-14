"use client";

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
        <section className="space-y-3">
            <h2 className="text-base font-semibold text-ink">Recent quiz results</h2>
            <div className="divide-y divide-rule overflow-hidden rounded-xl border border-rule bg-card">
                {attempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition-colors hover:bg-paper-hover">
                        <span className="truncate font-medium text-ink">{attempt.quiz.studySet.title}</span>
                        <span className="flex items-center gap-3 shrink-0">
                            <span className={`font-semibold tabular-nums ${attempt.score >= 70 ? "text-mastered" : "text-review"}`}>
                                {attempt.score}%
                            </span>
                            <span className="font-data text-xs text-ink-muted">
                                {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : null}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
