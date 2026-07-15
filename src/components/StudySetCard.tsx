"use client";

import Link from "next/link";

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
    const total = set.itemCounts.flashcards + set.itemCounts.mcq + set.itemCounts.fillInBlank + set.itemCounts.theory;

    return (
        <div className="relative group">
            <div className="absolute top-2 left-2 right-0 bottom-0 rounded-xl border border-rule bg-paper" />
            <Link
                href={`/dashboard/study-sets/${set.id}`}
                className="relative z-10 flex flex-col rounded-xl border border-rule bg-card p-5 transition-all group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">Study set</span>
                        <h3 className="font-display text-base font-semibold text-ink mt-1 truncate">{set.title}</h3>
                    </div>
                    {set.lastScore !== null && (
                        <span
                            className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                                set.lastScore >= 70
                                    ? "bg-mastered/10 text-mastered"
                                    : "bg-review/10 text-review"
                            }`}
                        >
                            {set.lastScore}%
                        </span>
                    )}
                </div>
                <p className="text-xs text-ink-muted mt-1.5">
                    {set.filename} · {total} questions
                </p>
                {set.lastScore === null && (
                    <span className="text-xs text-ink-muted mt-2">Not quizzed yet</span>
                )}
                <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                        {set.itemCounts.flashcards} flashcards
                    </span>
                    <span className="rounded-full bg-mastered/10 px-2.5 py-0.5 text-[10px] font-semibold text-mastered">
                        {set.itemCounts.mcq} MCQ
                    </span>
                    <span className="rounded-full bg-review/10 px-2.5 py-0.5 text-[10px] font-semibold text-review">
                        {set.itemCounts.fillInBlank} fill-blank
                    </span>
                    <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[10px] font-semibold text-ink-muted">
                        {set.itemCounts.theory} theory
                    </span>
                </div>
            </Link>
        </div>
    );
}
