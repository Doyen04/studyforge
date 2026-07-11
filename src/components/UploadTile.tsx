"use client";

import { useState } from "react";
import { UploadModal } from "./UploadModal";

export function UploadTile() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center justify-center rounded-lg border border-dashed border-rule bg-card p-4 text-sm text-ink-muted hover:bg-paper-hover"
            >
                + Upload material
            </button>
            {open && <UploadModal onClose={() => setOpen(false)} />}
        </>
    );
}