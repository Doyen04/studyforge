import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";
import { SiteHeader } from "@/components/SiteHeader";
import { StudySetViewer } from "@/components/StudySetViewer";

interface StudySetPageProps {
    params: Promise<{ id: string }>;
}

export default async function StudySetPage({ params }: StudySetPageProps) {
    const { id } = await params;

    const studySet = await prisma.studySet.findUnique({
        where: { id },
        include: {
            document: true,
            flashcards: true,
            mcqQuestions: true,
            fillInBlanks: true,
            theoryQuestions: true,
        },
    });

    if (!studySet) {
        notFound();
    }

    await prisma.studySet.update({
        where: { id },
        data: { lastAccessedAt: new Date() },
    });

    const parsedStudySet = {
        id: studySet.id,
        title: studySet.title,
        createdAt: studySet.createdAt,
        document: {
            filename: studySet.document.filename,
            wordCount: studySet.document.wordCount,
        },
        flashcards: studySet.flashcards.map((f) => ({
            id: f.id,
            studySetId: f.studySetId,
            front: f.front,
            back: f.back,
        })),
        mcqQuestions: studySet.mcqQuestions.map((q) => ({
            id: q.id,
            studySetId: q.studySetId,
            question: q.question,
            options: parseJsonArray<string>(q.options),
            correctIndex: q.correctIndex,
            explanation: q.explanation,
        })),
        fillInBlanks: studySet.fillInBlanks.map((f) => ({
            id: f.id,
            studySetId: f.studySetId,
            sentence: f.sentence,
            answer: f.answer,
            acceptableAnswers: parseJsonArray<string>(f.acceptableAnswers),
        })),
        theoryQuestions: studySet.theoryQuestions.map((t) => ({
            id: t.id,
            studySetId: t.studySetId,
            question: t.question,
            referenceAnswer: t.referenceAnswer,
            keyPoints: parseJsonArray<string>(t.keyPoints),
        })),
    };

    return (
        <main className="min-h-screen">
            <SiteHeader />
            <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
                <div>
                    <Link href="/dashboard/study-sets" className="text-sm font-semibold text-accent hover:text-accent-hover">
                        ← All study sets
                    </Link>
                </div>
                <StudySetViewer studySet={parsedStudySet} />
            </div>
        </main>
    );
}
