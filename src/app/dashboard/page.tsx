import Link from "next/link";
import { prisma } from "@/lib/db";
import { UploadWorkflow } from "@/components/UploadWorkflow";
import { StatsRow } from "@/components/StatsRow";
import { ContinueStudyingCard } from "@/components/ContinueStudyingCard";
import { RecentQuizList } from "@/components/RecentQuizList";
import { UploadTile } from "@/components/UploadTile";

type DashboardStats = {
    studySets: number;
    questionsGenerated: number;
    quizzesTaken: number;
    averageScore: number | null;
};

type StudySetSummary = {
    id: string;
    title: string;
    filename: string;
    itemCounts: {
        flashcards: number;
        mcq: number;
        fillInBlank: number;
        theory: number;
    };
    lastScore: number | null;
};

type RecentAttempt = {
    id: string;
    score: number;
    completedAt: Date | null;
    quiz: {
        studySet: {
            title: string;
        };
    };
};

function ErrorBanner({ message }: { message: string }) {
    return <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{message}</div>;
}

function StudySetCard({ set }: { set: StudySetSummary }) {
    return (
        <Link
            href={`/dashboard/study-sets/${set.id}`}
            className="group flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-200"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="space-y-1.5 min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent/70">Study set</p>
                    <h3 className="text-[15px] font-semibold text-ink truncate group-hover:text-accent transition-colors">{set.title}</h3>
                </div>
                {set.lastScore !== null && (
                    <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            set.lastScore >= 70 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                    >
                        {set.lastScore}%
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-400 truncate mb-4">{set.filename}</p>
            <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 font-data text-xs text-gray-400">
                <span>{set.itemCounts.flashcards}c</span>
                <span>{set.itemCounts.mcq}m</span>
                <span>{set.itemCounts.fillInBlank}f</span>
                <span>{set.itemCounts.theory}t</span>
            </div>
        </Link>
    );
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
                                        {studySets.map((set) => (
                                            <StudySetCard key={set.id} set={set} />
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
