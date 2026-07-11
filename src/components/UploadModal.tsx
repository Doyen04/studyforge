"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { UploadZone } from "./UploadZone";
import { GenerateOptionsPanel } from "./GenerateOptionsPanel";

export function UploadModal({ onClose, standalone }: { onClose?: () => void; standalone?: boolean }) {
    const router = useRouter();
    const [documentId, setDocumentId] = useState<string | null>(null);

    const handleUploadSuccess = (docId: string) => {
        setDocumentId(docId);
    };

    const handleReset = () => {
        setDocumentId(null);
    };

    const handleGenerationSuccess = (studySetId: string) => {
        onClose?.();
        router.push(`/dashboard/study-sets/${studySetId}`);
    };

    if (standalone) {
        return (
            <div className="w-full transition-all duration-300">
                {!documentId ? (
                    <UploadZone onUploadSuccess={handleUploadSuccess} />
                ) : (
                    <GenerateOptionsPanel
                        documentId={documentId}
                        onGenerationSuccess={handleGenerationSuccess}
                        onReset={handleReset}
                    />
                )}
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget && !documentId) onClose?.();
            }}
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
                        onClick={() => onClose?.()}
                        aria-label="Close"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-rule hover:text-ink transition cursor-pointer"
                    >
                        <X size={16} />
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
