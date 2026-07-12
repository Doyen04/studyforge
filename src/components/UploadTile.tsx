"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { UploadZone } from "./UploadZone";
import { GenerateOptionsPanel } from "./GenerateOptionsPanel";

export function UploadTile() {
    const router = useRouter();
    const [documentId, setDocumentId] = useState<string | null>(null);

    const handleUploadSuccess = (docId: string) => {
        setDocumentId(docId);
    };

    const handleReset = () => {
        setDocumentId(null);
    };

    const handleGenerationSuccess = (studySetId: string) => {
        router.push(`/dashboard/study-sets/${studySetId}`);
    };

    if (documentId) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
            >
                <GenerateOptionsPanel
                    documentId={documentId}
                    onGenerationSuccess={handleGenerationSuccess}
                    onReset={handleReset}
                />
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            <UploadZone onUploadSuccess={handleUploadSuccess} />
        </motion.div>
    );
}
