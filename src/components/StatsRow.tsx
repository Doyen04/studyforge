"use client";

import { motion } from "motion/react";

export function StatsRow({
    stats,
}: {
    stats: { studySets: number; questionsGenerated: number; quizzesTaken: number; averageScore: number | null };
}) {
    const items = [
        {
            label: "Study sets",
            value: stats.studySets,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5Z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg>,
        },
        {
            label: "Questions made",
            value: stats.questionsGenerated >= 1000 ? `${(stats.questionsGenerated / 1000).toFixed(1)}k` : stats.questionsGenerated,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
        },
        {
            label: "Quizzes taken",
            value: stats.quizzesTaken,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6"/><path d="M9 16h6"/><path d="M9 20h6"/><path d="M4 4h16v16H4z"/><path d="M4 8h16"/></svg>,
        },
        {
            label: "Avg. score",
            value: stats.averageScore !== null ? `${stats.averageScore}%` : "\u2014",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item, i) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.3, delay: i * 0.08, ease: "easeOut" }}
                    className="rounded-xl border border-rule bg-card p-5 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-accent/60">{item.icon}</span>
                        <span className="font-data text-2xl font-semibold text-ink">{item.value}</span>
                    </div>
                    <p className="text-xs font-medium text-ink-muted tracking-wide uppercase">{item.label}</p>
                </motion.div>
            ))}
        </div>
    );
}
