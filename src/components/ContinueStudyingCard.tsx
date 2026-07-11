"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function ContinueStudyingCard({
    studySet,
    itemCounts,
    lastScore,
}: {
    studySet: { id: string; title: string };
    itemCounts: { flashcards: number; mcq: number; fillInBlank: number; theory: number };
    lastScore: number | null;
}) {
    const scoreColor = lastScore === null ? "text-ink-muted" : lastScore >= 70 ? "text-mastered" : "text-review";
    const scoreLabel = lastScore === null ? "Not quizzed yet" : `Last score ${lastScore}%`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative overflow-hidden rounded-xl border border-rule bg-card p-6 shadow-sm"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-r-full" />
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Continue studying</p>
                    <p className="font-sans text-lg font-semibold text-ink">{studySet.title}</p>
                    <div className="flex items-center gap-1.5 text-sm">
                        <span className={`font-medium ${scoreColor}`}>{scoreLabel}</span>
                        <span className="text-ink-muted/30 mx-1">·</span>
                        <span className="text-ink-muted">
                            {itemCounts.flashcards}c · {itemCounts.mcq}m · {itemCounts.fillInBlank}f · {itemCounts.theory}t
                        </span>
                    </div>
                </div>
                <Link
                    href={`/dashboard/study-sets/${studySet.id}`}
                    className="whitespace-nowrap rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white! shadow-sm transition-all hover:bg-accent-hover hover:shadow-md"
                >
                    {lastScore === null ? "Start studying" : "Quiz again"}
                </Link>
            </div>
        </motion.div>
    );
}
