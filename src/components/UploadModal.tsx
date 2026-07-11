"use client";

import { UploadZone } from "./UploadZone";

export function UploadModal({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-lg border border-rule bg-card p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <p className="font-sans text-base font-semibold text-ink">Upload material</p>
                    <button type="button" onClick={onClose} aria-label="Close" className="text-ink-muted">
                        ✕
                    </button>
                </div>
                <UploadZone onUploadSuccess={onClose} />
            </div>
        </div>
    );
}