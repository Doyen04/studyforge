import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) {
        return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    await prisma.document.delete({ where: { id } });

    return NextResponse.json({ ok: true });
}
