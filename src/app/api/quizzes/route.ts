import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { QuestionType } from "@/lib/types";

interface CreateQuizBody {
    studySetId: string;
    title: string;
    types: QuestionType[];
    countPerType: number;
}

export async function POST(request: NextRequest) {
    const { studySetId, title, types, countPerType } = (await request.json()) as CreateQuizBody;

    const studySet = await prisma.studySet.findUnique({
        where: { id: studySetId },
        include: { mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
    });

    if (!studySet) {
        return NextResponse.json({ error: "Study set not found." }, { status: 404 });
    }

    const pick = <T extends { id: string }>(pool: T[], count: number) =>
        [...pool].sort(() => Math.random() - 0.5).slice(0, count).map((question) => question.id);

    const questionRefs = [
        ...(types.includes("mcq") ? pick(studySet.mcqQuestions, countPerType).map((id) => ({ type: "mcq", id })) : []),
        ...(types.includes("fillInBlank")
            ? pick(studySet.fillInBlanks, countPerType).map((id) => ({ type: "fillInBlank", id }))
            : []),
        ...(types.includes("theory") ? pick(studySet.theoryQuestions, countPerType).map((id) => ({ type: "theory", id })) : []),
    ];

    const quiz = await prisma.quiz.create({
        data: { studySetId, title, questionRefs: JSON.stringify(questionRefs) },
    });

    return NextResponse.json({ quiz });
}
