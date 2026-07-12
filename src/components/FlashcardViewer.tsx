"use client";

import { useState } from "react";
import type { FlashcardData } from "@/types/domain";

export function FlashcardViewer({ cards }: { cards: FlashcardData[] }) {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const card = cards[index];

    function go(delta: number) {
        setFlipped(false);
        setIndex((i) => Math.max(0, Math.min(cards.length - 1, i + delta)));
    }

    if (!card) {
        return (
            <div className="rounded-lg border border-rule bg-card p-6 text-center text-sm text-ink-muted">
                No flashcards available.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-sm">
            <button
                type="button"
                onClick={() => setFlipped((f) => !f)}
                aria-label={flipped ? "Show question" : "Show answer"}
                className="relative h-64 w-full cursor-pointer [perspective:1200px]"
            >
                <div
                    className="relative h-full w-full rounded-lg border border-rule bg-card transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none"
                    style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center [backface-visibility:hidden]">
                        <p className="font-sans text-base text-ink">{card.front}</p>
                    </div>
                    <div
                        className="absolute inset-0 flex items-center justify-center p-6 text-center [backface-visibility:hidden]"
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        <p className="font-sans text-base text-ink">{card.back}</p>
                    </div>
                </div>
            </button>

            <div className="mt-4 flex items-center justify-between text-sm">
                <button
                    type="button"
                    onClick={() => go(-1)}
                    disabled={index === 0}
                    className="cursor-pointer font-semibold text-accent hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-30"
                >
                    ← Prev
                </button>
                <span className="font-data text-sm text-ink-muted">
                    {index + 1} / {cards.length}
                </span>
                <button
                    type="button"
                    onClick={() => go(1)}
                    disabled={index === cards.length - 1}
                    className="cursor-pointer font-semibold text-accent hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-30"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
