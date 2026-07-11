import { notFound } from "next/navigation";
import { getStudySetDetail } from "@/lib/actions";
import { StudySetViewer } from "@/components/StudySetViewer";

interface StudySetPageProps {
    params: Promise<{ id: string }>;
}

export default async function StudySetPage({ params }: StudySetPageProps) {
    const { id } = await params;
    const studySet = await getStudySetDetail(id);

    if (!studySet) {
        notFound();
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-5xl px-4 py-8">
                <StudySetViewer studySet={studySet} />
            </div>
        </main>
    );
}
