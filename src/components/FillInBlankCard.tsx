"use client";

import { useState } from "react";

interface FillInBlankCardProps {
    sentence: string;
    answer: string;
    acceptableAnswers: string[];
}

export function FillInBlankCard({ sentence, answer, acceptableAnswers }: FillInBlankCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="group cursor-pointer rounded-lg border border-rule bg-card p-4 transition hover:bg-paper-hover select-none"
        >
            <div className="flex items-start justify-between gap-4">
                <h3 className="font-sans text-base font-semibold text-ink group-hover:text-focus transition-colors">
                    {sentence}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted shrink-0 mt-0.5">
                    {isExpanded ? "Hide answer" : "Show answer"}
                </span>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-rule space-y-4" onClick={(e) => e.stopPropagation()}>
                    <div className="rounded-md border border-mastered bg-mastered/10 p-3 text-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-mastered mb-1">
                            Correct Answer
                        </p>
                        <p className="font-sans font-semibold text-ink text-base">{answer}</p>
                    </div>

                    {acceptableAnswers.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-focus">
                                Acceptable Alternates
                            </p>
                            <p className="text-sm leading-6 text-ink-muted">{acceptableAnswers.join(", ")}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
