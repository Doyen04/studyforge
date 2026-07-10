"use client";

import { useState } from "react";

interface TheoryCardProps {
    question: string;
    referenceAnswer: string;
    keyPoints: string[];
}

export function TheoryCard({ question, referenceAnswer, keyPoints }: TheoryCardProps) {
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
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-focus">Model Reference Answer</p>
                        <p className="text-sm leading-6 text-ink-muted">{referenceAnswer}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-focus">Key Points Rubric</p>
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
