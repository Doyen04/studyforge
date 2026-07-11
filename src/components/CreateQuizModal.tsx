"use client";

import { useEffect, useCallback } from "react";
import { CreateQuizPanel } from "./CreateQuizPanel";

export function CreateQuizModal({
    studySetId,
    studySetTitle,
    onClose,
}: {
    studySetId: string;
    studySetTitle: string;
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative w-full max-w-lg rounded-lg border border-rule bg-white shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-rule hover:text-ink transition cursor-pointer"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <div className="max-h-[85vh] overflow-y-auto p-6">
                    <CreateQuizPanel studySetId={studySetId} studySetTitle={studySetTitle} />
                </div>
            </div>
        </div>
    );
}
