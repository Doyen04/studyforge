"use client";

import { useEffect, useState } from "react";
import { StatsRow } from "@/components/StatsRow";
import { ContinueStudyingCard } from "@/components/ContinueStudyingCard";
import { RecentQuizList } from "@/components/RecentQuizList";
import { UploadTile } from "@/components/UploadTile";
import { StudySetCard } from "@/components/StudySetCard";
import type { DashboardStats, StudySetSummary, RecentAttempt } from "@/types/domain";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [studySets, setStudySets] = useState<StudySetSummary[]>([]);
    const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
            .then((res) => res.json())
            .then((data) => {
                setStats(data.stats);
                setStudySets(data.studySets);
                setRecentAttempts(data.recentAttempts);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const safeStats: DashboardStats = stats ?? { studySets: 0, questionsGenerated: 0, quizzesTaken: 0, averageScore: null };
    const studySetCount = stats?.studySets ?? studySets.length;
    const mostRecent = studySets[0] ?? null;

    if (loading) {
        return (
            <main className="min-h-screen bg-paper">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10 space-y-8 animate-pulse">
                    <div className="h-8 w-48 rounded bg-rule" />
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-xl bg-rule" />)}
                    </div>
                    <div className="h-24 rounded-xl bg-rule" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-xl bg-rule" />)}
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

                <StatsRow stats={safeStats} />

                {studySetCount === 0 ? (
                    <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                        <UploadTile />
                        <p className="text-sm text-ink-muted text-center">
                            Nothing here yet. Upload a slide deck, document, or PDF to turn it into flashcards and quizzes.
                        </p>
                    </section>
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
                                <h2 className="font-display text-xl font-semibold text-ink">Your study sets</h2>
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
        </main>
    );
}
