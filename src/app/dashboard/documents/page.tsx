"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ConfirmModal";
import { GenerateOptionsPanel } from "@/components/GenerateOptionsPanel";

interface Document {
    id: string;
    filename: string;
    fileType: string;
    wordCount: number;
    createdAt: string;
    _count: { studySets: number };
}

export default function DocumentsPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [generatingDocId, setGeneratingDocId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetch(`/api/documents?search=${encodeURIComponent(search)}`)
                .then((res) => res.json())
                .then((data) => setDocuments(data.documents))
                .catch(() => {})
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id: string) => {
        setConfirmDeleteId(null);
        setDeleting(id);
        try {
            const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setDocuments((prev) => prev.filter((d) => d.id !== id));
            toast.success("Document deleted");
        } catch {
            toast.error("Failed to delete document");
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
                            <h1 className="font-sans text-2xl font-semibold text-ink md:text-3xl">Documents</h1>
                            <p className="mt-2 text-sm text-ink-muted">All uploaded files. Click a document to generate a study set.</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
                            <input
                                type="text"
                                placeholder="Search documents..."
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
                    ) : documents.length === 0 ? (
                        <div className="mt-6 rounded-lg border border-dashed border-rule bg-card p-6 text-sm text-ink-muted">
                            {search ? "No documents found matching your search." : "No documents uploaded yet."}
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="rounded-lg border border-rule bg-card p-5 transition hover:bg-paper-hover group cursor-pointer"
                                    onClick={() => setGeneratingDocId(doc.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                                                {doc.fileType.toUpperCase().replace(".", "")}
                                            </p>
                                            <h2 className="mt-3 font-sans text-base font-semibold text-ink truncate">{doc.filename}</h2>
                                            <p className="mt-2 text-sm leading-6 text-ink-muted">
                                                {doc.wordCount.toLocaleString()} words · {doc._count.studySets} study set{doc._count.studySets !== 1 ? "s" : ""}
                                            </p>
                                            <p className="mt-1 text-xs text-ink-muted">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setConfirmDeleteId(doc.id);
                                            }}
                                            disabled={deleting === doc.id}
                                            aria-label="Delete document"
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted opacity-0 group-hover:opacity-100 hover:bg-error/10 hover:text-error transition cursor-pointer disabled:opacity-50"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <ConfirmModal
                open={confirmDeleteId !== null}
                title="Delete document?"
                message="This will permanently delete this document and cannot be undone."
                details={[
                    "All study sets created from this document",
                    "All flashcards, quiz questions, and theory questions",
                    "All quizzes and quiz attempts",
                ]}
                confirmLabel="Delete"
                destructive
                onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
                onCancel={() => setConfirmDeleteId(null)}
            />

            {generatingDocId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setGeneratingDocId(null);
                    }}
                >
                    <div className="w-full max-w-md rounded-lg border border-rule bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="px-6 pt-6 pb-2">
                            <p className="font-sans text-base font-semibold text-ink">Configure study set</p>
                        </div>
                        <div className="px-6 pb-6">
                            <GenerateOptionsPanel
                                documentId={generatingDocId}
                                onGenerationSuccess={(studySetId) => {
                                    setGeneratingDocId(null);
                                    router.push(`/dashboard/study-sets/${studySetId}`);
                                }}
                                onReset={() => setGeneratingDocId(null)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
