import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";
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
        <main className="min-h-screen px-4 py-4 sm:px-6 md:py-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <header className="flex items-center justify-between border-b border-rule pb-4">
                    <Link href="/" className="text-sm font-semibold text-focus hover:text-focus-hover">
                        ← All study sets
                    </Link>
                </header>

                <StudySetViewer studySet={parsedStudySet} />
            </div>
        </main>
    );
}
