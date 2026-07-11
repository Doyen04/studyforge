"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const questionTypes = [
    { key: "mcq", label: "MCQ" },
    { key: "fillInBlank", label: "Fill-in-blank" },
    { key: "theory", label: "Theory" },
] as const;

type QuestionType = (typeof questionTypes)[number]["key"];

export function CreateQuizPanel({ studySetId, studySetTitle }: { studySetId: string; studySetTitle: string }) {
    const router = useRouter();
    const [title, setTitle] = useState(`${studySetTitle} quiz`);
    const [countPerType, setCountPerType] = useState(5);
    const [types, setTypes] = useState<QuestionType[]>(["mcq", "fillInBlank", "theory"]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function toggleType(type: QuestionType) {
        setTypes((current) => (current.includes(type) ? current.filter((item) => item !== type) : [...current, type]));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/quizzes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studySetId,
                    title,
                    types,
                    countPerType,
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

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-ink-muted sm:col-span-2">
                    <span>Quiz title</span>
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="block w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                </label>
                <label className="space-y-2 text-sm text-ink-muted">
                    <span>Count per type</span>
                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={countPerType}
                        onChange={(event) => setCountPerType(Number(event.target.value))}
                        className="block w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                </label>
                <div className="space-y-2 text-sm text-ink-muted">
                    <span>Types</span>
                    <div className="flex flex-wrap gap-2">
                        {questionTypes.map((type) => (
                            <label key={type.key} className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                                types.includes(type.key)
                                    ? "border-accent bg-accent/5 text-accent"
                                    : "border-rule bg-paper text-ink hover:bg-paper-hover"
                            }`}>
                                <input
                                    type="checkbox"
                                    checked={types.includes(type.key)}
                                    onChange={() => toggleType(type.key)}
                                    className="accent-accent"
                                />
                                {type.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || types.length === 0}
                className="mt-6 w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
                {isSubmitting ? "Creating…" : "Create quiz"}
            </button>
        </form>
    );
}
