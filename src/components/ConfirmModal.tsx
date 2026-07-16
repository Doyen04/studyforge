"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    details?: string[];
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    destructive?: boolean;
    /** If set, renders a text input requiring this value to match before enabling the danger button. */
    requireInputLabel?: string;
}

export function ConfirmModal({
    open,
    title,
    message,
    details,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    destructive = false,
    requireInputLabel,
}: ConfirmModalProps) {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onCancel]);

    useEffect(() => {
        if (open) setInputValue("");
    }, [open]);

    if (!open) return null;

    const canConfirm = requireInputLabel ? inputValue === requireInputLabel : true;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-105"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="rounded-md border border-rule bg-card p-6  ">
                    <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
                    <p className="mt-2 text-[13.5px] text-ink-muted leading-relaxed">{message}</p>
                    {details && details.length > 0 && (
                        <ul className="mt-3 space-y-1 text-[13px] text-ink-muted">
                            {details.map((d) => (
                                <li key={d} className="flex items-start gap-2">
                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-muted/50" />
                                    <span>{d}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {requireInputLabel && (
                        <div className="mt-4">
                            <p className="text-xs text-ink-muted mb-1.5">
                                Type <span className="font-semibold text-ink">{requireInputLabel}</span> to confirm:
                            </p>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full rounded-md border border-rule bg-paper px-3 py-2 text-[13.5px] text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                            />
                        </div>
                    )}
                    <div className="mt-5 flex justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="cursor-pointer rounded-md border-none bg-transparent px-4 py-2 text-[13.5px] font-semibold text-ink-muted transition hover:bg-paper hover:text-ink"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={!canConfirm}
                            className={`cursor-pointer rounded-md border-none px-4 py-2 text-[13.5px] font-semibold text-white transition disabled:opacity-45 disabled:cursor-not-allowed ${destructive
                                    ? "bg-error hover:bg-danger-dark"
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
