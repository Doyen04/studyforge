"use client";

import Link from "next/link";
import { BookOpen, BookCopy, ListChecks, PenLine, MessageSquare, ArrowRight } from "lucide-react";

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
        <div className="relative overflow-hidden rounded-xl border border-rule bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/20">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-r-full" />
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-accent" />
                        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Continue studying</p>
                    </div>
                    <p className="font-sans text-lg font-semibold text-ink">{studySet.title}</p>
                    <div className="flex items-center gap-1.5 text-sm">
                        <span className={`font-medium ${scoreColor}`}>{scoreLabel}</span>
                        <span className="text-ink-muted/30 mx-1">·</span>
                        <span className="flex items-center gap-3 text-ink-muted">
                            <span className="flex items-center gap-1"><BookCopy size={13} />{itemCounts.flashcards}</span>
                            <span className="flex items-center gap-1"><ListChecks size={13} />{itemCounts.mcq}</span>
                            <span className="flex items-center gap-1"><PenLine size={13} />{itemCounts.fillInBlank}</span>
                            <span className="flex items-center gap-1"><MessageSquare size={13} />{itemCounts.theory}</span>
                        </span>
                    </div>
                </div>
                <Link
                    href={`/dashboard/study-sets/${studySet.id}`}
                    className="group flex items-center gap-1.5 whitespace-nowrap rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white! transition-all hover:bg-accent-hover"
                >
                    <span>{lastScore === null ? "Start studying" : "Quiz again"}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </div>
    );
}
