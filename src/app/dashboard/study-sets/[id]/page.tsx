"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { StudySetViewer } from "@/components/StudySetViewer";

interface StudySetPageProps {
    params: Promise<{ id: string }>;
}

export default function StudySetPage({ params }: StudySetPageProps) {
    const [studySet, setStudySet] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        params.then(({ id }) => {
            fetch(`/api/study-sets/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (!data.studySet) {
                        notFound();
                        return;
                    }
                    setStudySet(data.studySet);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        });
    }, [params]);

    if (loading) {
        return (
            <main className="min-h-screen">
                <div className="mx-auto max-w-5xl px-4 py-8 animate-pulse space-y-4">
                    <div className="h-8 w-64 rounded bg-rule" />
                    <div className="h-6 w-48 rounded bg-rule" />
                    {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-lg bg-rule" />)}
                </div>
            </main>
        );
    }

    if (!studySet) return null;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-5xl px-4 py-8">
                <StudySetViewer studySet={studySet} />
            </div>
        </main>
    );
}
