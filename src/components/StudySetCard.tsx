"use client";

import { useState } from "react";
import Link from "next/link";
import { ConfirmModal } from "./ConfirmModal";

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
    onDelete?: (id: string) => void;
    /** Total count for cascading deletion message */
    quizCount?: number;
}

export function StudySetCard({ set, index, onDelete, quizCount = 0 }: StudySetCardProps) {
    const total = set.itemCounts.flashcards + set.itemCounts.mcq + set.itemCounts.fillInBlank + set.itemCounts.theory;
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const catalogTag = `SF·${String(index + 1).padStart(2, "0")}`;

    const scoreBadge = set.lastScore === null ? (
        <span className="text-[11px] font-medium text-ink-muted">Not quizzed yet</span>
    ) : set.lastScore >= 70 ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-tint border border-mastered/30 px-2.5 py-0.5 text-[11px] font-semibold text-mastered font-data">
            Score {set.lastScore}% · Mastered
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-tint border border-review/30 px-2.5 py-0.5 text-[11px] font-semibold text-review font-data">
            Score {set.lastScore}% · Review
        </span>
    );

    return (
        <>
            <div className="relative group">
                <div className="absolute top-2 left-2 right-0 bottom-0 rounded-lg border border-rule bg-surface-2 z-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                <div className="relative z-10 rounded-lg border border-rule bg-card p-5 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-accent/40">
                    <div className="flex items-start justify-between gap-3">
                        <div className="card-eyebrow text-[11px] font-semibold uppercase tracking-wider text-accent font-data">
                            Study Set
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="font-data text-[11px] text-ink-muted bg-surface-2 px-1.5 py-0.5 rounded border border-rule">{catalogTag}</span>
                            {onDelete && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setMenuOpen((prev) => !prev)}
                                        className="flex h-6.5 w-6.5 items-center justify-center rounded-md border-none bg-transparent text-ink-muted hover:bg-paper hover:text-ink cursor-pointer transition"
                                        aria-label="More options"
                                    >
                                        ⋯
                                    </button>
                                    {menuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                            <div className="absolute right-0 top-9 z-20 min-w-35 overflow-hidden rounded-md border border-rule bg-card">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        setShowDelete(true);
                                                    }}
                                                    className="w-full cursor-pointer border-none bg-transparent px-3.5 py-2 text-left text-[13.5px] font-sans text-error hover:bg-paper"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Link href={`/dashboard/study-sets/${set.id}`} className="block mt-2 group-hover:text-accent transition-colors">
                        <h3 className="font-display text-[17px] font-semibold text-ink truncate leading-tight">{set.title}</h3>
                    </Link>

                    <p className="text-xs text-ink-muted mt-1 font-sans">
                        {set.filename} · <span className="font-data font-semibold text-ink">{total}</span> items
                    </p>

                    <div className="mt-3">
                        {scoreBadge}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3 border-t border-rule/60">
                        {set.itemCounts.flashcards > 0 && (
                            <span className="rounded-full bg-blue-tint px-2.5 py-0.5 text-[11px] font-semibold text-blue font-data">
                                {set.itemCounts.flashcards} cards
                            </span>
                        )}
                        {set.itemCounts.mcq > 0 && (
                            <span className="rounded-full bg-green-tint px-2.5 py-0.5 text-[11px] font-semibold text-mastered font-data">
                                {set.itemCounts.mcq} MCQ
                            </span>
                        )}
                        {set.itemCounts.fillInBlank > 0 && (
                            <span className="rounded-full bg-amber-tint px-2.5 py-0.5 text-[11px] font-semibold text-review font-data">
                                {set.itemCounts.fillInBlank} blank
                            </span>
                        )}
                        {set.itemCounts.theory > 0 && (
                            <span className="rounded-full bg-graphite-tint px-2.5 py-0.5 text-[11px] font-semibold text-graphite font-data">
                                {set.itemCounts.theory} theory
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                title={`Delete "${set.title}"?`}
                message={`This will also delete ${total} question${total !== 1 ? "s" : ""}${quizCount > 0 ? ` and ${quizCount} quiz${quizCount > 1 ? "zes" : ""}` : ""}. This can't be undone.`}
                confirmLabel="Delete"
                destructive
                onConfirm={() => {
                    setShowDelete(false);
                    onDelete?.(set.id);
                }}
                onCancel={() => setShowDelete(false)}
            />
        </>
    );
}

