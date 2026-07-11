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
            <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                {attempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                        <span className="truncate font-medium text-ink">{attempt.quiz.studySet.title}</span>
                        <span className="flex items-center gap-3 shrink-0">
                            <span className={`font-semibold tabular-nums ${attempt.score >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                                {attempt.score}%
                            </span>
                            <span className="font-data text-xs text-gray-400">
                                {attempt.completedAt?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}