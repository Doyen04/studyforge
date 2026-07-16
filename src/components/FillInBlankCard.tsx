"use client";

import { useState } from "react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

interface FillInBlankCardProps {
    sentence: string;
    answer: string;
    acceptableAnswers: string[];
    rightSlot?: React.ReactNode;
}

export function FillInBlankCard({ sentence, answer, acceptableAnswers, rightSlot }: FillInBlankCardProps) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div
            onClick={() => setRevealed((v) => !v)}
            className="rounded-md border border-rule bg-card p-4 cursor-pointer select-none transition hover:bg-paper-hover  "
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="font-sans text-base font-semibold text-ink leading-7">{sentence}</h3>
                <span className="flex items-center gap-2 text-xs font-semibold text-ink-muted shrink-0 mt-1.5">
                    <IconChevronDown size={14} className={`transition-transform ${revealed ? "rotate-180" : ""}`} />
                    {rightSlot}
                </span>
            </div>
            {revealed && (
                <div onClick={(e) => e.stopPropagation()}>
                    <div className="mt-3 flex items-center gap-2 rounded-md border border-mastered bg-green-tint p-3 text-sm">
                        <IconCheck size={14} stroke={3} className="text-mastered shrink-0" />
                        <span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-mastered mr-2">Answer:</span>
                            <span className="font-semibold text-ink">{answer}</span>
                        </span>
                    </div>
                    {acceptableAnswers.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">Acceptable Alternates</p>
                            <p className="text-sm leading-6 text-ink-muted">{acceptableAnswers.join(", ")}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
