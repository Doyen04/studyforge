"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Question =
    | { type: "mcq"; id: string; question: string; options: string[] }
    | { type: "fillInBlank"; id: string; sentence: string }
    | { type: "theory"; id: string; question: string };

export function QuizRunner({ quizId, studySetId, studySetTitle, questions }: { quizId: string; studySetId: string; studySetTitle: string; questions: Question[] }) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const progress = useMemo(() => (questions.length === 0 ? 0 : ((currentIndex + 1) / questions.length) * 100), [currentIndex, questions.length]);

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

            router.push(`/quizzes/${quizId}/results/${json.attemptId}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!currentQuestion) {
        return null;
    }

    return (
        <main className="min-h-screen px-4 py-4 sm:px-6 md:py-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                <header className="flex items-center justify-between border-b border-rule pb-4">
                    <Link href={`/study-sets/${studySetId}`} className="text-sm font-semibold text-focus hover:text-focus-hover">
                        ← {studySetTitle}
                    </Link>
                    <span className="font-data text-sm text-ink-muted">{currentIndex + 1} / {questions.length}</span>
                </header>

                <section className="rounded-lg border border-rule bg-card p-6 md:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">Quiz</p>
                    <h1 className="mt-3 font-sans text-2xl font-semibold text-ink md:text-3xl">Active recall</h1>
                    <div className="mt-5 h-2 rounded-full bg-paper">
                        <div className="h-2 rounded-full bg-focus" style={{ width: `${progress}%` }} />
                    </div>
                </section>

                <section className="rounded-lg border border-rule bg-card p-6 md:p-8">
                    <div className="font-data text-sm text-ink-muted">Question {currentIndex + 1} / {questions.length}</div>
                    <h2 className="mt-3 text-xl font-semibold text-ink">
                        {currentQuestion.type === "mcq" ? currentQuestion.question : currentQuestion.type === "fillInBlank" ? currentQuestion.sentence : currentQuestion.question}
                    </h2>

                    {currentQuestion.type === "mcq" ? (
                        <div className="mt-4 space-y-2">
                            {currentQuestion.options.map((option, optionIndex) => (
                                <label key={`${currentQuestion.id}-${optionIndex}`} className="flex cursor-pointer items-center gap-3 rounded-md border border-rule bg-paper px-4 py-3 text-sm text-ink">
                                    <input
                                        type="radio"
                                        name={currentQuestion.id}
                                        checked={answers[currentQuestion.id] === String(optionIndex)}
                                        onChange={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: String(optionIndex) }))}
                                    />
                                    <span>{optionIndex + 1}. {option}</span>
                                </label>
                            ))}
                        </div>
                    ) : currentQuestion.type === "fillInBlank" ? (
                        <input
                            type="text"
                            value={answers[currentQuestion.id] ?? ""}
                            onChange={(event) => setAnswers((current) => ({ ...current, [currentQuestion.id]: event.target.value }))}
                            placeholder="Type your answer"
                            className="mt-4 block w-full rounded-md border border-rule bg-paper px-4 py-3 text-sm text-ink"
                        />
                    ) : (
                        <>
                            <textarea
                                rows={5}
                                value={answers[currentQuestion.id] ?? ""}
                                onChange={(event) => setAnswers((current) => ({ ...current, [currentQuestion.id]: event.target.value }))}
                                placeholder="Write 2–5 sentences"
                                className="mt-4 block w-full rounded-md border border-rule bg-paper px-4 py-3 text-sm text-ink"
                            />
                            <p className="mt-2 text-sm text-ink-muted">2–5 sentences recommended.</p>
                        </>
                    )}
                </section>

                <div className="sticky bottom-0 border-t border-rule bg-paper/95 px-4 py-4 backdrop-blur md:static md:border-t-0 md:bg-transparent md:px-0 md:py-0">
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
                        className="w-full rounded-md bg-focus px-4 py-3 text-sm font-semibold text-white transition hover:bg-focus-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting…" : isLastQuestion ? "Submit answers" : "Next question"}
                    </button>
                </div>
            </div>
        </main>
    );
}
