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

    return (
        <>
            <div className="relative group">
                <div className="absolute top-2 left-2 right-0 bottom-0 rounded-md border border-rule bg-surface-2 z-0" />
                <div className="relative z-10 rounded-md border border-rule bg-card p-5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="card-eyebrow text-[11px] font-semibold uppercase tracking-[0.07em] text-accent">Study set</div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="font-data text-[11px] text-ink-muted">{catalogTag}</span>
                            {onDelete && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setMenuOpen((prev) => !prev)}
                                        className="flex h-[26px] w-[26px] items-center justify-center rounded-md border-none bg-transparent text-ink-muted hover:bg-paper hover:text-ink cursor-pointer"
                                        aria-label="More options"
                                    >
                                        ⋯
                                    </button>
                                    {menuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                            <div className="absolute right-0 top-9 z-20 min-w-[140px] overflow-hidden rounded-md border border-rule bg-card shadow-[0_1px_2px_rgba(32,28,26,.05),0_8px_20px_-10px_rgba(32,28,26,.14)] dark:shadow-[0_1px_2px_rgba(0,0,0,.3),0_8px_20px_-10px_rgba(0,0,0,.5)]">
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

                    <Link href={`/dashboard/study-sets/${set.id}`} className="block mt-1">
                        <h3 className="font-display text-[17px] font-semibold text-ink truncate">{set.title}</h3>
                    </Link>

                    <p className="text-[12.5px] text-ink-muted mt-1">
                        {set.filename} · {total} questions
                    </p>

                    <div className="text-[11px] text-ink-muted mt-2">
                        {set.lastScore === null ? "Not quizzed yet" : `Best score ${set.lastScore}%`}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="rounded-full bg-blue-tint px-2.5 py-1 text-[11.5px] font-semibold text-blue">{set.itemCounts.flashcards} flashcards</span>
                        <span className="rounded-full bg-green-tint px-2.5 py-1 text-[11.5px] font-semibold text-mastered">{set.itemCounts.mcq} MCQ</span>
                        <span className="rounded-full bg-amber-tint px-2.5 py-1 text-[11.5px] font-semibold text-review">{set.itemCounts.fillInBlank} fill-blank</span>
                        <span className="rounded-full bg-graphite-tint px-2.5 py-1 text-[11.5px] font-semibold text-graphite">{set.itemCounts.theory} theory</span>
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
