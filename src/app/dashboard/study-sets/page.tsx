"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudySetsIndex() {
    const [sets, setSets] = useState<Array<{ id: string; title: string; document: { filename: string; wordCount: number } }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/study-sets")
            .then((res) => res.json())
            .then((data) => setSets(data.studySets))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen">
                <div className="mx-auto max-w-5xl px-4 py-8 space-y-6 animate-pulse">
                    <div className="h-8 w-40 rounded bg-rule" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-lg bg-rule" />)}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
                <section>
                    <h1 className="font-sans text-2xl font-semibold text-ink md:text-3xl">Study sets</h1>
                    <p className="mt-2 text-sm text-ink-muted">Your generated study materials.</p>

                    {sets.length === 0 ? (
                        <div className="mt-6 rounded-lg border border-dashed border-rule bg-card p-6 text-sm text-ink-muted">
                            Nothing here yet. Upload a slide deck, document, or PDF to turn it into flashcards and quizzes.
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
