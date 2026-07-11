"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { UploadModal } from "./UploadModal";

export function UploadTile() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
            >
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-accent/30 bg-accent/[0.03] p-5 text-sm text-accent transition-all hover:border-accent/60 hover:bg-accent/[0.07] hover:shadow-sm min-h-[148px] group w-full cursor-pointer"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg font-semibold text-accent group-hover:bg-accent/20 group-hover:scale-110 transition-all">+</span>
                    <span className="font-semibold">Upload material</span>
                    <span className="text-[11px] text-accent/60">.pptx, .docx, or .pdf</span>
                </button>
            </motion.div>
            {open && <UploadModal onClose={() => setOpen(false)} />}
        </>
    );
}
