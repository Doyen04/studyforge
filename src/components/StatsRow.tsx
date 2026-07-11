export function StatsRow({
    stats,
}: {
    stats: { studySets: number; questionsGenerated: number; quizzesTaken: number; averageScore: number | null };
}) {
    const items = [
        { label: "Study sets", value: stats.studySets },
        { label: "Questions made", value: stats.questionsGenerated },
        { label: "Quizzes taken", value: stats.quizzesTaken },
        { label: "Avg. score", value: stats.averageScore !== null ? `${stats.averageScore}%` : "—" },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {items.map((item) => (
                <div key={item.label} className="rounded-lg border border-rule bg-card p-3">
                    <p className="text-xs text-ink-muted">{item.label}</p>
                    <p className="font-data text-xl font-medium text-ink">{item.value}</p>
                </div>
            ))}
        </div>
    );
}