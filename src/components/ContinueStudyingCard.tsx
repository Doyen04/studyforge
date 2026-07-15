"use client";

import Link from "next/link";
import { IconBook, IconArrowRight } from "@tabler/icons-react";

export function ContinueStudyingCard({
    studySet,
    itemCounts,
    lastScore,
}: {
    studySet: { id: string; title: string };
    itemCounts: { flashcards: number; mcq: number; fillInBlank: number; theory: number };
    lastScore: number | null;
}) {
    const total = itemCounts.flashcards + itemCounts.mcq + itemCounts.fillInBlank + itemCounts.theory;
    const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);

    const scoreLabel = lastScore === null ? "Not quizzed yet" : `Last score ${lastScore}%`;

    return (
        <div className="relative overflow-hidden rounded-xl border border-rule bg-card p-5 sm:p-6 shadow-[0_1px_2px_rgba(32,28,26,.05),0_8px_20px_-10px_rgba(32,28,26,.14)] dark:shadow-[0_1px_2px_rgba(0,0,0,.3),0_8px_20px_-10px_rgba(0,0,0,.5)]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-accent" />

            <div className="flex items-center gap-2 mb-3">
                <IconBook size={13} stroke={2} className="text-accent shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">Continue studying</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-ink truncate">{studySet.title}</h3>
                    <p className="text-xs text-ink-muted mt-1">
                        {studySet.title.toLowerCase().replace(/\s+/g, "-")}.pdf · {scoreLabel}
                    </p>
                </div>
                <Link
                    href={`/dashboard/study-sets/${studySet.id}`}
                    className="group flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover sm:self-start"
                >
                    <span>{lastScore === null ? "Start studying" : "Quiz again"}</span>
                    <IconArrowRight size={14} stroke={2.5} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-rule">
                {itemCounts.flashcards > 0 && (
                    <span style={{ width: `${pct(itemCounts.flashcards)}%` }} className="bg-accent" />
                )}
                {itemCounts.mcq > 0 && (
                    <span style={{ width: `${pct(itemCounts.mcq)}%` }} className="bg-mastered" />
                )}
                {itemCounts.fillInBlank > 0 && (
                    <span style={{ width: `${pct(itemCounts.fillInBlank)}%` }} className="bg-review" />
                )}
                {itemCounts.theory > 0 && (
                    <span style={{ width: `${pct(itemCounts.theory)}%` }} className="bg-ink-muted" />
                )}
            </div>

            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {itemCounts.flashcards} flashcards
                </span>
                <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-mastered" />
                    {itemCounts.mcq} MCQ
                </span>
                <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-review" />
                    {itemCounts.fillInBlank} fill-in-blank
                </span>
                <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-ink-muted" />
                    {itemCounts.theory} theory
                </span>
            </div>
        </div>
    );
}
