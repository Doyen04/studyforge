"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { QuizRunner } from "@/components/QuizRunner";
import type { QuizPageData } from "@/types/page";
import { queryKeys, fetchJson } from "@/lib/queries";

export default function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { data: quiz, isLoading } = useQuery({
        queryKey: queryKeys.quiz(id),
        queryFn: () => fetchJson<QuizPageData>(`/api/quizzes/${id}`),
    });

    if (isLoading) {
        return (
            <main className="min-h-screen bg-paper">
                <div className="mx-auto max-w-2xl px-6 py-8 lg:py-10 animate-pulse space-y-6">
                    <div className="h-8 w-64 rounded bg-rule" />
                    <div className="h-48 rounded-md bg-rule" />
                </div>
            </main>
        );
    }

    if (!quiz) {
        return (
            <main className="min-h-screen bg-paper">
                <div className="mx-auto max-w-2xl px-6 py-8 lg:py-10 text-center">
                    <p className="text-sm text-ink-muted">Quiz not found.</p>
                </div>
            </main>
        );
    }

    return <QuizRunner quizId={quiz.quizId} questions={quiz.questions} quizTitle={quiz.title} />;
}
