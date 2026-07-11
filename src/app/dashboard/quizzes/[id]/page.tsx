import { notFound } from "next/navigation";
import { getQuizWithQuestions } from "@/lib/actions";
import { QuizRunner } from "@/components/QuizRunner";

interface QuizPageProps {
    params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
    const { id } = await params;
    const quiz = await getQuizWithQuestions(id);

    if (!quiz) {
        notFound();
    }

    return <QuizRunner quizId={quiz.quizId} questions={quiz.questions} />;
}
