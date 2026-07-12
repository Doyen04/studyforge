import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
        return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    await prisma.quiz.delete({ where: { id } });

    return NextResponse.json({ ok: true });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: { studySet: { include: { mcqQuestions: true, fillInBlanks: true, theoryQuestions: true } } },
    });

    if (!quiz) {
        return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    const refs = parseJsonArray<{ type: string; id: string }>(quiz.questionRefs);
    const questions = refs.map((ref) => {
        if (ref.type === "mcq") {
            const question = quiz.studySet.mcqQuestions.find((item) => item.id === ref.id)!;
            return { type: "mcq", id: question.id, question: question.question, options: parseJsonArray<string>(question.options) };
        }
        if (ref.type === "fillInBlank") {
            const question = quiz.studySet.fillInBlanks.find((item) => item.id === ref.id)!;
            return { type: "fillInBlank", id: question.id, sentence: question.sentence };
        }

        const question = quiz.studySet.theoryQuestions.find((item) => item.id === ref.id)!;
        return { type: "theory", id: question.id, question: question.question };
    });

    return NextResponse.json({ quizId: quiz.id, title: quiz.title, questions });
}
