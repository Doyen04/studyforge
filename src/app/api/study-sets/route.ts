import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { chunkText, distributeCount } from "@/lib/chunk";
import { generateFillInBlanks } from "@/lib/prompts/fillInBlank";
import { generateFlashcards } from "@/lib/prompts/flashcards";
import { generateMcqQuestions } from "@/lib/prompts/mcq";
import { generateTheoryQuestions } from "@/lib/prompts/theoryQuestions";

interface GenerateRequestBody {
    documentId: string;
    counts: { flashcards: number; mcq: number; fillInBlank: number; theory: number };
}

async function generatePerChunk<T>(
    chunks: string[],
    counts: number[],
    generator: (chunk: string, count: number) => Promise<T[]>,
) {
    const results = await Promise.all(
        chunks.map((chunk, index) => {
            const count = counts[index] ?? 0;
            return count > 0 ? generator(chunk, count) : Promise.resolve([] as T[]);
        }),
    );

    return results.flat();
}

export async function POST(request: NextRequest) {
    const { documentId, counts } = (await request.json()) as GenerateRequestBody;

    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
        return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const chunks = chunkText(document.rawText);
    const flashcardCounts = distributeCount(counts.flashcards, chunks);
    const mcqCounts = distributeCount(counts.mcq, chunks);
    const fillInBlankCounts = distributeCount(counts.fillInBlank, chunks);
    const theoryCounts = distributeCount(counts.theory, chunks);

    const [flashcardResults, mcqResults, fillInBlankResults, theoryResults] = await Promise.all([
        generatePerChunk(chunks, flashcardCounts, generateFlashcards),
        generatePerChunk(chunks, mcqCounts, generateMcqQuestions),
        generatePerChunk(chunks, fillInBlankCounts, generateFillInBlanks),
        generatePerChunk(chunks, theoryCounts, generateTheoryQuestions),
    ]);

    const studySet = await prisma.studySet.create({
        data: {
            documentId,
            title: document.filename.replace(/\.(docx|pptx|pdf)$/i, ""),
            flashcards: { create: flashcardResults.flat() },
            mcqQuestions: {
                create: mcqResults.flat().map((question) => ({
                    question: question.question,
                    options: JSON.stringify(question.options),
                    correctIndex: question.correctIndex,
                    explanation: question.explanation,
                })),
            },
            fillInBlanks: {
                create: fillInBlankResults.flat().map((item) => ({
                    sentence: item.sentence,
                    answer: item.answer,
                    acceptableAnswers: JSON.stringify(item.acceptableAnswers),
                })),
            },
            theoryQuestions: {
                create: theoryResults.flat().map((item) => ({
                    question: item.question,
                    referenceAnswer: item.referenceAnswer,
                    keyPoints: JSON.stringify(item.keyPoints),
                })),
            },
        },
        include: { flashcards: true, mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
    });

    return NextResponse.json({ studySet });
}

export async function GET() {
    const studySets = await prisma.studySet.findMany({
        orderBy: { createdAt: "desc" },
        include: { document: true },
    });

    return NextResponse.json({ studySets });
}
