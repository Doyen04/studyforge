"use client";

import { useState, type ReactNode } from "react";

export function CardShell({ question, children }: { question: string; children: ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="group cursor-pointer rounded-lg border border-rule bg-card p-4 transition hover:bg-paper-hover select-none"
        >
            <div className="flex items-start justify-between gap-4">
                <h3 className="font-sans text-base font-semibold text-ink group-hover:text-accent transition-colors">
                    {question}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted shrink-0 mt-0.5">
                    {isExpanded ? "Hide answer" : "Show answer"}
                </span>
            </div>
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-rule space-y-4" onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            )}
        </div>
    );
}
