"use client";

import { useState, useEffect, useCallback } from "react";
import { IconArrowLeft, IconArrowRight, IconRotate, IconCheck, IconX, IconCommand } from "@tabler/icons-react";
import type { FlashcardData } from "@/types/domain";

export function FlashcardViewer({ cards }: { cards: FlashcardData[] }) {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [mastery, setMastery] = useState<Record<string, "known" | "review">>({});
    const card = cards[index];

    const go = useCallback((delta: number) => {
        setFlipped(false);
        setIndex((i) => Math.max(0, Math.min(cards.length - 1, i + delta)));
    }, [cards.length]);

    const toggleFlip = useCallback(() => {
        setFlipped((f) => !f);
    }, []);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            // Ignore if user typing in input/textarea
            if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

            if (e.code === "Space") {
                e.preventDefault();
                toggleFlip();
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                go(-1);
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                go(1);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [go, toggleFlip]);

    if (!card) {
        return (
            <div className="rounded-lg border border-rule bg-card p-6 text-center text-sm text-ink-muted">
                No flashcards available.
            </div>
        );
    }

    const currentStatus = mastery[card.id];

    return (
        <div className="mx-auto max-w-xl space-y-4">
            {/* Card Flip Container */}
            <div className="relative group">
                <button
                    type="button"
                    onClick={toggleFlip}
                    aria-label={flipped ? "Show question" : "Show answer"}
                    className="relative h-72 w-full cursor-pointer [perspective:1200px] text-left outline-none"
                >
                    <div
                        className="relative h-full w-full rounded-xl border border-rule bg-card transition-all duration-500 [transform-style:preserve-3d] group-hover:border-accent/40 motion-reduce:transition-none"
                        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                    >
                        {/* Front Side */}
                        <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center [backface-visibility:hidden]">
                            <div className="flex w-full items-center justify-between text-xs text-ink-muted">
                                <span className="font-data font-semibold text-accent uppercase tracking-wider text-[11px]">Prompt</span>
                                <span className="font-data">{index + 1} of {cards.length}</span>
                            </div>

                            <p className="font-sans text-lg md:text-xl font-medium leading-snug text-ink my-auto">
                                {card.front}
                            </p>

                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted opacity-70">
                                <IconRotate size={13} className="animate-spin-slow" />
                                <span>Click or Press <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-rule text-ink font-data text-[10px]">Space</kbd> to flip</span>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center [backface-visibility:hidden]"
                            style={{ transform: "rotateY(180deg)" }}
                        >
                            <div className="flex w-full items-center justify-between text-xs text-ink-muted">
                                <span className="font-data font-semibold text-mastered uppercase tracking-wider text-[11px]">Answer</span>
                                <span className="font-data">{index + 1} of {cards.length}</span>
                            </div>

                            <p className="font-sans text-lg md:text-xl font-medium leading-relaxed text-ink my-auto">
                                {card.back}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMastery((prev) => ({ ...prev, [card.id]: "review" }));
                                    }}
                                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold border transition ${
                                        currentStatus === "review"
                                            ? "bg-amber-tint border-review text-review"
                                            : "bg-surface-2 border-rule text-ink-muted hover:border-review hover:text-review"
                                    }`}
                                >
                                    <IconX size={13} /> Need Review
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMastery((prev) => ({ ...prev, [card.id]: "known" }));
                                    }}
                                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold border transition ${
                                        currentStatus === "known"
                                            ? "bg-green-tint border-mastered text-mastered"
                                            : "bg-surface-2 border-rule text-ink-muted hover:border-mastered hover:text-mastered"
                                    }`}
                                >
                                    <IconCheck size={13} /> Got It
                                </button>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            {/* Navigation & Controls Footer */}
            <div className="flex items-center justify-between rounded-lg border border-rule bg-card px-4 py-3 text-sm">
                <button
                    type="button"
                    onClick={() => go(-1)}
                    disabled={index === 0}
                    className="flex items-center gap-1 cursor-pointer font-semibold text-accent hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <IconArrowLeft size={16} /> Prev
                </button>

                <div className="flex items-center gap-3 text-xs text-ink-muted">
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-data">
                        <IconCommand size={12} /> <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-rule">←</kbd> <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-rule">→</kbd>
                    </span>
                    <span className="font-data font-semibold text-ink">
                        {index + 1} / {cards.length}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => go(1)}
                    disabled={index === cards.length - 1}
                    className="flex items-center gap-1 cursor-pointer font-semibold text-accent hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-30"
                >
                    Next <IconArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

