"use client";

import { use } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StudySetViewer, type StudySetData } from "@/components/StudySetViewer";
import { queryKeys, fetchJson } from "@/lib/queries";

interface DetailResponse {
    studySet: StudySetData | null;
}

export default function StudySetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: queryKeys.studySet(id),
        queryFn: () => fetchJson<DetailResponse>(`/api/study-sets/${id}`),
    });

    const studySet = data?.studySet ?? null;
    const notFoundError = !isLoading && !studySet;
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["study-sets"] });

    if (isLoading) {
        return (
            <main className="min-h-screen bg-paper">
                <div className="mx-auto max-w-5xl px-6 py-8 lg:py-10 animate-pulse space-y-6">
                    <div className="h-8 w-64 rounded bg-rule" />
                    <div className="h-6 w-48 rounded bg-rule" />
                    <div className="h-48 rounded-md bg-rule" />
                </div>
            </main>
        );
    }

    if (notFoundError || !studySet) {
        return (
            <main className="min-h-screen bg-paper">
                <div className="mx-auto max-w-5xl px-6 py-8 lg:py-10 text-center">
                    <p className="text-sm text-ink-muted">Study set not found.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-paper">
            <div className="mx-auto max-w-5xl px-6 py-8 lg:py-10">
                <StudySetViewer studySet={studySet} refresh={refresh} />
            </div>
        </main>
    );
}
