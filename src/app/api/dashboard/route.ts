import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    const [stats, studySets, recentAttempts] = await Promise.all([
        (async () => {
            const [studySetCount, flashcardCount, mcqCount, fillInBlankCount, theoryCount, attemptAgg] = await Promise.all([
                prisma.studySet.count(),
                prisma.flashcard.count(),
                prisma.mcqQuestion.count(),
                prisma.fillInBlank.count(),
                prisma.theoryQuestion.count(),
                prisma.quizAttempt.aggregate({
                    where: { completedAt: { not: null } },
                    _count: { _all: true },
                    _avg: { score: true },
                }),
            ]);

            return {
                studySets: studySetCount,
                questionsGenerated: flashcardCount + mcqCount + fillInBlankCount + theoryCount,
                quizzesTaken: attemptAgg._count._all,
                averageScore: attemptAgg._avg.score !== null ? Math.round(attemptAgg._avg.score) : null,
            };
        })(),
        prisma.studySet.findMany({
            orderBy: { lastAccessedAt: "desc" },
            select: {
                id: true,
                title: true,
                document: { select: { filename: true } },
                _count: {
                    select: {
                        flashcards: true,
                        mcqQuestions: true,
                        fillInBlanks: true,
                        theoryQuestions: true,
                    },
                },
                quizzes: {
                    select: {
                        id: true,
                        attempts: {
                            where: { completedAt: { not: null } },
                            orderBy: { completedAt: "desc" },
                            take: 1,
                            select: { id: true, score: true, completedAt: true, quizId: true },
                        },
                    },
                },
            },
        }).then((rows) =>
            rows.map((set) => {
                const lastAttempt = set.quizzes
                    .flatMap((quiz) => quiz.attempts)
                    .sort((left, right) => (right.completedAt?.getTime() ?? 0) - (left.completedAt?.getTime() ?? 0))[0] ?? null;

                return {
                    id: set.id,
                    title: set.title,
                    filename: set.document.filename,
                    itemCounts: {
                        flashcards: set._count.flashcards,
                        mcq: set._count.mcqQuestions,
                        fillInBlank: set._count.fillInBlanks,
                        theory: set._count.theoryQuestions,
                    },
                    lastScore: lastAttempt?.score ?? null,
                };
            })
        ),
        prisma.quizAttempt.findMany({
            where: { completedAt: { not: null } },
            orderBy: { completedAt: "desc" },
            take: 5,
            select: {
                id: true,
                score: true,
                completedAt: true,
                quiz: {
                    select: {
                        studySet: { select: { title: true } },
                    },
                },
            },
        }),
    ]);

    return NextResponse.json({ stats, studySets, recentAttempts });
}
