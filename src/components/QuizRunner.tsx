"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { QuizQuestion } from "@/types/domain";

export function QuizRunner({
    quizId,
    questions,
}: {
    quizId: string;
    questions: QuizQuestion[];
}) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;

    // Calculate progress as fraction of answered questions
    const progress = useMemo(() => {
        if (questions.length === 0) return 0;
        return ((currentIndex + 1) / questions.length) * 100;
    }, [currentIndex, questions.length]);

    // Track words dynamically for theory questions
    const currentAnswerText = answers[currentQuestion?.id] ?? "";
    const theoryWordCount = useMemo(() => {
        if (!currentAnswerText.trim()) return 0;
        return currentAnswerText.trim().split(/\s+/).length;
    }, [currentAnswerText]);

    // Auto-focus on inputs on question change
    useEffect(() => {
        const firstOption = document.querySelector<HTMLInputElement>('input[type="radio"]');
        if (firstOption) {
            firstOption.focus();
        } else {
            const textInput = document.querySelector<HTMLInputElement | HTMLTextAreaElement>('input[type="text"], textarea');
            textInput?.focus();
        }
    }, [currentIndex]);

    async function submitQuiz() {
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/quizzes/${quizId}/attempts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answers: questions.map((question) => ({
                        type: question.type,
                        id: question.id,
                        userAnswer: answers[question.id] ?? "",
                    })),
                }),
            });

            const json = (await response.json()) as { attemptId?: string; error?: string };
            if (!response.ok || !json.attemptId) {
                throw new Error(json.error || "Could not submit quiz.");
            }

            router.push(`/dashboard/quizzes/${quizId}/results/${json.attemptId}`);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Submission failed.");
            setIsSubmitting(false);
        }
    }

    if (!currentQuestion) {
        return (
            <div className="rounded-lg border border-rule bg-card p-6 text-center text-sm text-ink-muted">
                No questions found in this quiz.
            </div>
        );
    }

    return (
        <main className="min-h-screen px-4 py-4 sm:px-6 md:py-8 lg:px-8">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                {/* Progress Card */}
                <section className="rounded-lg border border-rule bg-card p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Taking Quiz</p>
                        <span className="font-data text-xs text-ink-muted">{currentIndex + 1} / {questions.length}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <h1 className="font-sans text-lg font-bold text-ink">Active Recall Practice</h1>
                        <span className="font-data text-xs text-ink-muted">{Math.round(progress)}% Completed</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-rule w-full">
                        <div
                            className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </section>

                {/* Question Area */}
                <section className="rounded-lg border border-rule bg-card p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-rule/50 pb-3">
                        <span className="font-data text-xs text-ink-muted">Question {currentIndex + 1} of {questions.length}</span>
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 font-sans text-xs font-semibold text-accent capitalize">
                            {currentQuestion.type === "mcq" ? "Multiple Choice" : currentQuestion.type === "fillInBlank" ? "Fill in the Blank" : "Theory Review"}
                        </span>
                    </div>

                    <h2 className="text-lg font-bold leading-8 text-ink">
                        {currentQuestion.type === "mcq"
                            ? currentQuestion.question
                            : currentQuestion.type === "fillInBlank"
                            ? currentQuestion.sentence
                            : currentQuestion.question}
                    </h2>

                    {/* Inputs */}
                    {currentQuestion.type === "mcq" && (
                        <div
                            role="radiogroup"
                            aria-label="Multiple choice options"
                            className="space-y-2"
                        >
                            {currentQuestion.options.map((option, idx) => {
                                const isChecked = answers[currentQuestion.id] === String(idx);
                                return (
                                    <label
                                        key={idx}
                                        className={`flex cursor-pointer items-center gap-3 rounded-md border p-3.5 text-sm transition-all focus-within:ring-2 focus-within:ring-accent ${
                                            isChecked
                                                ? "border-accent bg-accent/5 font-semibold text-ink"
                                                : "border-rule bg-card hover:bg-paper-hover text-ink"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={currentQuestion.id}
                                            checked={isChecked}
                                            onChange={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: String(idx) }))}
                                            className="h-4 w-4 accent-accent focus:outline-none"
                                        />
                                        <span>
                                            <span className="font-data mr-1.5 text-ink-muted">{idx + 1}.</span>
                                            {option}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    {currentQuestion.type === "fillInBlank" && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={answers[currentQuestion.id] ?? ""}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                                placeholder="Type answer here"
                                className="block w-full rounded-md border border-rule bg-card px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                            />
                        </div>
                    )}

                    {currentQuestion.type === "theory" && (
                        <div className="space-y-2">
                            <textarea
                                rows={5}
                                value={answers[currentQuestion.id] ?? ""}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                                placeholder="Write your explanation here (2–5 sentences recommended)..."
                                className="block w-full rounded-md border border-rule bg-card px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                            />
                            <div className="flex items-center justify-between text-xs text-ink-muted">
                                <span>{theoryWordCount} words</span>
                                <span>2–5 sentences recommended</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Sticky Action Footer */}
                <div className="sticky bottom-0 border-t border-rule bg-paper/95 px-4 py-4 backdrop-blur-xs flex justify-between gap-4 -mx-4 md:static md:border-t-0 md:bg-transparent md:px-0 md:py-0">
                    <button
                        type="button"
                        onClick={() => {
                            if (isLastQuestion) {
                                void submitQuiz();
                            } else {
                                setCurrentIndex((index) => index + 1);
                            }
                        }}
                        disabled={isSubmitting}
                        className="w-full cursor-pointer rounded-md bg-accent hover:bg-accent-hover px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting
                            ? "Submitting responses…"
                            : isLastQuestion
                            ? "Submit answers"
                            : "Next question"}
                    </button>
                </div>
            </div>
        </main>
    );
}
