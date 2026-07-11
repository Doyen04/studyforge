import Link from "next/link";
import { prisma } from "@/lib/db";
import { UploadWorkflow } from "@/components/UploadWorkflow";
import { StatsRow } from "@/components/StatsRow";
import { ContinueStudyingCard } from "@/components/ContinueStudyingCard";
import { RecentQuizList } from "@/components/RecentQuizList";
import { UploadTile } from "@/components/UploadTile";
import { StudySetCard } from "@/components/StudySetCard";
import type { DashboardStats, StudySetSummary, RecentAttempt } from "@/lib/types";

function ErrorBanner({ message }: { message: string }) {
    return <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{message}</div>;
}

export default async function DashboardPage() {
    const [statsResult, studySetResult, attemptsResult] = await Promise.allSettled([
        (async (): Promise<DashboardStats> => {
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
                            select: {
                                id: true,
                                score: true,
                                completedAt: true,
                                quizId: true,
                            },
                        },
                    },
                },
            },
        }).then((studySetRows) =>
            studySetRows.map((set) => {
                const lastAttempt = set.quizzes.flatMap((quiz) => quiz.attempts).sort((left, right) => (right.completedAt?.getTime() ?? 0) - (left.completedAt?.getTime() ?? 0))[0] ?? null;

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
                        studySet: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
        }) as Promise<RecentAttempt[]>,
    ]);

    const stats = statsResult.status === "fulfilled" ? statsResult.value : null;
    const studySets = studySetResult.status === "fulfilled" ? studySetResult.value : [];
    const recentAttempts = attemptsResult.status === "fulfilled" ? attemptsResult.value : [];
    const studySetCount = stats?.studySets ?? studySets.length;

    const mostRecent = studySets[0] ?? null;

    return (
        <main className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
                {stats === null && <ErrorBanner message="Couldn't load your stats right now." />}

                {studySetCount === 0 ? (
                    <section className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
                        <UploadWorkflow />
                        <p className="text-sm text-gray-400 text-center">
                            Nothing here yet. Upload a slide deck, document, or PDF to turn it into flashcards and quizzes.
                        </p>
                    </section>
                ) : (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-2xl font-semibold text-ink tracking-tight">Dashboard</h1>
                            <p className="text-sm text-gray-400 mt-1">Overview of your study activity.</p>
                        </div>

                        {stats && <StatsRow stats={stats} />}

                        {studySets.length === 0 ? (
                            <ErrorBanner message="Couldn't load your study sets right now." />
                        ) : (
                            <>
                                {mostRecent && (
                                    <ContinueStudyingCard
                                        studySet={mostRecent}
                                        itemCounts={mostRecent.itemCounts}
                                        lastScore={mostRecent.lastScore}
                                    />
                                )}

                                <section className="space-y-4">
                                    <div className="flex items-baseline justify-between">
                                        <h2 className="text-base font-semibold text-ink">Your study sets</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <UploadTile />
                                        {studySets.map((set, i) => (
                                            <StudySetCard key={set.id} set={set} index={i} />
                                        ))}
                                    </div>
                                </section>

                                {recentAttempts.length > 0 && <RecentQuizList attempts={recentAttempts} />}
                            </>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
