"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface StudySetCardProps {
    set: {
        id: string;
        title: string;
        filename: string;
        itemCounts: {
            flashcards: number;
            mcq: number;
            fillInBlank: number;
            theory: number;
        };
        lastScore: number | null;
    };
    index: number;
}

export function StudySetCard({ set, index }: StudySetCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
        >
            <Link
                href={`/dashboard/study-sets/${set.id}`}
                className="group flex flex-col rounded-xl border border-rule bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-accent/30"
            >
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1.5 min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent/70">Study set</p>
                        <h3 className="text-[15px] font-semibold text-ink truncate group-hover:text-accent transition-colors">{set.title}</h3>
                    </div>
                    {set.lastScore !== null && (
                        <span
                            className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                set.lastScore >= 70 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            }`}
                        >
                            {set.lastScore}%
                        </span>
                    )}
                </div>
                <p className="text-sm text-ink-muted truncate mb-4">{set.filename}</p>
                <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 font-data text-xs text-ink-muted">
                    <span>{set.itemCounts.flashcards}c</span>
                    <span>{set.itemCounts.mcq}m</span>
                    <span>{set.itemCounts.fillInBlank}f</span>
                    <span>{set.itemCounts.theory}t</span>
                </div>
            </Link>
        </motion.div>
    );
}
