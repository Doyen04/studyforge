"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { StudySetViewer, type StudySetData } from "@/components/StudySetViewer";

export default function StudySetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [studySet, setStudySet] = useState<StudySetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const refresh = () => setRefreshTrigger((prev) => prev + 1);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/study-sets/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.studySet) { setNotFoundError(true); return; }
                setStudySet(data.studySet);
            })
            .catch(() => { toast.error("Failed to load study set."); })
            .finally(() => setLoading(false));
    }, [id, refreshTrigger]);

    if (loading) {
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
