import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pick } from "@/lib/utils";
import type { QuestionType } from "@/types/domain";

interface CreateQuizBody {
    studySetId: string;
    title: string;
    types?: QuestionType[];
    counts?: Record<string, number>;
    questionRefs?: { type: QuestionType; id: string }[];
}

export async function POST(request: NextRequest) {
    const { studySetId, title, types, counts, questionRefs: explicitRefs } = (await request.json()) as CreateQuizBody;

    const studySet = await prisma.studySet.findUnique({
        where: { id: studySetId },
        include: { mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
    });

    if (!studySet) {
        return NextResponse.json({ error: "Study set not found." }, { status: 404 });
    }

    let questionRefs: { type: QuestionType; id: string }[];
    if (explicitRefs && explicitRefs.length > 0) {
        questionRefs = explicitRefs;
    } else {
        const getCount = (type: string) => Math.min(counts?.[type] ?? 0, 10);
        questionRefs = [
            ...(types?.includes("mcq" satisfies QuestionType)
                ? pick(studySet.mcqQuestions, getCount("mcq")).map((id) => ({ type: "mcq" as const, id }))
                : []),
            ...(types?.includes("fillInBlank" satisfies QuestionType)
                ? pick(studySet.fillInBlanks, getCount("fillInBlank")).map((id) => ({ type: "fillInBlank" as const, id }))
                : []),
            ...(types?.includes("theory" satisfies QuestionType)
                ? pick(studySet.theoryQuestions, getCount("theory")).map((id) => ({ type: "theory" as const, id }))
                : []),
        ];
    }

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
