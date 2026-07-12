"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export default function StudySetsIndex() {
    const [sets, setSets] = useState<Array<{ id: string; title: string; document: { filename: string; wordCount: number } }>>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetch(`/api/study-sets?search=${encodeURIComponent(search)}`)
                .then((res) => res.json())
                .then((data) => setSets(data.studySets))
                .catch(() => {})
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

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
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
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
                                <Link key={set.id} href={`/dashboard/study-sets/${set.id}`} className="rounded-lg border border-rule bg-card p-5 transition hover:bg-paper-hover">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Study set</p>
                                    <h2 className="mt-3 font-sans text-base font-semibold text-ink">{set.title}</h2>
                                    <p className="mt-2 text-sm leading-6 text-ink-muted">
                                        {set.document.filename} · {set.document.wordCount} words
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
