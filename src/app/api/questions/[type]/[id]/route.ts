import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ type: string; id: string }> }
) {
    const { type, id } = await params;

    try {
        switch (type) {
            case "mcq":
                await prisma.mcqQuestion.delete({ where: { id } });
                break;
            case "fillInBlank":
                await prisma.fillInBlank.delete({ where: { id } });
                break;
            case "theory":
                await prisma.theoryQuestion.delete({ where: { id } });
                break;
            case "flashcard":
                await prisma.flashcard.delete({ where: { id } });
                break;
            default:
                return NextResponse.json({ error: "Invalid question type" }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ type: string; id: string }> }
) {
    const { type, id } = await params;
    const data = await request.json();

    try {
        let updated;
        switch (type) {
            case "mcq":
                updated = await prisma.mcqQuestion.update({ where: { id }, data });
                break;
            case "fillInBlank":
                updated = await prisma.fillInBlank.update({ where: { id }, data });
                break;
            case "theory":
                updated = await prisma.theoryQuestion.update({ where: { id }, data });
                break;
            case "flashcard":
                updated = await prisma.flashcard.update({ where: { id }, data });
                break;
            default:
                return NextResponse.json({ error: "Invalid question type" }, { status: 400 });
        }
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
