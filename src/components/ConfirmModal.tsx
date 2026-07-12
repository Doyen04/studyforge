"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    destructive?: boolean;
}

export function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    destructive = false,
}: ConfirmModalProps) {
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="rounded-lg border border-rule bg-card shadow-xl">
                    <div className="flex flex-col items-center px-6 pt-6 pb-4 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10 text-error mb-3">
                            <AlertTriangle size={20} />
                        </div>
                        <h2 className="font-sans text-base font-semibold text-ink">{title}</h2>
                        <p className="mt-2 text-sm text-ink-muted leading-relaxed">{message}</p>
                    </div>
                    <div className="flex gap-3 px-6 pb-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 cursor-pointer rounded-md border border-rule bg-card px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper-hover"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`flex-1 cursor-pointer rounded-md px-4 py-2.5 text-sm font-semibold text-white transition ${
                                destructive
                                    ? "bg-error hover:bg-error/90"
                                    : "bg-accent hover:bg-accent-hover"
                            }`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
