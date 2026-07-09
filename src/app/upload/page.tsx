"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const defaultCounts = {
    flashcards: 15,
    mcq: 10,
    fillInBlank: 8,
    theory: 5,
};

const generatingStatuses = ["Reading your document…", "Writing flashcards…", "Writing quiz questions…", "Almost done…"];

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [counts, setCounts] = useState(defaultCounts);
    const [statusIndex, setStatusIndex] = useState(0);
    const [idleStatus, setIdleStatus] = useState("Drop a file here, or tap to browse");
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const status = isGenerating ? generatingStatuses[statusIndex] : idleStatus;

    useEffect(() => {
        if (!isGenerating) {
            return;
        }

        const timer = window.setInterval(() => {
            setStatusIndex((current) => (current + 1) % generatingStatuses.length);
        }, 1400);

        return () => window.clearInterval(timer);
    }, [isGenerating]);

    async function uploadFile() {
        if (!file) {
            return;
        }

        setError(null);
        setIsUploading(true);
        setIdleStatus("Uploading…");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/documents", { method: "POST", body: formData });
            const json = (await response.json()) as { documentId?: string; error?: string };

            if (!response.ok || !json.documentId) {
                throw new Error(json.error || "Upload failed.");
            }

            setDocumentId(json.documentId);
            setIdleStatus("File uploaded. Set the generation counts below.");
        } catch (uploadError) {
            setDocumentId(null);
            setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
            setIdleStatus("Drop a file here, or tap to browse");
        } finally {
            setIsUploading(false);
        }
    }

    async function generateStudySet() {
        if (!documentId) {
            return;
        }

        setError(null);
        setIsGenerating(true);

        try {
            const response = await fetch("/api/study-sets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    documentId,
                    counts,
                }),
            });

            const json = (await response.json()) as { studySet?: { id: string }; error?: string };

            if (!response.ok || !json.studySet?.id) {
                throw new Error(json.error || "Generation failed.");
            }

            router.push(`/study-sets/${json.studySet.id}`);
        } catch (generateError) {
            setError(generateError instanceof Error ? generateError.message : "Generation failed.");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <main className="min-h-screen px-4 py-4 sm:px-6 md:py-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                <header className="flex items-center justify-between border-b border-rule pb-4">
                    <Link href="/" className="font-display text-2xl text-ink md:text-3xl">
                        StudyForge
                    </Link>
                    <Link href="/study-sets" className="text-sm font-semibold text-focus hover:text-focus-hover">
                        All study sets
                    </Link>
                </header>

                <section className="rounded-lg border border-rule bg-card p-6 md:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">Upload</p>
                    <h1 className="mt-3 font-sans text-2xl font-semibold text-ink md:text-3xl">Turn a document into practice.</h1>
                    <p className="mt-3 text-sm leading-6 text-ink-muted">
                        Upload a .pptx, .docx, or .pdf. Then set how many flashcards, MCQ, fill-in-the-blank, and theory questions you want.
                    </p>

                    {error ? <div className="mt-5 rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-ink">{error}</div> : null}

                    <div className="mt-6 rounded-lg border border-rule bg-paper p-4">
                        <div className="rounded-md border border-dashed border-rule bg-white p-5 text-sm text-ink-muted">
                            <p className="font-semibold text-ink">{status}</p>
                            <p className="mt-2">.pptx, .docx, or .pdf</p>
                        </div>
                        <div className="mt-4 flex flex-col gap-3">
                            <input
                                type="file"
                                accept=".docx,.pptx,.pdf"
                                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-ink file:mr-4 file:rounded-md file:border-0 file:bg-focus file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-focus-hover"
                            />
                            <button
                                type="button"
                                onClick={uploadFile}
                                disabled={!file || isUploading}
                                className="rounded-md bg-focus px-4 py-3 text-sm font-semibold text-white transition hover:bg-focus-hover disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isUploading ? "Uploading…" : "Upload file"}
                            </button>
                        </div>
                    </div>
                </section>

                {documentId ? (
                    <section className="rounded-lg border border-rule bg-card p-6 md:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">Generate</p>
                        <h2 className="mt-3 font-sans text-xl font-semibold text-ink">Choose counts</h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            {[
                                ["Flashcards", "flashcards", 40],
                                ["MCQ", "mcq", 25],
                                ["Fill-in-blank", "fillInBlank", 20],
                                ["Theory", "theory", 10],
                            ].map(([label, key, max]) => (
                                <label key={key as string} className="space-y-2 text-sm text-ink-muted">
                                    <span>{label}</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={max as number}
                                        value={counts[key as keyof typeof counts]}
                                        onChange={(event) =>
                                            setCounts((current) => ({
                                                ...current,
                                                [key]: Number(event.target.value),
                                            }))
                                        }
                                        className="block w-full rounded-md border border-rule bg-white px-3 py-2 text-ink"
                                    />
                                </label>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={generateStudySet}
                            disabled={isGenerating}
                            className="mt-6 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isGenerating ? "Generating…" : "Generate study set"}
                        </button>
                        <p className="mt-3 text-sm text-ink-muted">{isGenerating ? status : "StudyForge will create one study set from this document."}</p>
                    </section>
                ) : null}
            </div>
        </main>
    );
}
