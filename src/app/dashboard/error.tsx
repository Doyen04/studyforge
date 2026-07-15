"use client";

import { useEffect } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard caught error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error mb-4">
                <IconAlertTriangle size={24} stroke={2} />
            </div>
            <h2 className="font-display text-xl font-semibold text-ink">Something went wrong</h2>
            <p className="mt-2 text-sm text-ink-muted max-w-md">
                An unexpected error occurred while loading this section of the dashboard.
            </p>
            <button
                type="button"
                onClick={() => reset()}
                className="mt-6 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover cursor-pointer"
            >
                Try again
            </button>
        </main>
    );
}
