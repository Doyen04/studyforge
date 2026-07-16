"use client";

import { IconCheck } from "@tabler/icons-react";

interface McqCardProps {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export function McqCard({ question, options, correctIndex, explanation }: McqCardProps) {
    return (
        <div className="rounded-md border border-rule bg-card p-4  ">
            <h3 className="font-sans text-base font-semibold text-ink leading-7">{question}</h3>
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
    );
}
