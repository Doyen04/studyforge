import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { gradeTheoryAnswer } from "@/lib/prompts/gradeTheoryAnswer";

interface SubmittedAnswer {
    type: "mcq" | "fillInBlank" | "theory";
    id: string;
    userAnswer: string;
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: quizId } = await params;
    const { answers } = (await request.json()) as { answers: SubmittedAnswer[] };

    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { studySet: { include: { mcqQuestions: true, fillInBlanks: true, theoryQuestions: true } } },
    });

    if (!quiz) {
        return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    const graded = await Promise.all(
        answers.map(async (answer) => {
            if (answer.type === "mcq") {
                const question = quiz.studySet.mcqQuestions.find((item) => item.id === answer.id)!;
                const isCorrect = Number(answer.userAnswer) === question.correctIndex;
                return {
                    ...answer,
                    isCorrect,
                    correctIndex: question.correctIndex,
                    explanation: question.explanation,
                    score: isCorrect ? 100 : 0,
                };
            }

            if (answer.type === "fillInBlank") {
                const question = quiz.studySet.fillInBlanks.find((item) => item.id === answer.id)!;
                const acceptable = [question.answer, ...JSON.parse(question.acceptableAnswers)].map((value: string) => value.trim().toLowerCase());
                const isCorrect = acceptable.includes(answer.userAnswer.trim().toLowerCase());
                return {
                    ...answer,
                    isCorrect,
                    correctAnswer: question.answer,
                    score: isCorrect ? 100 : 0,
                };
            }

            const question = quiz.studySet.theoryQuestions.find((item) => item.id === answer.id)!;
            const keyPoints = JSON.parse(question.keyPoints) as string[];
            const result = await gradeTheoryAnswer(question.question, question.referenceAnswer, keyPoints, answer.userAnswer);
            return {
                ...answer,
                ...result,
                correctAnswer: question.referenceAnswer,
            };
        })
    );

    const overallScore = graded.length > 0 ? Math.round(graded.reduce((sum, item) => sum + item.score, 0) / graded.length) : 0;

    const attempt = await prisma.quizAttempt.create({
        data: { quizId, score: overallScore, answers: JSON.stringify(graded), completedAt: new Date() },
    });

    return NextResponse.json({ attemptId: attempt.id, score: overallScore, answers: graded });
}
