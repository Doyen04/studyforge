"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { UploadZone } from "./UploadZone";
import { GenerateOptionsPanel } from "./GenerateOptionsPanel";

export function UploadTile() {
    const router = useRouter();
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [uploadKey, setUploadKey] = useState(0);

    const handleUploadSuccess = (docId: string) => {
        setDocumentId(docId);
        setShowModal(true);
    };

    const handleReset = () => {
        setDocumentId(null);
        setShowModal(false);
        setUploadKey((k) => k + 1);
    };

    const handleClose = () => {
        setShowModal(false);
        setUploadKey((k) => k + 1);
    };

    const handleGenerationSuccess = (studySetId: string) => {
        router.push(`/dashboard/study-sets/${studySetId}`);
    };

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <UploadZone key={uploadKey} onUploadSuccess={handleUploadSuccess} />
            </motion.div>

            {showModal && documentId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleClose();
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="rounded-lg border border-rule bg-card shadow-xl">
                            <div className="flex items-center justify-between px-6 pt-6 pb-2">
                                <p className="font-sans text-base font-semibold text-ink">Configure study set</p>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    aria-label="Close"
                                    className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-rule hover:text-ink transition cursor-pointer"
                                >
                                    <IconX size={16} stroke={2} />
                                </button>
                            </div>
                            <div className="px-6 pb-6">
                                <GenerateOptionsPanel
                                    documentId={documentId}
                                    onGenerationSuccess={handleGenerationSuccess}
                                    onReset={handleReset}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
