import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pick } from "@/lib/utils";
import type { QuestionType } from "@/lib/types";

interface CreateQuizBody {
    studySetId: string;
    title: string;
    types: QuestionType[];
    counts: Record<string, number>;
}

export async function POST(request: NextRequest) {
    const { studySetId, title, types, counts } = (await request.json()) as CreateQuizBody;

    const studySet = await prisma.studySet.findUnique({
        where: { id: studySetId },
        include: { mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
    });

    if (!studySet) {
        return NextResponse.json({ error: "Study set not found." }, { status: 404 });
    }

    const getCount = (type: string) => Math.min(counts[type] ?? 0, 10);

    const questionRefs = [
        ...(types.includes("mcq") ? pick(studySet.mcqQuestions, getCount("mcq")).map((id) => ({ type: "mcq", id })) : []),
        ...(types.includes("fillInBlank")
            ? pick(studySet.fillInBlanks, getCount("fillInBlank")).map((id) => ({ type: "fillInBlank", id }))
            : []),
        ...(types.includes("theory") ? pick(studySet.theoryQuestions, getCount("theory")).map((id) => ({ type: "theory", id })) : []),
    ];

    const quiz = await prisma.quiz.create({
        data: { studySetId, title, questionRefs: JSON.stringify(questionRefs) },
    });

    return NextResponse.json({ quiz });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const quizzes = await prisma.quiz.findMany({
        where: search
            ? {
                  OR: [
                      { title: { contains: search, mode: "insensitive" } },
                      { studySet: { title: { contains: search, mode: "insensitive" } } },
                  ],
              }
            : {},
        orderBy: { createdAt: "desc" },
        include: {
            studySet: { select: { title: true } },
            attempts: {
                where: { completedAt: { not: null } },
                orderBy: { completedAt: "desc" },
                take: 1,
                select: { score: true, completedAt: true },
            },
        },
    });

    return NextResponse.json({ quizzes });
}
