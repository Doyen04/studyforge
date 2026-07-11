"use client";

import { CardShell } from "./CardShell";

interface FillInBlankCardProps {
    sentence: string;
    answer: string;
    acceptableAnswers: string[];
}

export function FillInBlankCard({ sentence, answer, acceptableAnswers }: FillInBlankCardProps) {
    return (
        <CardShell question={sentence}>
            <div className="rounded-md border border-mastered bg-mastered/10 p-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-mastered mb-1">Correct Answer</p>
                <p className="font-sans font-semibold text-ink text-base">{answer}</p>
            </div>
            {acceptableAnswers.length > 0 && (
                <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">Acceptable Alternates</p>
                    <p className="text-sm leading-6 text-ink-muted">{acceptableAnswers.join(", ")}</p>
                </div>
            )}
        </CardShell>
    );
}
