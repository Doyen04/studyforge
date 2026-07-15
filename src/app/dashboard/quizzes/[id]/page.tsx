"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { QuizRunner } from "@/components/QuizRunner";
import type { QuizPageData } from "@/types/page";

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [quiz, setQuiz] = useState<QuizPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState(false);

    useEffect(() => {
        fetch(`/api/quizzes/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.quizId) { setNotFoundError(true); return; }
                setQuiz(data);
            })
            .catch(() => { toast.error("Failed to load quiz."); })
            .finally(() => setLoading(false));
    }, [id]);

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

    if (notFoundError || !quiz) {
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
