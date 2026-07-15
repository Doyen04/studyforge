"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { ConfirmModal } from "@/components/ConfirmModal";

export default function StudySetsIndex() {
    const [sets, setSets] = useState<Array<{ id: string; title: string; document: { filename: string; wordCount: number } }>>([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/study-sets?search=${encodeURIComponent(debouncedSearch)}`)
            .then((res) => res.json())
            .then((data) => setSets(data.studySets))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [debouncedSearch]);

    const handleDelete = async (id: string) => {
        setConfirmDeleteId(null);
        setDeleting(id);
        try {
            const res = await fetch(`/api/study-sets/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setSets((prev) => prev.filter((s) => s.id !== id));
            toast.success("Study set deleted");
        } catch {
            toast.error("Failed to delete study set");
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
                            <h1 className="font-sans text-2xl font-semibold text-ink md:text-3xl">Study sets</h1>
                            <p className="mt-2 text-sm text-ink-muted">Your generated study materials.</p>
                        </div>
                        <div className="relative">
                            <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
                            <input
                                type="text"
                                placeholder="Search study sets..."
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
                    ) : sets.length === 0 ? (
                        <div className="mt-6 rounded-lg border border-dashed border-rule bg-card p-6 text-sm text-ink-muted">
                            {search ? "No study sets found matching your search." : "Nothing here yet. Upload a slide deck, document, or PDF to turn it into flashcards and quizzes."}
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {sets.map((set) => (
                                <div key={set.id} className="relative group rounded-lg border border-rule bg-card p-5 transition hover:bg-paper-hover">
                                    <Link href={`/dashboard/study-sets/${set.id}`} className="block">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Study set</p>
                                        <h2 className="mt-3 font-sans text-base font-semibold text-ink">{set.title}</h2>
                                        <p className="mt-2 text-sm leading-6 text-ink-muted">
                                            {set.document.filename} · {set.document.wordCount} words
                                        </p>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(set.id)}
                                        disabled={deleting === set.id}
                                        aria-label="Delete study set"
                                        className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-md text-ink-muted opacity-0 group-hover:opacity-100 hover:bg-error/10 hover:text-error transition cursor-pointer disabled:opacity-50"
                                    >
                                        <IconTrash size={14} stroke={2} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <ConfirmModal
                open={confirmDeleteId !== null}
                title="Delete study set?"
                message="This will permanently delete this study set and cannot be undone."
                details={[
                    "All flashcards, MCQ, fill-in-the-blank, and theory questions",
                    "All quizzes created from this study set",
                    "All quiz attempts and scores",
                ]}
                confirmLabel="Delete"
                destructive
                onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
                onCancel={() => setConfirmDeleteId(null)}
            />
        </main>
    );
}
