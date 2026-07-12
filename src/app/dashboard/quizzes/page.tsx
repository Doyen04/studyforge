"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { ConfirmModal } from "@/components/ConfirmModal";
import type { QuizIndexItem } from "@/types/page";

export default function QuizzesIndex() {
    const [quizzes, setQuizzes] = useState<QuizIndexItem[]>([]);
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
        <main className="min-h-screen">
            <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
                <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-sans text-2xl font-semibold text-ink md:text-3xl">Quizzes</h1>
                            <p className="mt-2 text-sm text-ink-muted">Your generated quizzes and past results.</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
                            <input
                                type="text"
                                placeholder="Search quizzes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-md border border-rule bg-card text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
                            {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-lg bg-rule" />)}
                        </div>
                    ) : quizzes.length === 0 ? (
                        <div className="mt-6 rounded-lg border border-dashed border-rule bg-card p-6 text-sm text-ink-muted">
                            {search ? "No quizzes found matching your search." : "No quizzes yet. Create one from a study set to test your knowledge."}
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map((q) => {
                                const lastAttempt = q.attempts[0] ?? null;
                                const scoreColor = lastAttempt === null ? "" : lastAttempt.score >= 70 ? "text-mastered" : "text-review";
                                return (
                                    <div key={q.id} className="relative group rounded-lg border border-rule bg-card p-5 transition hover:bg-paper-hover">
                                        <Link href={`/dashboard/quizzes/${q.id}`} className="block">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Quiz</p>
                                            <h2 className="mt-3 font-sans text-base font-semibold text-ink">{q.title}</h2>
                                            <p className="mt-2 text-sm leading-6 text-ink-muted">
                                                {q.studySet.title}
                                            </p>
                                            {lastAttempt && (
                                                <p className={`mt-3 text-xs font-semibold ${scoreColor}`}>
                                                    Last score: {lastAttempt.score}%
                                                </p>
                                            )}
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmDeleteId(q.id)}
                                            disabled={deleting === q.id}
                                            aria-label="Delete quiz"
                                            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-md text-ink-muted opacity-0 group-hover:opacity-100 hover:bg-error/10 hover:text-error transition cursor-pointer disabled:opacity-50"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            <ConfirmModal
                open={confirmDeleteId !== null}
                title="Delete quiz?"
                message="This will permanently delete this quiz and cannot be undone."
                details={[
                    "All quiz attempts and recorded scores",
                ]}
                confirmLabel="Delete"
                destructive
                onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
                onCancel={() => setConfirmDeleteId(null)}
            />
        </main>
    );
}
