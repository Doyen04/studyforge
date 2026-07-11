import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";
import type { GradedAnswer } from "@/lib/types";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; attemptId: string }> }
) {
    const { id, attemptId } = await params;

    const [quiz, attempt] = await Promise.all([
        prisma.quiz.findUnique({
            where: { id },
            include: { studySet: { include: { mcqQuestions: true, fillInBlanks: true } } },
        }),
        prisma.quizAttempt.findUnique({ where: { id: attemptId }, include: { quiz: true } }),
    ]);

    if (!quiz || !attempt || attempt.quizId !== quiz.id) {
        return NextResponse.json({ error: "Quiz or attempt not found." }, { status: 404 });
    }

    const answers = parseJsonArray<GradedAnswer>(attempt.answers);

    return NextResponse.json({ quiz, attempt, answers });
}
