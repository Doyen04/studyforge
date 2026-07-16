"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { StatsRow } from "@/components/StatsRow";
import { ContinueStudyingCard } from "@/components/ContinueStudyingCard";
import { RecentQuizList } from "@/components/RecentQuizList";
import { UploadTile } from "@/components/UploadTile";
import { StudySetCard } from "@/components/StudySetCard";
import { IconPlus } from "@tabler/icons-react";
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

    if (isLoading) {
        return (
            <main className="min-h-screen bg-paper">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10 space-y-8 animate-pulse">
                    <div className="h-8 w-48 rounded bg-rule" />
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-md bg-rule" />)}
                    </div>
                    <div className="h-24 rounded-md bg-rule" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-md bg-rule" />)}
                    </div>
                </div>
            </main>
        );
    }

    if (studySetCount === 0) {
        return (
            <main className="min-h-screen bg-paper">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
                    <div className="flex flex-col items-center justify-center rounded-md border-[1.5px] border-dashed border-rule p-14 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-wine-tint text-accent mb-4">
                            <IconPlus size={20} stroke={2} />
                        </div>
                        <h3 className="font-display text-lg font-semibold text-ink">Upload your first document to get started</h3>
                        <p className="mt-1.5 text-sm text-ink-muted max-w-xs">PPTX, DOCX, or PDF — StudyForge will turn it into flashcards and quizzes.</p>
                        <div className="mt-5">
                            <UploadTile />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-paper">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10 space-y-8">
                <div>
                    <h1 className="font-display text-[32px] font-semibold text-ink tracking-tight">Dashboard</h1>
                    <p className="text-sm text-ink-muted mt-1">Overview of your study activity.</p>
                </div>

                <StatsRow stats={stats} />

                {data?.continueStudying && (
                    <ContinueStudyingCard
                        studySet={data.continueStudying}
                        itemCounts={data.continueStudying.itemCounts}
                        lastScore={data.continueStudying.lastScore}
                    />
                )}

                <section className="space-y-4">
                    <h2 className="font-display text-xl font-semibold text-ink">Your study sets</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <UploadTile />
                        {data?.recentStudySets?.map((set, i) => (
                            <StudySetCard key={set.id} set={set} index={i} />
                        ))}
                    </div>
                    {studySetCount > 4 && (
                        <div className="text-center">
                            <Link href="/dashboard/study-sets" className="text-sm font-semibold text-accent hover:text-accent-hover transition">
                                View all study sets →
                            </Link>
                        </div>
                    )}
                </section>

                {data?.recentAttempts && data.recentAttempts.length > 0 && <RecentQuizList attempts={data.recentAttempts} />}
            </div>
        </main>
    );
}
