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
            <h2 className="text-lg font-semibold text-ink">Recent quiz results</h2>
            <div className="divide-y divide-rule overflow-hidden rounded-lg border border-rule bg-card">
                {attempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                        <span className="truncate text-ink">{attempt.quiz.studySet.title}</span>
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