"use client";

import { IconChartBar, IconSparkles } from "@tabler/icons-react";
import type { DashboardStats, RecentAttempt } from "@/types/domain";

interface AnalyticsProps {
    stats: DashboardStats;
    recentAttempts: RecentAttempt[];
    studySetCount: number;
}

export function DashboardAnalyticsChart({ stats, recentAttempts, studySetCount }: AnalyticsProps) {
    const masteredAttempts = recentAttempts.filter((a) => a.score >= 70).length;
    const reviewAttempts = recentAttempts.length - masteredAttempts;

    const masteryPercentage = recentAttempts.length > 0
        ? Math.round((masteredAttempts / recentAttempts.length) * 100)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Mastery Breakdown Card */}
            <div className="relative group md:col-span-2">
                <div className="absolute top-2 left-2 right-0 bottom-0 rounded-xl border border-rule bg-surface-2 z-0 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                <div className="relative z-10 h-full rounded-xl border border-rule bg-card p-6 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                    <div className="flex items-center justify-between border-b border-rule pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-wine-tint text-accent border border-accent/20">
                                <IconChartBar size={18} stroke={2} />
                            </div>
                            <div>
                                <h3 className="font-display text-base font-semibold text-ink">Mastery & Performance Analytics</h3>
                                <p className="text-xs text-ink-muted">Active recall retention metrics</p>
                            </div>
                        </div>
                        <span className="font-data text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-2 border border-rule text-ink-muted">
                            {recentAttempts.length} Quizzes Tracked
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                        {/* Overall Mastery Meter */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs text-ink-muted font-medium">
                                <span>Overall Retention Mastery</span>
                                <span className="font-data font-semibold text-ink">{masteryPercentage}%</span>
                            </div>

                            {/* Multi-segment Mastery Progress Bar */}
                            <div className="h-3.5 w-full rounded-full bg-surface-2 overflow-hidden flex border border-rule/60">
                                {recentAttempts.length > 0 ? (
                                    <>
                                        <div
                                            style={{ width: `${masteryPercentage}%` }}
                                            className="bg-mastered h-full transition-all duration-500"
                                            title={`Mastered: ${masteredAttempts}`}
                                        />
                                        <div
                                            style={{ width: `${100 - masteryPercentage}%` }}
                                            className="bg-review h-full transition-all duration-500"
                                            title={`Needs Review: ${reviewAttempts}`}
                                        />
                                    </>
                                ) : (
                                    <div className="w-full bg-surface-2" />
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1">
                                <div className="flex items-center gap-1.5 text-mastered font-semibold font-data">
                                    <span className="h-2.5 w-2.5 rounded-full bg-mastered" />
                                    <span>Mastered ≥70% ({masteredAttempts})</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-review font-semibold font-data">
                                    <span className="h-2.5 w-2.5 rounded-full bg-review" />
                                    <span>Needs Review ({reviewAttempts})</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Scores Bar Visualizer */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted font-data mb-1">
                                Recent Quiz Scores
                            </p>
                            {recentAttempts.length === 0 ? (
                                <p className="text-xs text-ink-muted italic bg-surface-2 p-3 rounded-lg border border-rule">
                                    No quiz attempts recorded yet.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {recentAttempts.slice(0, 4).map((attempt, idx) => (
                                        <div key={attempt.id || idx} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-ink font-medium truncate max-w-[150px]">
                                                    {attempt.quiz.studySet.title}
                                                </span>
                                                <span className={`font-data font-semibold ${attempt.score >= 70 ? "text-mastered" : "text-review"}`}>
                                                    {attempt.score}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${attempt.score >= 70 ? "bg-mastered" : "bg-review"}`}
                                                    style={{ width: `${attempt.score}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Analytics Summary Card */}
            <div className="relative group">
                <div className="absolute top-2 left-2 right-0 bottom-0 rounded-xl border border-rule bg-surface-2 z-0 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                <div className="relative z-10 h-full rounded-xl border border-rule bg-card p-6 flex flex-col justify-between transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                    <div>
                        <div className="flex items-center gap-2 border-b border-rule pb-3">
                            <IconSparkles size={16} className="text-accent" />
                            <h3 className="font-display text-base font-semibold text-ink">Study Forge Insights</h3>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-ink-muted">Study Sets Created</span>
                                <span className="font-data font-semibold text-ink text-base">{studySetCount}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-ink-muted">Questions Generated</span>
                                <span className="font-data font-semibold text-ink text-base">
                                    {stats.questionsGenerated >= 1000 ? `${(stats.questionsGenerated / 1000).toFixed(1)}k` : stats.questionsGenerated}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-ink-muted">Quizzes Taken</span>
                                <span className="font-data font-semibold text-ink text-base">{stats.quizzesTaken}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-ink-muted">Avg Performance</span>
                                <span className="font-data font-semibold text-accent text-base">
                                    {stats.averageScore !== null ? `${stats.averageScore}%` : "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-rule flex items-center justify-between text-xs text-ink-muted">
                        <span>Engine Status</span>
                        <span className="font-data text-accent font-semibold flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-mastered" /> Online
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
