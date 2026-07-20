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
            caption: stats.documentsWithoutStudySet
                ? `${stats.documentsWithoutStudySet} document${stats.documentsWithoutStudySet > 1 ? "s" : ""} not yet processed`
                : stats.studySets > 0
                    ? "All documents processed"
                    : "No documents yet",
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
        accent: { bg: "bg-wine-tint", text: "text-accent" },
        blue: { bg: "bg-blue-tint", text: "text-blue" },
        mastered: { bg: "bg-green-tint", text: "text-mastered" },
        review: { bg: "bg-amber-tint", text: "text-review" },
    };

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item) => {
                const { bg, text } = colorMap[item.color] ?? colorMap.accent;
                return (
                    <div key={item.label} className="relative group">
                        <div className="absolute top-1.5 left-1.5 right-0 bottom-0 rounded-md border border-rule bg-surface-2 z-0 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                        <div className="relative z-10 h-full rounded-md border border-rule bg-card p-5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                            <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-md ${bg} ${text}`}>
                                {item.icon}
                            </div>
                            <div className="font-data text-[27px] font-semibold leading-none text-ink">{item.value}</div>
                            <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-muted">{item.label}</div>
                            <div className="mt-2 text-xs text-ink-muted">{item.caption}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
