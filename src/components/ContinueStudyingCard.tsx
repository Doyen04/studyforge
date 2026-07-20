"use client";

import Link from "next/link";
import { IconBook, IconArrowRight } from "@tabler/icons-react";

export function ContinueStudyingCard({
    studySet,
    itemCounts,
    lastScore,
}: {
    studySet: { id: string; title: string; filename?: string };
    itemCounts: { flashcards: number; mcq: number; fillInBlank: number; theory: number };
    lastScore: number | null;
}) {
    const total = itemCounts.flashcards + itemCounts.mcq + itemCounts.fillInBlank + itemCounts.theory;
    const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
    const scoreLabel = lastScore === null ? "Not quizzed yet" : `Last score ${lastScore}%`;

    return (
        <div className="rounded-md border border-rule bg-card p-6  ">
            <div className="flex items-center gap-2 mb-3">
                <IconBook size={13} stroke={2} className="text-accent shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-accent">Continue studying</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="font-display text-[23px] font-semibold text-ink truncate">{studySet.title}</h3>
                    <p className="text-sm text-ink-muted mt-1">
                        {studySet.filename ?? `${studySet.title.toLowerCase().replace(/\s+/g, "-")}.pdf`} · {scoreLabel}
                    </p>
                </div>
                <Link
                    href={`/dashboard/study-sets/${studySet.id}`}
                    className="group flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover sm:self-start"
                >
                    <span>{lastScore === null ? "Start studying" : "Quiz again"}</span>
                    <IconArrowRight size={14} stroke={2.5} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-paper">
                {itemCounts.flashcards > 0 && (
                    <span style={{ width: `${pct(itemCounts.flashcards)}%` }} className="bg-blue" />
                )}
                {itemCounts.mcq > 0 && (
                    <span style={{ width: `${pct(itemCounts.mcq)}%` }} className="bg-mastered" />
                )}
                {itemCounts.fillInBlank > 0 && (
                    <span style={{ width: `${pct(itemCounts.fillInBlank)}%` }} className="bg-review" />
                )}
                {itemCounts.theory > 0 && (
                    <span style={{ width: `${pct(itemCounts.theory)}%` }} className="bg-graphite" />
                )}
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.05em] font-semibold text-ink-muted">
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-sm bg-blue" />
                    {itemCounts.flashcards} flashcards
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-sm bg-mastered" />
                    {itemCounts.mcq} MCQ
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-sm bg-review" />
                    {itemCounts.fillInBlank} fill-in-blank
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-sm bg-graphite" />
                    {itemCounts.theory} theory
                </span>
            </div>
        </div>
    );
}
