import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const studySet = await prisma.studySet.findUnique({
        where: { id },
        include: { flashcards: true, mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
    });

    if (!studySet) {
        return NextResponse.json({ error: "Study set not found." }, { status: 404 });
    }

    return NextResponse.json({ studySet });
}
