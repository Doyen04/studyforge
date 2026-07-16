"use client";

import { useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { IconSearch, IconUpload } from "@tabler/icons-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { ConfirmModal } from "@/components/ConfirmModal";
import { GenerateOptionsPanel } from "@/components/GenerateOptionsPanel";
import type { DocumentItem } from "@/types/page";
import { queryKeys, fetchJson } from "@/lib/queries";
import Link from "next/link";

const typeIcons: Record<string, string> = {
    pdf: "PDF",
    docx: "DOCX",
    pptx: "PPTX",
};

export default function DocumentsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [generatingDocId, setGeneratingDocId] = useState<string | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const queryKey = queryKeys.documents(debouncedSearch);

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) =>
            fetchJson<{ documents: DocumentItem[]; nextCursor: string | null }>(
                `/api/documents?search=${encodeURIComponent(debouncedSearch)}&cursor=${pageParam ?? ""}`
            ),
        initialPageParam: "",
        getNextPageParam: (last) => last.nextCursor ?? undefined,
    });

    const documents = data?.pages.flatMap((p) => p.documents) ?? [];

    const deleteMutation = useMutation({
        mutationFn: (id: string) => fetchJson(`/api/documents/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Document deleted");
        },
        onError: () => toast.error("Failed to delete document"),
    });

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (![".docx", ".pptx", ".pdf"].includes(ext)) {
            toast.error("Upload a .pptx, .docx, or .pdf file.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/documents", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed.");
            toast.success("Document uploaded successfully.");
            queryClient.invalidateQueries({ queryKey });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to upload document.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = (id: string) => {
        setConfirmDeleteId(null);
        setDeleting(id);
        deleteMutation.mutate(id, { onSettled: () => setDeleting(null) });
    };

    const getFileType = (filename: string) => {
        const ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
        return typeIcons[ext] ?? ext.toUpperCase();
    };

    return (
        <main className="min-h-screen bg-paper">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-[32px] font-semibold text-ink tracking-tight">Documents</h1>
                        <p className="text-sm text-ink-muted mt-1">All uploaded files. Click a document to generate a study set.</p>
                    </div>
                    <div className="flex items-center gap-3 sm:mt-1.5">
                        <button
                            type="button"
                            onClick={handleUploadClick}
                            disabled={uploading}
                            className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
                        >
                            <IconUpload size={16} stroke={2} />
                            {uploading ? "Uploading…" : "Upload"}
                        </button>
                        <input ref={fileInputRef} type="file" accept=".docx,.pptx,.pdf" onChange={handleFileChange} className="hidden" />
                        <div className="relative">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-64 rounded-md border border-rule bg-card py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                            />
                        </div>
                    </div>
                </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
                            {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-md bg-rule" />)}
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-md border-[1.5px] border-dashed border-rule p-14 text-center">
                            <p className="text-sm text-ink-muted max-w-xs">
                                {search
                                    ? "No documents found matching your search."
                                    : "No documents uploaded yet. Click Upload to get started."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {documents.map((doc) => {
                                    const fileType = getFileType(doc.filename);
                                    return (
                                        <div
                                            key={doc.id}
                                            className="relative group cursor-pointer"
                                            onClick={() => setGeneratingDocId(doc.id)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => e.key === "Enter" && setGeneratingDocId(doc.id)}
                                        >
                                            <div className="absolute top-2 left-2 right-0 bottom-0 rounded-md border border-rule bg-surface-2 z-0" />
                                            <div className="relative z-10 rounded-md border border-rule bg-card p-5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                                                <div className="flex items-start justify-between gap-3">
                                                    <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-accent">{fileType}</span>
                                                    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setMenuOpenId(menuOpenId === doc.id ? null : doc.id)}
                                                            className="flex h-6.5 w-6.5 items-center justify-center rounded-md border-none bg-transparent text-ink-muted hover:bg-paper hover:text-ink cursor-pointer"
                                                            aria-label="More options"
                                                        >
                                                            ⋯
                                                        </button>
                                                        {menuOpenId === doc.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                                                                <div className="absolute right-0 top-9 z-20 min-w-35 overflow-hidden rounded-md border border-rule bg-card shadow-[0_1px_2px_rgba(32,28,26,.05),0_8px_20px_-10px_rgba(32,28,26,.14)] dark:shadow-[0_1px_2px_rgba(0,0,0,.3),0_8px_20px_-10px_rgba(0,0,0,.5)]">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => { setMenuOpenId(null); setConfirmDeleteId(doc.id); }}
                                                                        className="w-full cursor-pointer border-none bg-transparent px-3.5 py-2 text-left text-[13.5px] font-sans text-error hover:bg-paper"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="font-display text-[17px] font-semibold text-ink truncate mt-1">{doc.filename}</h3>
                                                <div className="mt-2 flex items-center justify-between gap-4">
                                                    <p className="text-[12.5px] text-ink-muted">
                                                        {doc.wordCount?.toLocaleString() ?? 0} words · {doc._count?.studySets ?? 0} study set{(doc._count?.studySets ?? 0) !== 1 ? "s" : ""}
                                                    </p>
                                                    {doc._count?.studySets > 0 && (
                                                        <Link 
                                                            href={`/dashboard/study-sets?docId=${doc.id}`}
                                                            className="text-[11px] font-semibold text-accent hover:text-accent-hover transition cursor-pointer"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            View sets →
                                                        </Link>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-ink-muted mt-2">
                                                    {new Date(doc.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {hasNextPage && (
                                <div className="text-center pt-4">
                                    <button
                                        type="button"
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        className="rounded-md border border-rule bg-card px-6 py-2 text-sm font-semibold text-ink transition hover:bg-paper disabled:opacity-50 cursor-pointer"
                                    >
                                        {isFetchingNextPage ? "Loading…" : "Load More"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
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
                    onClick={(e) => { if (e.target === e.currentTarget) setGeneratingDocId(null); }}
                >
                    <div className="w-full max-w-md rounded-md border border-rule bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="px-6 pt-6 pb-2">
                            <p className="font-display text-lg font-semibold text-ink">Configure study set</p>
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
