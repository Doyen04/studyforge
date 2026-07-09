import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseDocument } from "@/lib/parseDocument";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { text, wordCount, fileType } = await parseDocument(buffer, file.name);
    const document = await prisma.document.create({
      data: { filename: file.name, fileType, rawText: text, wordCount },
    });

    return NextResponse.json({ documentId: document.id, wordCount, fileType });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse file.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
