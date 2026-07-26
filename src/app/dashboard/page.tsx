"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { StatsRow } from "@/components/StatsRow";
import { ContinueStudyingCard } from "@/components/ContinueStudyingCard";
import { RecentQuizList } from "@/components/RecentQuizList";
import { UploadTile } from "@/components/UploadTile";
import { StudySetCard } from "@/components/StudySetCard";
import { DashboardAnalyticsChart } from "@/components/DashboardAnalyticsChart";
import { IconPlus, IconSparkles, IconArrowUpRight, IconFileText } from "@tabler/icons-react";
import type { DashboardStats, StudySetSummary, RecentAttempt } from "@/types/domain";
import { queryKeys, fetchJson } from "@/lib/queries";

interface DashboardData {
    stats: DashboardStats & { documentsWithoutStudySet?: number };
    continueStudying: StudySetSummary | null;
    recentStudySets: StudySetSummary[];
    recentAttempts: RecentAttempt[];
}

export default function DashboardPage() {
    const { data, isLoading } = useQuery({
        queryKey: queryKeys.dashboard,
        queryFn: () => fetchJson<DashboardData>("/api/dashboard"),
    });

    const stats: DashboardStats = data?.stats
        ? { ...data.stats, documentsWithoutStudySet: data.stats.documentsWithoutStudySet ?? 0 }
        : { studySets: 0, questionsGenerated: 0, quizzesTaken: 0, averageScore: null };
    const studySetCount = data?.stats?.studySets ?? data?.recentStudySets?.length ?? 0;

    const formattedDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    if (isLoading) {
        return (
            <main>
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 py-8 lg:py-10 space-y-8 animate-pulse">
                    <div className="h-10 w-64 rounded-lg bg-rule" />
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-xl bg-rule" />)}
                    </div>
                    <div className="h-44 rounded-xl bg-rule" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-xl bg-rule" />)}
                    </div>
                </div>
            </main>
        );
    }

    if (studySetCount === 0) {
        return (
            <main>
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 py-8 lg:py-10">
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-rule bg-card p-12 md:p-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wine-tint text-accent mb-4 border border-accent/20">
                            <IconPlus size={22} stroke={2} />
                        </div>
                        <h3 className="font-display text-xl font-semibold text-ink">Upload your first document to launch your analytics</h3>
                        <p className="mt-2 text-sm text-ink-muted max-w-md">
                            Upload PPTX, DOCX, or PDF files. StudyForge turns them into AI-generated active recall flashcards, quizzes, and performance analytics.
                        </p>
                        <div className="mt-6 w-full max-w-sm">
                            <UploadTile />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-paper pb-16">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 py-8 lg:py-10 space-y-8">
                {/* Analytics Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-rule pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent font-data mb-1">
                            <IconSparkles size={14} /> Active Recall Learning Hub
                        </div>
                        <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">
                            Analytics Dashboard
                        </h1>
                        <p className="text-xs text-ink-muted mt-1 font-data">
                            {formattedDate} · Real-time mastery performance & document study sets
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/documents"
                            className="flex items-center gap-1.5 rounded-lg border border-rule bg-card px-4 py-2 text-xs font-semibold text-ink transition hover:bg-paper cursor-pointer font-data"
                        >
                            <IconFileText size={15} />
                            Documents
                        </Link>
                        <Link
                            href="/dashboard/quizzes"
                            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-hover cursor-pointer font-data"
                        >
                            Practice Quizzes
                            <IconArrowUpRight size={15} />
                        </Link>
                    </div>
                </div>

                {/* Key Metrics Row */}
                <StatsRow stats={stats} />

                {/* Performance & Mastery Analytics Charts */}
                <DashboardAnalyticsChart
                    stats={stats}
                    recentAttempts={data?.recentAttempts ?? []}
                    studySetCount={studySetCount}
                />

                {/* Active Study Set */}
                {data?.continueStudying && (
                    <div className="space-y-3">
                        <h2 className="font-display text-lg font-semibold text-ink">Current Active Study Set</h2>
                        <ContinueStudyingCard
                            studySet={data.continueStudying}
                            itemCounts={data.continueStudying.itemCounts}
                            lastScore={data.continueStudying.lastScore}
                        />
                    </div>
                )}

                {/* Study Sets Grid */}
                <section className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-xl font-semibold text-ink">Recent Study Sets</h2>
                            <p className="text-xs text-ink-muted">Access your document flashcards and practice sets</p>
                        </div>
                        {studySetCount > 4 && (
                            <Link href="/dashboard/study-sets" className="text-xs font-semibold text-accent hover:text-accent-hover transition font-data">
                                View all {studySetCount} sets →
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <UploadTile />
                        {data?.recentStudySets?.map((set, i) => (
                            <StudySetCard key={set.id} set={set} index={i} />
                        ))}
                    </div>
                </section>

                {/* Recent Quiz Attempts Feed */}
                {data?.recentAttempts && data.recentAttempts.length > 0 && (
                    <section className="pt-2">
                        <RecentQuizList attempts={data.recentAttempts} />
                    </section>
                )}
            </div>
        </main>
    );
}

