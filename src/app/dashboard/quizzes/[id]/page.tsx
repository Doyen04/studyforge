import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";
import { QuizRunner } from "@/components/QuizRunner";
import type { QuizQuestion } from "@/lib/types";

interface QuizPageProps {
    params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
    const { id } = await params;

    const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: {
            studySet: {
                include: { mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
            },
        },
    });

    if (!quiz) {
        notFound();
    }

    const refs = parseJsonArray<{ type: QuizQuestion["type"]; id: string }>(quiz.questionRefs);
    const questions: QuizQuestion[] = refs
        .map((ref) => {
            if (ref.type === "mcq") {
                const question = quiz.studySet.mcqQuestions.find((item) => item.id === ref.id);
                if (!question) return null;
                return {
                    type: "mcq" as const,
                    id: question.id,
                    question: question.question,
                    options: parseJsonArray<string>(question.options),
                };
            }

            if (ref.type === "fillInBlank") {
                const question = quiz.studySet.fillInBlanks.find((item) => item.id === ref.id);
                if (!question) return null;
                return {
                    type: "fillInBlank" as const,
                    id: question.id,
                    sentence: question.sentence,
                };
            }

            const question = quiz.studySet.theoryQuestions.find((item) => item.id === ref.id);
            if (!question) return null;
            return {
                type: "theory" as const,
                id: question.id,
                question: question.question,
            };
        })
        .filter((question): question is NonNullable<typeof question> => question !== null);

    return <QuizRunner quizId={quiz.id} questions={questions} />;
}
