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
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white p-5 text-sm text-gray-400 transition-all hover:border-accent/40 hover:bg-accent/[0.02] hover:text-accent min-h-[148px] group"
            >
                <span className="text-2xl font-light leading-none group-hover:scale-110 transition-transform">+</span>
                <span className="font-medium">Upload material</span>
            </button>
            {open && <UploadModal onClose={() => setOpen(false)} />}
        </>
    );
}