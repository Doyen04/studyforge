import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    
    try {
        const body = await request.json();
        const quality = Number(body.quality); // 0 to 5

        if (isNaN(quality) || quality < 0 || quality > 5) {
            return NextResponse.json({ error: "Quality must be between 0 and 5" }, { status: 400 });
        }

        const card = await prisma.flashcard.findUnique({
            where: { id },
        });

        if (!card) {
            return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
        }

        // SM-2 Algorithm
        let { repetitions, interval, easeFactor } = card;

        if (quality >= 3) {
            if (repetitions === 0) {
                interval = 1;
            } else if (repetitions === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions += 1;
        } else {
            repetitions = 0;
            interval = 1;
        }

        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (easeFactor < 1.3) {
            easeFactor = 1.3;
        }

        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + interval);

        const updatedCard = await prisma.flashcard.update({
            where: { id },
            data: {
                repetitions,
                interval,
                easeFactor,
                nextReviewDate,
            },
        });

        return NextResponse.json(updatedCard);
    } catch (error) {
        console.error("Failed to review flashcard:", error);
        return NextResponse.json({ error: "Failed to update flashcard" }, { status: 500 });
    }
}
