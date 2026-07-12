"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuestionType } from "@/types/domain";

const questionTypes: { key: QuestionType; label: string }[] = [
    { key: "mcq", label: "MCQ" },
    { key: "fillInBlank", label: "Fill-in-blank" },
    { key: "theory", label: "Theory" },
];

function initialCounts(available: Record<string, number>): Record<QuestionType, number> {
    return { mcq: Math.min(5, available.mcq ?? 0), fillInBlank: Math.min(5, available.fillInBlank ?? 0), theory: Math.min(5, available.theory ?? 0) };
}

export function CreateQuizPanel({ studySetId, studySetTitle, availableCounts }: { studySetId: string; studySetTitle: string; availableCounts: Record<string, number> }) {
    const router = useRouter();
    const [title, setTitle] = useState(`${studySetTitle} quiz`);
    const [counts, setCounts] = useState<Record<QuestionType, number>>(() => initialCounts(availableCounts));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function setCount(type: QuestionType, raw: string) {
        const value = parseInt(raw, 10);
        if (isNaN(value)) return;
        const max = availableCounts[type] ?? 0;
        setCounts((prev) => ({ ...prev, [type]: Math.max(0, Math.min(max, value)) }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const types = questionTypes.filter((t) => counts[t.key] > 0).map((t) => t.key);

        try {
            const response = await fetch("/api/quizzes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studySetId,
                    title,
                    types,
                    counts,
                }),
            });

            const json = (await response.json()) as { quiz?: { id: string }; error?: string };

            if (!response.ok || !json.quiz?.id) {
                throw new Error(json.error || "Could not create quiz.");
            }

            router.push(`/dashboard/quizzes/${json.quiz.id}`);
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Could not create quiz.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Quiz</p>
            <h2 className="mt-3 font-sans text-xl font-semibold text-ink">Create a quiz</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">Choose question types, set a count per type, and generate a quiz from this study set.</p>

            {error ? <div className="mt-4 rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-ink">{error}</div> : null}

            <div className="mt-5 grid gap-4">
                <label className="space-y-2 text-sm text-ink-muted">
                    <span>Quiz title</span>
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="block w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                </label>
                <div className="space-y-2 text-sm text-ink-muted">
                    <span>Questions per type</span>
                    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3">
                        {questionTypes.map((type) => {
                            const max = availableCounts[type.key] ?? 0;
                            return (
                                <label key={type.key} className="flex flex-col items-center gap-1 rounded-md border border-rule bg-paper px-3 py-3 sm:py-2 text-sm text-ink">
                                    <span className="flex items-center gap-1.5 text-ink-muted text-xs">
                                        {type.label}
                                        <span className="font-data">/{max}</span>
                                    </span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={max}
                                        value={counts[type.key]}
                                        onChange={(e) => setCount(type.key, e.target.value)}
                                        className="w-full max-w-16 rounded-md border border-rule bg-paper px-2 py-1 text-center text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent font-data text-sm"
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || questionTypes.every((t) => counts[t.key] === 0)}
                className="mt-6 w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
                {isSubmitting ? "Creating…" : "Create quiz"}
            </button>
        </form>
    );
}
