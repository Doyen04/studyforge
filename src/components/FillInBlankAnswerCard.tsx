"use client";

interface FillInBlankAnswerCardProps {
    userAnswer: string;
    correctAnswer?: string;
    isCorrect?: boolean;
}

export function FillInBlankAnswerCard({ userAnswer, correctAnswer, isCorrect }: FillInBlankAnswerCardProps) {
    return (
        <div className="space-y-3">
            <div className="text-sm font-semibold">
                Your answer: <span className={isCorrect ? "text-mastered" : "text-error"}>{userAnswer || "(None)"}</span>
            </div>
            {!isCorrect && correctAnswer && (
                <div className="text-sm">
                    Expected answer: <span className="text-mastered font-semibold">{correctAnswer}</span>
                </div>
            )}
        </div>
    );
}
