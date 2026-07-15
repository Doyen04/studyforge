"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { ConfirmModal } from "@/components/ConfirmModal";
import type { QuizIndexItem } from "@/types/page";

interface QuizWithMeta extends QuizIndexItem {
    totalQuestions?: number;
}

export default function QuizzesIndex() {
    const [quizzes, setQuizzes] = useState<QuizWithMeta[]>([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/quizzes?search=${encodeURIComponent(debouncedSearch)}`)
            .then((res) => res.json())
            .then((data) => setQuizzes(data.quizzes))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [debouncedSearch]);

    const handleDelete = async (id: string) => {
        setConfirmDeleteId(null);
        setDeleting(id);
        try {
            const res = await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setQuizzes((prev) => prev.filter((q) => q.id !== id));
            toast.success("Quiz deleted");
        } catch {
            toast.error("Failed to delete quiz");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <main className="min-h-screen bg-paper">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-[32px] font-semibold text-ink tracking-tight">Quizzes</h1>
                        <p className="text-sm text-ink-muted mt-1">Your generated quizzes and past results.</p>
                    </div>
                    <div className="relative sm:mt-1.5">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search quizzes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 rounded-md border border-rule bg-card py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
                        {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-md bg-rule" />)}
                    </div>
                ) : quizzes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border-[1.5px] border-dashed border-rule p-14 text-center">
                        <p className="text-sm text-ink-muted max-w-xs">
                            {search
                                ? "No quizzes found matching your search."
                                : "No quizzes yet. Create one from a study set to test your knowledge."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {quizzes.map((q) => {
                            const lastAttempt = q.attempts[0] ?? null;
                            const scoreColor = lastAttempt === null ? "" : lastAttempt.score >= 70 ? "text-mastered" : "text-review";
                            return (
                                <div key={q.id} className="relative group">
                                    <div className="absolute top-2 left-2 right-0 bottom-0 rounded-md border border-rule bg-surface-2 z-0" />
                                    <div className="relative z-10 rounded-md border border-rule bg-card p-5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-accent">Quiz</p>
                                            <button
                                                type="button"
                                                onClick={() => setConfirmDeleteId(q.id)}
                                                disabled={deleting === q.id}
                                                aria-label="Delete quiz"
                                                className="flex h-[26px] w-[26px] items-center justify-center rounded-md border-none bg-transparent text-ink-muted hover:bg-paper hover:text-error cursor-pointer transition disabled:opacity-50 shrink-0"
                                            >
                                                ⋯
                                            </button>
                                        </div>
                                        <Link href={`/dashboard/quizzes/${q.id}`} className="block mt-1">
                                            <h3 className="font-display text-[17px] font-semibold text-ink truncate">{q.title}</h3>
                                        </Link>
                                        <p className="text-[12.5px] text-ink-muted mt-1">{q.studySet.title}</p>
                                        {lastAttempt && (
                                            <p className={`text-xs font-semibold mt-2 ${scoreColor}`}>
                                                Last score: {lastAttempt.score}%
                                            </p>
                                        )}
                                        {!lastAttempt && (
                                            <p className="text-[11px] text-ink-muted mt-2">No attempts yet</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ConfirmModal
                open={confirmDeleteId !== null}
                title="Delete quiz?"
                message="This will permanently delete this quiz and cannot be undone."
                details={["All quiz attempts and recorded scores"]}
                confirmLabel="Delete"
                destructive
                onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
                onCancel={() => setConfirmDeleteId(null)}
            />
        </main>
    );
}
