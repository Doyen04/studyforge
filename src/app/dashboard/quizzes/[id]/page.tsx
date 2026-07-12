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
            <main className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full max-w-lg px-4">
                    <div className="h-8 w-48 rounded bg-rule mx-auto" />
                    <div className="h-32 rounded-lg bg-rule" />
                    <div className="h-10 rounded-md bg-rule w-32 mx-auto" />
                </div>
            </main>
        );
    }

    if (!quiz) return null;

    return <QuizRunner quizId={quiz.quizId} questions={quiz.questions} />;
}
