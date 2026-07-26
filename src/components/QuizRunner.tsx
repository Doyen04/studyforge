"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react";
import { fetchJson } from "@/lib/queries";
import type { QuizQuestion } from "@/types/domain";

export function QuizRunner({
    quizId,
    questions,
    quizTitle,
}: {
    quizId: string;
    questions: QuizQuestion[];
    quizTitle?: string;
}) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const submitMutation = useMutation({
        mutationFn: () =>
            fetchJson<{ attemptId: string }>(`/api/quizzes/${quizId}/attempts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answers: questions.map((question) => ({
                        type: question.type,
                        id: question.id,
                        userAnswer: answers[question.id] ?? "",
                    })),
                }),
            }),
        onSuccess: (data) => {
            router.push(`/dashboard/quizzes/${quizId}/results/${data.attemptId}`);
        },
    });

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const answeredCount = Object.keys(answers).length;

    const progress = useMemo(() => {
        if (questions.length === 0) return 0;
        return (answeredCount / questions.length) * 100;
    }, [answeredCount, questions.length]);

    const currentAnswerText = answers[currentQuestion?.id] ?? "";
    const theoryWordCount = useMemo(() => {
        if (!currentAnswerText.trim()) return 0;
        return currentAnswerText.trim().split(/\s+/).length;
    }, [currentAnswerText]);

    useEffect(() => {
        const firstOption = document.querySelector<HTMLInputElement>('input[type="radio"]');
        if (firstOption) firstOption.focus();
        else {
            const textInput = document.querySelector<HTMLInputElement | HTMLTextAreaElement>('input[type="text"], textarea');
            textInput?.focus();
        }
    }, [currentIndex]);

    const goNext = useCallback(() => {
        if (!isLastQuestion) setCurrentIndex((i) => i + 1);
    }, [isLastQuestion]);

    function submitQuiz() {
        const unansweredCount = questions.length - answeredCount;
        if (unansweredCount > 0) {
            const proceed = window.confirm(
                `You have ${unansweredCount} unanswered question${unansweredCount !== 1 ? "s" : ""}. Unanswered questions will be marked as incorrect.\n\nSubmit anyway?`
            );
            if (!proceed) return;
        }
        submitMutation.mutate();
    }

    // Keyboard shortcut handler for quiz choices and navigation
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const activeEl = document.activeElement;
            const isInput = activeEl && ["INPUT", "TEXTAREA"].includes(activeEl.tagName);

            if (currentQuestion?.type === "mcq" && !isInput) {
                const keyNum = parseInt(e.key, 10);
                if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= currentQuestion.options.length) {
                    e.preventDefault();
                    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: String(keyNum - 1) }));
                }
            }

            if (e.key === "Enter" && (e.metaKey || e.ctrlKey || (!isInput && currentQuestion?.type === "mcq"))) {
                e.preventDefault();
                if (isLastQuestion) {
                    submitQuiz();
                } else {
                    goNext();
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentQuestion, isLastQuestion, goNext]);

    if (!currentQuestion) {
        return (
            <div className="rounded-md border border-rule bg-card p-6 text-center text-sm text-ink-muted">
                No questions found in this quiz.
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-paper pb-16">
            <div className="mx-auto max-w-2xl px-6 py-8 lg:py-10 space-y-6">
                {/* Progress card */}
                <div className="rounded-xl border border-rule bg-card p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent font-data">
                            {quizTitle || "Active Recall Practice"}
                        </p>
                        <span className="font-data text-xs text-ink-muted font-semibold">
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <h1 className="font-display text-xl font-semibold text-ink">Quiz Runner</h1>
                        <span className="font-data text-xs text-ink-muted bg-surface-2 border border-rule px-2.5 py-1 rounded-full font-medium">
                            {answeredCount} / {questions.length} completed
                        </span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-rule w-full">
                        <div
                            className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question area */}
                <div className="rounded-xl border border-rule bg-card p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-rule pb-4">
                        <span className="font-data text-xs font-semibold uppercase text-ink-muted tracking-wider">
                            Q{currentIndex + 1}
                        </span>
                        <span className="rounded-full bg-wine-tint px-3 py-1 text-[11.5px] font-semibold text-accent capitalize border border-accent/20">
                            {currentQuestion.type === "mcq" ? "Multiple choice" : currentQuestion.type === "fillInBlank" ? "Fill in the blank" : "Theory"}
                        </span>
                    </div>

                    <h2 className="font-display text-xl md:text-2xl font-semibold leading-relaxed tracking-tight text-ink">
                        {currentQuestion.type === "mcq"
                            ? currentQuestion.question
                            : currentQuestion.type === "fillInBlank"
                                ? currentQuestion.sentence
                                : currentQuestion.question}
                    </h2>

                    {currentQuestion.type === "mcq" && (
                        <div role="radiogroup" aria-label="Multiple choice options" className="space-y-2.5">
                            {currentQuestion.options.map((option, idx) => {
                                const isChecked = answers[currentQuestion.id] === String(idx);
                                return (
                                    <label
                                        key={idx}
                                        className={`group flex cursor-pointer items-center gap-3.5 rounded-lg border p-4 text-sm transition-all ${
                                            isChecked
                                                ? "border-accent bg-wine-tint font-medium text-ink ring-1 ring-accent"
                                                : "border-rule bg-card hover:border-accent/40 hover:bg-paper text-ink"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={currentQuestion.id}
                                            checked={isChecked}
                                            onChange={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: String(idx) }))}
                                            className="h-4 w-4 accent-accent"
                                        />
                                        <span className={`font-data px-2 py-0.5 rounded text-xs font-semibold transition ${
                                            isChecked ? "bg-accent text-white" : "bg-surface-2 border border-rule text-ink-muted"
                                        }`}>
                                            {idx + 1}
                                        </span>
                                        <span className="leading-snug">{option}</span>
                                    </label>
                                );
                            })}
                            <p className="pt-1 text-[11px] text-ink-muted text-right font-data">
                                Press numbers <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-rule">1-{currentQuestion.options.length}</kbd> to select
                            </p>
                        </div>
                    )}

                    {currentQuestion.type === "fillInBlank" && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={answers[currentQuestion.id] ?? ""}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                                placeholder="Type your answer here..."
                                className="block w-full rounded-lg border border-rule bg-card px-4 py-3.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                            />
                        </div>
                    )}

                    {currentQuestion.type === "theory" && (
                        <div className="space-y-2">
                            <textarea
                                rows={5}
                                value={answers[currentQuestion.id] ?? ""}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                                placeholder="Write your explanation here (2 – 5 sentences recommended)..."
                                className="block w-full rounded-lg border border-rule bg-card px-4 py-3.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                            />
                            <div className="flex items-center justify-between text-xs text-ink-muted font-data">
                                <span>{theoryWordCount} words</span>
                                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-rule text-ink">Ctrl + Enter</kbd> to proceed</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action footer */}
                <div className="flex justify-between gap-4 pt-2">
                    {currentIndex > 0 && (
                        <button
                            type="button"
                            onClick={() => setCurrentIndex((i) => i - 1)}
                            className="flex items-center gap-1.5 rounded-lg border border-rule bg-card px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper cursor-pointer"
                        >
                            <IconArrowLeft size={16} stroke={2} />
                            Previous
                        </button>
                    )}
                    <div className="flex-1" />
                    <button
                        type="button"
                        onClick={() => {
                            if (isLastQuestion) void submitQuiz();
                            else goNext();
                        }}
                        disabled={submitMutation.isPending}
                        className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
                    >
                        {submitMutation.isPending ? (
                            "Submitting..."
                        ) : isLastQuestion ? (
                            <>
                                <IconCheck size={16} stroke={2.5} />
                                Submit Quiz
                            </>
                        ) : (
                            <>
                                Next
                                <IconArrowRight size={16} stroke={2.5} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}
