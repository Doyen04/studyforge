"use client";

import { useState } from "react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

interface McqCardProps {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export function McqCard({ question, options, correctIndex, explanation }: McqCardProps) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div
            onClick={() => setRevealed((v) => !v)}
            className="rounded-md border border-rule bg-card p-4 cursor-pointer select-none transition hover:bg-paper-hover  "
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="font-sans text-base font-semibold text-ink leading-7">{question}</h3>
                <span className="flex items-center gap-1 text-xs font-semibold text-ink-muted shrink-0 mt-1.5">
                    <IconChevronDown size={14} className={`transition-transform ${revealed ? "rotate-180" : ""}`} />
                </span>
            </div>
            {revealed && (
                <div onClick={(e) => e.stopPropagation()}>
                    <ul className="mt-3 space-y-2">
                        {options.map((option, idx) => {
                            const isCorrect = idx === correctIndex;
                            return (
                                <li
                                    key={idx}
                                    className={`rounded-md border p-3 text-sm flex items-center justify-between ${isCorrect
                                            ? "border-mastered bg-green-tint text-ink font-semibold"
                                            : "border-rule bg-paper text-ink-muted"
                                        }`}
                                >
                                    <span>
                                        <span className="font-data mr-2">{idx + 1}.</span>
                                        {option}
                                    </span>
                                    {isCorrect && (
                                        <span className="flex items-center gap-1 text-xs text-mastered">
                                            <IconCheck size={12} stroke={3} />
                                            Correct
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    {explanation && (
                        <div className="mt-3 pt-3 border-t border-rule">
                            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">Explanation</p>
                            <p className="text-sm leading-6 text-ink-muted">{explanation}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
