"use client";

import { GradedMargin } from "./GradedMargin";

interface TheoryAnswerCardProps {
    userAnswer: string;
    score: number;
    feedback?: string;
    matchedKeyPoints?: string[];
    missedKeyPoints?: string[];
    correctAnswer?: string;
}

export function TheoryAnswerCard({ userAnswer, score, feedback, matchedKeyPoints, missedKeyPoints, correctAnswer }: TheoryAnswerCardProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-accent">Your response</p>
                <p className="text-sm leading-6 text-ink-muted bg-paper p-3 rounded-md border border-rule italic">
                    &ldquo;{userAnswer || "(None)"}&rdquo;
                </p>
            </div>
            {feedback && (
                <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-accent">Grading Feedback</p>
                    <p className="text-sm leading-6 text-ink">{feedback}</p>
                </div>
            )}
            <div className="space-y-2 pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-accent">Rubric Matching</p>
                <GradedMargin
                    matchedKeyPoints={matchedKeyPoints || []}
                    missedKeyPoints={missedKeyPoints || []}
                />
            </div>
            {correctAnswer && (
                <details className="text-xs border border-rule bg-paper p-3 rounded">
                    <summary className="font-semibold text-accent cursor-pointer">View Model Reference Answer</summary>
                    <p className="mt-2 text-sm text-ink-muted leading-6">{correctAnswer}</p>
                </details>
            )}
        </div>
    );
}
