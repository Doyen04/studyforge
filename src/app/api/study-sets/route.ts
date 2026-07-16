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

    //optimise the ai and this too
    const [flashcardResults, mcqResults, fillInBlankResults, theoryResults] = await Promise.all([
        generatePerChunk(chunks, flashcardCounts, generateFlashcards),
        generatePerChunk(chunks, mcqCounts, generateMcqQuestions),
        generatePerChunk(chunks, fillInBlankCounts, generateFillInBlanks),
        generatePerChunk(chunks, theoryCounts, generateTheoryQuestions),
    ]);

    const studySet = await prisma.studySet.create({
        data: {
            documentId,
            title: document.filename.replace(/\.[^/.]+$/, ""),
            flashcards: {
                create: flashcardResults.flat().map((item) => ({
                    subtopic: item.subtopic,
                    front: item.front,
                    back: item.back,
                })),
            },
            mcqQuestions: {
                create: mcqResults.flat().map((question) => ({
                    subtopic: question.subtopic,
                    question: question.question,
                    options: JSON.stringify(question.options),
                    correctIndex: question.correctIndex,
                    explanation: question.explanation,
                })),
            },
            fillInBlanks: {
                create: fillInBlankResults.flat().map((item) => ({
                    subtopic: item.subtopic,
                    sentence: item.sentence,
                    answer: item.answer,
                    acceptableAnswers: JSON.stringify(item.acceptableAnswers),
                })),
            },
            theoryQuestions: {
                create: theoryResults.flat().map((item) => ({
                    subtopic: item.subtopic,
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

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const docId = searchParams.get("docId");

    const studySets = await prisma.studySet.findMany({
        where: {
            AND: [
                search
                    ? {
                          OR: [
                              { title: { contains: search, mode: "insensitive" } },
                              { document: { filename: { contains: search, mode: "insensitive" } } },
                          ],
                      }
                    : {},
                docId ? { documentId: docId } : {},
            ],
        },
        orderBy: { lastAccessedAt: "desc" },
        include: {
            document: { select: { filename: true } },
            _count: { select: { flashcards: true, mcqQuestions: true, fillInBlanks: true, theoryQuestions: true, quizzes: true } },
            quizzes: {
                include: {
                    attempts: {
                        where: { completedAt: { not: null } },
                        select: { score: true },
                    },
                },
            },
        },
    });

    const mapped = studySets.map((set) => {
        const allScores = set.quizzes.flatMap((q) => q.attempts.map((a) => a.score));
        const bestScore = allScores.length > 0 ? Math.max(...allScores) : null;
        return {
            id: set.id,
            title: set.title,
            document: { filename: set.document.filename },
            createdAt: set.createdAt,
            itemCounts: {
                flashcards: set._count.flashcards,
                mcq: set._count.mcqQuestions,
                fillInBlank: set._count.fillInBlanks,
                theory: set._count.theoryQuestions,
            },
            totalQuestions:
                set._count.flashcards +
                set._count.mcqQuestions +
                set._count.fillInBlanks +
                set._count.theoryQuestions,
            quizCount: set._count.quizzes,
            bestScore,
        };
    });

    return NextResponse.json({ studySets: mapped });
}
