"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/QuizRunner";
import type { QuizPageData } from "@/types/page";

interface QuizPageProps {
    params: Promise<{ id: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
    const [quiz, setQuiz] = useState<QuizPageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        params.then(({ id }) => {
            fetch(`/api/quizzes/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (!data.quizId) {
                        notFound();
                        return;
                    }
                    setQuiz(data);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        });
    }, [params]);

    if (loading) {
        return (
            <main className="min-h-screen bg-paper">
                <div className="mx-auto max-w-2xl px-6 py-8 lg:py-10 animate-pulse space-y-6">
                    <div className="h-8 w-64 rounded bg-rule" />
                    <div className="h-48 rounded-md bg-rule" />
                </div>
            </main>
        );
    }

    if (!quiz) return null;

    return <QuizRunner quizId={quiz.quizId} questions={quiz.questions} quizTitle={quiz.title} />;
}
