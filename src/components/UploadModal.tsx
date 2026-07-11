"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadZone } from "./UploadZone";
import { GenerateOptionsPanel } from "./GenerateOptionsPanel";
import { useToast } from "./Toaster";

export function UploadModal({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const { toast } = useToast();
    const [documentId, setDocumentId] = useState<string | null>(null);

    const handleUploadSuccess = (docId: string) => {
        setDocumentId(docId);
    };

    const handleReset = () => {
        setDocumentId(null);
    };

    const handleGenerationSuccess = (studySetId: string) => {
        onClose();
        router.push(`/dashboard/study-sets/${studySetId}`);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !documentId) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
            onClick={handleOverlayClick}
        >
            <div
                className="w-full rounded-lg border border-rule bg-card shadow-xl"
                style={{ maxWidth: documentId ? "28rem" : "24rem" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <p className="font-sans text-base font-semibold text-ink">
                        {documentId ? "Configure study set" : "Upload material"}
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-rule hover:text-ink transition cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {!documentId ? (
                    <div className="px-6 pb-6">
                        <UploadZone onUploadSuccess={handleUploadSuccess} />
                    </div>
                ) : (
                    <GenerateOptionsPanel
                        documentId={documentId}
                        onGenerationSuccess={handleGenerationSuccess}
                        onReset={handleReset}
                    />
                )}
            </div>
        </div>
    );
}
