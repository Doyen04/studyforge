import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const studySet = await prisma.studySet.findUnique({ where: { id } });
    if (!studySet) {
        return NextResponse.json({ error: "Study set not found." }, { status: 404 });
    }

    await prisma.studySet.delete({ where: { id } });

    return NextResponse.json({ ok: true });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        return NextResponse.json({ error: "Study set not found." }, { status: 404 });
    }

    await prisma.studySet.update({
        where: { id },
        data: { lastAccessedAt: new Date() },
    });

    const parsed = {
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

    return NextResponse.json({ studySet: parsed });
}
