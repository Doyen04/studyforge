"use client";

import Link from "next/link";
import { BookCopy, ListChecks, PenLine, MessageSquare } from "lucide-react";

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
}

export function StudySetCard({ set }: StudySetCardProps) {
    return (
        <Link
            href={`/dashboard/study-sets/${set.id}`}
            className="group flex flex-col rounded-xl border border-rule bg-card p-5 transition-all hover:border-accent/30 hover:-translate-y-0.5"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="space-y-1.5 min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent/70">Study set</p>
                    <h3 className="text-[15px] font-semibold text-ink truncate group-hover:text-accent transition-colors">{set.title}</h3>
                </div>
                {set.lastScore !== null && (
                    <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            set.lastScore >= 70 ? "bg-mastered/10 text-mastered" : "bg-review/10 text-review"
                        }`}
                    >
                        {set.lastScore}%
                    </span>
                )}
            </div>
            <p className="text-sm text-ink-muted truncate mb-4">{set.filename}</p>
            <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                <span className="flex items-center gap-1"><BookCopy size={12} />{set.itemCounts.flashcards}</span>
                <span className="flex items-center gap-1"><ListChecks size={12} />{set.itemCounts.mcq}</span>
                <span className="flex items-center gap-1"><PenLine size={12} />{set.itemCounts.fillInBlank}</span>
                <span className="flex items-center gap-1"><MessageSquare size={12} />{set.itemCounts.theory}</span>
            </div>
        </Link>
    );
}
