"use client";

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

interface TheoryCardProps {
    question: string;
    referenceAnswer: string;
    keyPoints: string[];
    rightSlot?: React.ReactNode;
}

export function TheoryCard({ question, referenceAnswer, keyPoints, rightSlot }: TheoryCardProps) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div
            onClick={() => setRevealed((v) => !v)}
            className="rounded-md border border-rule bg-card p-4 cursor-pointer select-none transition hover:bg-paper-hover  "
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="font-sans text-base font-semibold text-ink leading-7">{question}</h3>
                <span className="flex items-center gap-2 text-xs font-semibold text-ink-muted shrink-0 mt-1.5">
                    <IconChevronDown size={14} className={`transition-transform ${revealed ? "rotate-180" : ""}`} />
                    {rightSlot}
                </span>
            </div>
            {revealed && (
                <div onClick={(e) => e.stopPropagation()}>
                    <div className="mt-3 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Model Reference Answer</p>
                        <p className="text-sm leading-6 text-ink-muted">{referenceAnswer}</p>
                    </div>
                    <div className="mt-3 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Key Points Rubric</p>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-ink-muted leading-6">
                            {keyPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
