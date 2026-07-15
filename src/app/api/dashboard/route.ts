import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    const [stats, continueStudying, recentStudySets, documentsWithoutStudySet, recentAttempts] = await Promise.all([
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
        prisma.studySet.findFirst({
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
        }),
        prisma.studySet.findMany({
            orderBy: { lastAccessedAt: "desc" },
            take: 3,
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
                        attempts: {
                            where: { completedAt: { not: null } },
                            orderBy: { completedAt: "desc" },
                            take: 1,
                            select: { score: true, completedAt: true },
                        },
                    },
                },
            },
        }),
        prisma.document.count({ where: { studySets: { none: {} } } }),
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

    const recentStudySetsMapped = recentStudySets.map((set) => {
        const lastAttempt = set.quizzes
            .flatMap((q) => q.attempts)
            .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0))[0] ?? null;
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
    });

    const continueStudyingMapped = continueStudying
        ? {
              id: continueStudying.id,
              title: continueStudying.title,
              filename: continueStudying.document.filename,
              itemCounts: {
                  flashcards: continueStudying._count.flashcards,
                  mcq: continueStudying._count.mcqQuestions,
                  fillInBlank: continueStudying._count.fillInBlanks,
                  theory: continueStudying._count.theoryQuestions,
              },
              lastScore: (() => {
                  const last = continueStudying.quizzes
                      .flatMap((q) => q.attempts)
                      .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0))[0] ?? null;
                  return last?.score ?? null;
              })(),
          }
        : null;

    return NextResponse.json({
        stats,
        continueStudying: continueStudyingMapped,
        recentStudySets: recentStudySetsMapped,
        documentsWithoutStudySet,
        recentAttempts,
    });
}
