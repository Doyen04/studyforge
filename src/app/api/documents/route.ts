import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseDocument } from "@/lib/parseDocument";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const documents = await prisma.document.findMany({
        where: search
            ? { filename: { contains: search, mode: "insensitive" } }
            : {},
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { studySets: true } },
        },
    });

    return NextResponse.json({ documents });
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File exceeds 10MB limit." }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
        const { text, wordCount, fileType } = await parseDocument(buffer, file.name);
        const document = await prisma.document.create({
            data: { filename: file.name, fileType, rawText: text, wordCount },
        });

        return NextResponse.json({ documentId: document.id, wordCount, fileType });
    } catch (error) {
        const message = "Failed to parse file.";
        console.error(message, error);
        return NextResponse.json({ error: message }, { status: 422 });
    }
}
