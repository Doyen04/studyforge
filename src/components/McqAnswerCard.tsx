"use client";

import { IconCheck, IconX } from "@tabler/icons-react";

interface McqAnswerCardProps {
    options: string[];
    userAnswer: string;
    correctIndex?: number;
    explanation?: string;
}

export function McqAnswerCard({ options, userAnswer, correctIndex, explanation }: McqAnswerCardProps) {
    return (
        <div className="space-y-2">
            {options.map((option, idx) => {
                const isUserChoice = String(idx) === userAnswer;
                const isRight = idx === correctIndex;
                return (
                    <div
                        key={idx}
                        className={`rounded-md border p-3 text-sm flex items-center justify-between ${
                            isRight
                                ? "border-mastered bg-green-tint text-ink font-semibold"
                                : isUserChoice
                                    ? "border-error bg-red-tint text-ink"
                                    : "border-rule bg-paper text-ink-muted"
                        }`}
                    >
                        <span>
                            <span className="font-data mr-1.5 text-ink-muted">{idx + 1}.</span>
                            {option}
                        </span>
                        {isRight && <span className="text-xs text-mastered font-semibold">Correct answer</span>}
                        {isUserChoice && !isRight && <span className="text-xs text-error font-semibold">Your selection</span>}
                    </div>
                );
            })}
            {explanation && (
                <div className="text-xs leading-5 text-ink-muted bg-paper p-3 rounded border border-rule">
                    <span className="font-semibold text-accent block mb-1">Explanation</span>
                    {explanation}
                </div>
            )}
        </div>
    );
}
