"use client";

import { motion } from "motion/react";
import { IconStack2, IconPencil, IconClipboardCheck, IconTarget } from "@tabler/icons-react";
import type { DashboardStats } from "@/types/domain";

export function StatsRow({ stats }: { stats: DashboardStats }) {
    const items = [
        {
            label: "Study sets",
            value: stats.studySets,
            color: "accent",
            caption: stats.studySets >= 1 ? `${stats.studySets} document${stats.studySets > 1 ? "s" : ""} uploaded` : "No documents yet",
            icon: <IconStack2 size={16} stroke={2} />,
        },
        {
            label: "Questions made",
            value: stats.questionsGenerated >= 1000 ? `${(stats.questionsGenerated / 1000).toFixed(1)}k` : stats.questionsGenerated,
            color: "blue",
            caption: `across ${stats.studySets} study set${stats.studySets !== 1 ? "s" : ""}`,
            icon: <IconPencil size={16} stroke={2} />,
        },
        {
            label: "Quizzes taken",
            value: stats.quizzesTaken,
            color: "mastered",
            caption: stats.quizzesTaken === 0 ? "Take your first quiz" : `${stats.quizzesTaken} quiz${stats.quizzesTaken > 1 ? "zes" : ""} completed`,
            icon: <IconClipboardCheck size={16} stroke={2} />,
        },
        {
            label: "Avg. score",
            value: stats.averageScore !== null ? `${stats.averageScore}%` : "\u2014",
            color: "review",
            caption: stats.averageScore === null ? "Appears after your first quiz" : "Across all quizzes",
            icon: <IconTarget size={16} stroke={2} />,
        },
    ];

    const colorMap: Record<string, { bg: string; text: string }> = {
        accent: { bg: "bg-accent/10", text: "text-accent" },
        blue: { bg: "bg-blue-tint", text: "text-blue" },
        mastered: { bg: "bg-mastered/10", text: "text-mastered" },
        review: { bg: "bg-review/10", text: "text-review" },
    };

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item) => {
                const { bg, text } = colorMap[item.color] ?? colorMap.accent;
                return (
                    <motion.div
                        key={item.label}
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="rounded-xl border border-rule bg-card p-5"
                    >
                        <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${text}`}>
                            {item.icon}
                        </div>
                        <div className="font-data text-2xl font-semibold text-ink">{item.value}</div>
                        <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                            {item.label}
                        </div>
                        <div className="mt-1.5 text-xs text-ink-muted">{item.caption}</div>
                    </motion.div>
                );
            })}
        </div>
    );
}
