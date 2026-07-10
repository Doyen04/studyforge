"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "./UploadZone";
import { GenerateOptionsPanel } from "./GenerateOptionsPanel";

export function UploadWorkflow() {
    const router = useRouter();
    const [documentId, setDocumentId] = useState<string | null>(null);

    const handleUploadSuccess = (docId: string) => {
        setDocumentId(docId);
    };

    const handleReset = () => {
        setDocumentId(null);
    };

    const handleGenerationSuccess = (studySetId: string) => {
        router.push(`/study-sets/${studySetId}`);
    };

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
