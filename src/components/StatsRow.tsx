export function StatsRow({
    stats,
}: {
    stats: { studySets: number; questionsGenerated: number; quizzesTaken: number; averageScore: number | null };
}) {
    const items = [
        { label: "Study sets", value: stats.studySets, icon: "📚" },
        { label: "Questions made", value: stats.questionsGenerated >= 1000 ? `${(stats.questionsGenerated / 1000).toFixed(1)}k` : stats.questionsGenerated, icon: "✍️" },
        { label: "Quizzes taken", value: stats.quizzesTaken, icon: "📝" },
        { label: "Avg. score", value: stats.averageScore !== null ? `${stats.averageScore}%` : "—", icon: "🎯" },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item) => (
                <div key={item.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-data text-2xl font-semibold text-ink">{item.value}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 tracking-wide uppercase">{item.label}</p>
                </div>
            ))}
        </div>
    );
}