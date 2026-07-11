"use client";

import { CardShell } from "./CardShell";

interface McqCardProps {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export function McqCard({ question, options, correctIndex, explanation }: McqCardProps) {
    return (
        <CardShell question={question}>
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
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Explanation</p>
                <p className="text-sm leading-6 text-ink-muted">{explanation}</p>
            </div>
        </CardShell>
    );
}
