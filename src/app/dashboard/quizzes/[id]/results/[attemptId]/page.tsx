"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { IconArrowLeft, IconRotate, IconCheck, IconX } from "@tabler/icons-react";
import { parseJsonArray } from "@/lib/deserialize";
import { McqAnswerCard } from "@/components/McqAnswerCard";
import { FillInBlankAnswerCard } from "@/components/FillInBlankAnswerCard";
import { TheoryAnswerCard } from "@/components/TheoryAnswerCard";
import type { QuizResultData } from "@/types/page";
import type { GradedAnswer } from "@/types/domain";
import { queryKeys, fetchJson } from "@/lib/queries";

export default function QuizResultsPage({ params }: { params: Promise<{ id: string; attemptId: string }> }) {
    const { id, attemptId } = use(params);

    const { data, isLoading } = useQuery({
        queryKey: queryKeys.quizResults(id, attemptId),
        queryFn: () => fetchJson<QuizResultData>(`/api/quizzes/${id}/results/${attemptId}`),
    });

    if (isLoading) {
        return (
            <main className="min-h-screen bg-paper">
                <div className="mx-auto max-w-3xl px-6 py-8 lg:py-10 space-y-6 animate-pulse">
                    <div className="h-48 rounded-md bg-rule" />
                    {[1, 2].map((i) => <div key={i} className="h-64 rounded-md bg-rule" />)}
                </div>
            </main>
        );
    }

    if (!data) {
        return (
            <main className="min-h-screen bg-paper">
                <div className="mx-auto max-w-3xl px-6 py-8 lg:py-10 text-center">
                    <p className="text-sm text-ink-muted">Results not found.</p>
                </div>
            </main>
        );
    }

    const { quiz, attempt, answers } = data;
    const passed = attempt.score >= 70;

    return (
        <main className="min-h-screen bg-paper">
            <div className="mx-auto max-w-3xl px-6 py-8 lg:py-10 space-y-8">
                {/* Back link */}
                <Link
                    href={`/dashboard/quizzes/${quiz.id}`}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-muted hover:text-ink transition"
                >
                    <IconArrowLeft size={14} stroke={2} />
                    Back to quiz
                </Link>

                {/* Score hero */}
                <div className="rounded-md border border-rule bg-card p-8 text-center space-y-4  ">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-accent">Quiz Results</p>
                    <h1 className="font-display text-[23px] font-semibold text-ink">{quiz.title}</h1>
                    <div className="flex items-center justify-center gap-4">
                        <span className={`font-data text-[56px] font-semibold leading-none ${passed ? "text-mastered" : "text-review"}`}>
                            {attempt.score}%
                        </span>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${passed ? "bg-green-tint text-mastered" : "bg-amber-tint text-review"}`}>
                            {passed ? <IconCheck size={20} stroke={2.5} /> : <IconX size={20} stroke={2.5} />}
                        </div>
                    </div>
                    <p className="text-xs text-ink-muted">
                        {answers.length} question{answers.length !== 1 ? "s" : ""} · Completed on{" "}
                        {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : "recently"}
                    </p>
                    <Link
                        href={`/dashboard/quizzes/${quiz.id}/take`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-card px-4 py-2 text-sm font-semibold text-ink transition hover:bg-paper"
                    >
                        <IconRotate size={14} stroke={2} />
                        Retake quiz
                    </Link>
                </div>

                {/* Answers list */}
                <div className="space-y-4">
                    {answers.map((answer: GradedAnswer, index: number) => {
                        const isTheory = answer.type === "theory";
                        const isCorrect = answer.isCorrect;

                        let mcqOptions: string[] = [];
                        let fillInBlankText = "";
                        let theoryQuestionText = "";

                        if (answer.type === "mcq") {
                            const found = quiz.studySet.mcqQuestions.find((q) => q.id === answer.id);
                            if (found) {
                                mcqOptions = parseJsonArray<string>(found.options);
                            }
                        } else if (answer.type === "fillInBlank") {
                            const found = quiz.studySet.fillInBlanks.find((q) => q.id === answer.id);
                            if (found) fillInBlankText = found.sentence;
                        } else if (answer.type === "theory") {
                            const found = quiz.studySet.theoryQuestions.find((q) => q.id === answer.id);
                            if (found) theoryQuestionText = found.question;
                        }

                        const questionText =
                            answer.type === "mcq"
                                ? quiz.studySet.mcqQuestions.find((q) => q.id === answer.id)?.question
                                : answer.type === "fillInBlank"
                                    ? fillInBlankText
                                    : theoryQuestionText;

                        return (
                            <div key={answer.id} className="rounded-md border border-rule bg-card p-5 md:p-6 space-y-4 shadow-[0_1px_2px_rgba(32,28,26,.05),0_8px_20px_-10px_rgba(32,28,26,.14)] dark:shadow-[0_1px_2px_rgba(0,0,0,.3),0_8px_20px_-10px_rgba(0,0,0,.5)]">
                                <div className="flex items-center justify-between border-b border-rule pb-2">
                                    <span className="font-data text-xs text-ink-muted">Question {index + 1}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-semibold text-ink-muted uppercase tracking-[0.07em]">
                                            {answer.type}
                                        </span>
                                        {!isTheory && (
                                            <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                isCorrect ? "bg-green-tint text-mastered" : "bg-red-tint text-error"
                                            }`}>
                                                {isCorrect ? <IconCheck size={11} stroke={3} /> : <IconX size={11} stroke={3} />}
                                                {isCorrect ? "Correct" : "Incorrect"}
                                            </span>
                                        )}
                                        {isTheory && (
                                            <span className="font-data text-xs font-semibold text-ink">{answer.score}% matched</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="font-display text-[17px] font-semibold text-ink leading-7">
                                        {questionText || "Theory Question"}
                                    </h2>

                                    {answer.type === "mcq" && (
                                        <McqAnswerCard
                                            options={mcqOptions}
                                            userAnswer={answer.userAnswer}
                                            correctIndex={answer.correctIndex}
                                            explanation={answer.explanation}
                                        />
                                    )}

                                    {answer.type === "fillInBlank" && (
                                        <FillInBlankAnswerCard
                                            userAnswer={answer.userAnswer}
                                            correctAnswer={answer.correctAnswer}
                                            isCorrect={isCorrect}
                                        />
                                    )}

                                    {isTheory && (
                                        <TheoryAnswerCard
                                            userAnswer={answer.userAnswer}
                                            score={answer.score}
                                            feedback={answer.feedback}
                                            matchedKeyPoints={answer.matchedKeyPoints}
                                            missedKeyPoints={answer.missedKeyPoints}
                                            correctAnswer={answer.correctAnswer}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
