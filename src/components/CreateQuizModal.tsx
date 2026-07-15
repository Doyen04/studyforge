"use client";

import { useEffect, useCallback } from "react";
import { IconX } from "@tabler/icons-react";
import { CreateQuizPanel } from "./CreateQuizPanel";

export function CreateQuizModal({
    studySetId,
    studySetTitle,
    availableCounts,
    onClose,
}: {
    studySetId: string;
    studySetTitle: string;
    availableCounts: Record<string, number>;
    onClose: () => void;
}) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative w-full max-w-lg rounded-lg border border-rule bg-card shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-rule hover:text-ink transition cursor-pointer"
                    aria-label="Close modal"
                >
                    <IconX size={16} stroke={2} />
                </button>

                <div className="max-h-[85vh] overflow-y-auto">
                    <CreateQuizPanel studySetId={studySetId} studySetTitle={studySetTitle} availableCounts={availableCounts} />
                </div>
            </div>
        </div>
    );
}
