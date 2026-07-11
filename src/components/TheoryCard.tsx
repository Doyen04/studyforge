"use client";

import { CardShell } from "./CardShell";

interface TheoryCardProps {
    question: string;
    referenceAnswer: string;
    keyPoints: string[];
}

export function TheoryCard({ question, referenceAnswer, keyPoints }: TheoryCardProps) {
    return (
        <CardShell question={question}>
            <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Model Reference Answer</p>
                <p className="text-sm leading-6 text-ink-muted">{referenceAnswer}</p>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Key Points Rubric</p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-ink-muted leading-6">
                    {keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
        </CardShell>
    );
}
