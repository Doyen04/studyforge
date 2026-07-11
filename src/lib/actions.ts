import { prisma } from "./db";
import { parseJsonArray } from "./deserialize";
import type { DashboardStats, StudySetSummary, RecentAttempt, QuizQuestion, GradedAnswer } from "./types";

export async function getDashboardStats(): Promise<DashboardStats> {
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
}

export async function getStudySetsWithScores(): Promise<StudySetSummary[]> {
    const rows = await prisma.studySet.findMany({
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
    });

    return rows.map((set) => {
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
        } satisfies StudySetSummary;
    });
}

export async function getRecentAttempts(): Promise<RecentAttempt[]> {
    return prisma.quizAttempt.findMany({
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
    }) as Promise<RecentAttempt[]>;
}

export async function getStudySetsIndex() {
    return prisma.studySet.findMany({
        include: { document: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getStudySetDetail(id: string) {
    const studySet = await prisma.studySet.findUnique({
        where: { id },
        include: {
            document: true,
            flashcards: true,
            mcqQuestions: true,
            fillInBlanks: true,
            theoryQuestions: true,
        },
    });

    if (!studySet) return null;

    await prisma.studySet.update({
        where: { id },
        data: { lastAccessedAt: new Date() },
    });

    return {
        id: studySet.id,
        title: studySet.title,
        createdAt: studySet.createdAt,
        document: {
            filename: studySet.document.filename,
            wordCount: studySet.document.wordCount,
        },
        flashcards: studySet.flashcards.map((f) => ({
            id: f.id,
            studySetId: f.studySetId,
            front: f.front,
            back: f.back,
        })),
        mcqQuestions: studySet.mcqQuestions.map((q) => ({
            id: q.id,
            studySetId: q.studySetId,
            question: q.question,
            options: parseJsonArray<string>(q.options),
            correctIndex: q.correctIndex,
            explanation: q.explanation,
        })),
        fillInBlanks: studySet.fillInBlanks.map((f) => ({
            id: f.id,
            studySetId: f.studySetId,
            sentence: f.sentence,
            answer: f.answer,
            acceptableAnswers: parseJsonArray<string>(f.acceptableAnswers),
        })),
        theoryQuestions: studySet.theoryQuestions.map((t) => ({
            id: t.id,
            studySetId: t.studySetId,
            question: t.question,
            referenceAnswer: t.referenceAnswer,
            keyPoints: parseJsonArray<string>(t.keyPoints),
        })),
    };
}

export async function getQuizzesIndex() {
    return prisma.quiz.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            studySet: { select: { title: true } },
            attempts: {
                where: { completedAt: { not: null } },
                orderBy: { completedAt: "desc" },
                take: 1,
                select: { score: true, completedAt: true },
            },
        },
    });
}

export async function getQuizWithQuestions(id: string) {
    const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: {
            studySet: {
                include: { mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
            },
        },
    });

    if (!quiz) return null;

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

    return { quizId: quiz.id, title: quiz.title, questions };
}

export async function getQuizResults(quizId: string, attemptId: string) {
    const [quiz, attempt] = await Promise.all([
        prisma.quiz.findUnique({
            where: { id: quizId },
            include: { studySet: { include: { mcqQuestions: true, fillInBlanks: true } } },
        }),
        prisma.quizAttempt.findUnique({ where: { id: attemptId }, include: { quiz: true } }),
    ]);

    if (!quiz || !attempt || attempt.quizId !== quiz.id) return null;

    const answers = parseJsonArray<GradedAnswer>(attempt.answers);

    return { quiz, attempt, answers };
}
