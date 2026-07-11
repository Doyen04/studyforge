"use client";

import { motion } from "motion/react";
import { BookOpen, PenLine, ListChecks, Clock } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

export function StatsRow({
    stats,
}: {
    stats: DashboardStats;
}) {
    const items = [
        {
            label: "Study sets",
            value: stats.studySets,
            icon: <BookOpen size={20} />,
        },
        {
            label: "Questions made",
            value: stats.questionsGenerated >= 1000 ? `${(stats.questionsGenerated / 1000).toFixed(1)}k` : stats.questionsGenerated,
            icon: <PenLine size={20} />,
        },
        {
            label: "Quizzes taken",
            value: stats.quizzesTaken,
            icon: <ListChecks size={20} />,
        },
        {
            label: "Avg. score",
            value: stats.averageScore !== null ? `${stats.averageScore}%` : "\u2014",
            icon: <Clock size={20} />,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item) => (
                <motion.div
                    key={item.label}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="rounded-xl border border-rule bg-card p-5"
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
