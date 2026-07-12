import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
    const { geminiApiKey } = (await request.json()) as { geminiApiKey: string };

    const key = geminiApiKey?.trim();
    if (!key) {
        return NextResponse.json({ error: "No API key provided." }, { status: 400 });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: "Say hi in one word.",
            config: { maxOutputTokens: 10 },
        });

        if (!response.text) {
            return NextResponse.json({ error: "Key is invalid — no response from Gemini." }, { status: 400 });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: `Key test failed: ${msg}` }, { status: 400 });
    }
}
