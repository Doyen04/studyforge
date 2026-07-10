"use client";

import { useState } from "react";

interface McqCardProps {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export function McqCard({ question, options, correctIndex, explanation }: McqCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="group cursor-pointer rounded-lg border border-rule bg-card p-4 transition hover:bg-paper-hover select-none"
        >
            <div className="flex items-start justify-between gap-4">
                <h3 className="font-sans text-base font-semibold text-ink group-hover:text-focus transition-colors">
                    {question}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted shrink-0 mt-0.5">
                    {isExpanded ? "Hide answer" : "Show answer"}
                </span>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-rule space-y-4" onClick={(e) => e.stopPropagation()}>
                    <ul className="space-y-2">
                        {options.map((option, idx) => {
                            const isCorrect = idx === correctIndex;
                            return (
                                <li
                                    key={idx}
                                    className={`rounded-md border p-3 text-sm transition ${
                                        isCorrect
                                            ? "border-mastered bg-mastered/10 font-semibold text-ink"
                                            : "border-rule bg-paper text-ink-muted"
                                    }`}
                                >
                                    <span className="mr-2 font-data">{idx + 1}.</span>
                                    {option}
                                </li>
                            );
                        })}
                    </ul>
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-focus">Explanation</p>
                        <p className="text-sm leading-6 text-ink-muted">{explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
