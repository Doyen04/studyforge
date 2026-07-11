"use client";

import { UploadZone } from "./UploadZone";

export function UploadModal({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-lg border border-rule bg-card p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <p className="font-sans text-base font-semibold text-ink">Upload material</p>
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
                <UploadZone onUploadSuccess={onClose} />
            </div>
        </div>
    );
}
