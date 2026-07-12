import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    const setting = await prisma.userSetting.findUnique({ where: { id: "default" } });

    return NextResponse.json({
        geminiApiKey: setting?.geminiApiKey ?? null,
    });
}

export async function PUT(request: NextRequest) {
    const { geminiApiKey } = (await request.json()) as { geminiApiKey: string };

    const trimmed = geminiApiKey?.trim() || null;

    await prisma.userSetting.upsert({
        where: { id: "default" },
        create: { id: "default", geminiApiKey: trimmed },
        update: { geminiApiKey: trimmed },
    });

    return NextResponse.json({ ok: true });
}
