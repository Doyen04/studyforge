"use client";

import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { StudySetCard } from "@/components/StudySetCard";

interface StudySetIndexItem {
    id: string;
    title: string;
    document: { filename: string };
    itemCounts: { flashcards: number; mcq: number; fillInBlank: number; theory: number };
    totalQuestions: number;
    quizCount: number;
    bestScore: number | null;
}

export default function StudySetsIndex() {
    const [sets, setSets] = useState<StudySetIndexItem[]>([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetch(`/api/study-sets?search=${encodeURIComponent(debouncedSearch)}`)
            .then((res) => res.json())
            .then((data) => setSets(data.studySets))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [debouncedSearch]);

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/study-sets/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setSets((prev) => prev.filter((s) => s.id !== id));
            toast.success("Study set deleted");
        } catch {
            toast.error("Failed to delete study set");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <main className="min-h-screen bg-paper">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-[32px] font-semibold text-ink tracking-tight">Study sets</h1>
                        <p className="text-sm text-ink-muted mt-1">Your generated study materials.</p>
                    </div>
                    <div className="relative sm:mt-1.5">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by title or filename..."
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
                ) : sets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border-[1.5px] border-dashed border-rule p-14 text-center">
                        <p className="text-sm text-ink-muted max-w-xs">
                            {search
                                ? "No study sets found matching your search."
                                : "Nothing here yet. Upload a slide deck, document, or PDF to turn it into flashcards and quizzes."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sets.map((set, i) => (
                            <StudySetCard
                                key={set.id}
                                set={{
                                    id: set.id,
                                    title: set.title,
                                    filename: set.document.filename,
                                    itemCounts: set.itemCounts,
                                    lastScore: set.bestScore,
                                }}
                                index={i}
                                quizCount={set.quizCount}
                                onDelete={deleting ? undefined : handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
