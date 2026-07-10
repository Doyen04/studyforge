"use client";

import { useEffect, useState } from "react";

const defaultCounts = {
    flashcards: 15,
    mcq: 10,
    fillInBlank: 8,
    theory: 5,
};

const generatingStatuses = [
    "Reading your document…",
    "Writing flashcards…",
    "Writing quiz questions…",
    "Almost done…",
];

interface GenerateOptionsPanelProps {
    documentId: string;
    onGenerationSuccess: (studySetId: string) => void;
    onReset: () => void;
}

export function GenerateOptionsPanel({ documentId, onGenerationSuccess, onReset }: GenerateOptionsPanelProps) {
    const [counts, setCounts] = useState(defaultCounts);
    const [isGenerating, setIsGenerating] = useState(false);
    const [statusIndex, setStatusIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isGenerating) return;

        const interval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % generatingStatuses.length);
        }, 1400);

        return () => clearInterval(interval);
    }, [isGenerating]);

    const handleGenerate = async () => {
        setError(null);
        setIsGenerating(true);
        setStatusIndex(0);

        try {
            const response = await fetch("/api/study-sets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentId,
                    counts,
                }),
            });

            const data = await response.json();
            if (!response.ok || !data.studySet?.id) {
                throw new Error(data.error || "Failed to generate study set.");
            }

            onGenerationSuccess(data.studySet.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate study set.");
            setIsGenerating(false);
        }
    };

    return (
        <div className="rounded-lg border border-rule bg-card p-6 md:p-8 space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">Configure Study Set</p>
                <h2 className="mt-2 font-sans text-xl font-semibold text-ink">Choose generation counts</h2>
                <p className="mt-1 text-sm text-ink-muted">
                    Specify how many items of each type you want generated from your document.
                </p>
            </div>

            {error && (
                <div className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error font-medium">
                    {error}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                {[
                    { label: "Flashcards (0–40)", key: "flashcards", max: 40 },
                    { label: "MCQ Questions (0–25)", key: "mcq", max: 25 },
                    { label: "Fill-in-the-blank (0–20)", key: "fillInBlank", max: 20 },
                    { label: "Theory Questions (0–10)", key: "theory", max: 10 },
                ].map(({ label, key, max }) => (
                    <label key={key} className="flex flex-col gap-1.5 text-sm font-semibold text-ink-muted">
                        <span>{label}</span>
                        <input
                            type="number"
                            min={0}
                            max={max}
                            disabled={isGenerating}
                            value={counts[key as keyof typeof counts]}
                            onChange={(e) => {
                                const val = Math.max(0, Math.min(max, parseInt(e.target.value) || 0));
                                setCounts((prev) => ({ ...prev, [key]: val }));
                            }}
                            className="w-full rounded-md border border-rule bg-white px-3 py-2 text-ink outline-none transition focus:border-focus disabled:opacity-50"
                        />
                    </label>
                ))}
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full cursor-pointer rounded-md bg-focus hover:bg-focus-hover px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isGenerating ? "Generating set…" : "Generate study set"}
                </button>

                {isGenerating ? (
                    <p className="text-center font-sans text-sm text-focus font-medium animate-pulse">
                        {generatingStatuses[statusIndex]}
                    </p>
                ) : (
                    <div className="flex justify-between items-center text-xs text-ink-muted">
                        <span>This might take 10-30 seconds depending on size.</span>
                        <button
                            type="button"
                            onClick={onReset}
                            className="cursor-pointer font-semibold text-focus hover:underline"
                        >
                            Upload another file
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
