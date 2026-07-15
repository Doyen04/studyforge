import { GoogleGenAI } from "@google/genai";
import { prisma } from "./db";

export const GENERATION_MODEL = "gemini-3.1-flash-lite";

interface StructuredCallOptions {
    system: string;
    user: string;
    schema: Record<string, unknown>;
    maxTokens?: number;
}

async function getGeminiApiKey(): Promise<string> {
    const setting = await prisma.userSetting.findUnique({ where: { id: "default" } });
    if (setting?.geminiApiKey) return setting.geminiApiKey;

    const envKey = process.env.GEMINI_API_KEY;
    if (envKey) return envKey;

    throw new Error(
        "No Gemini API key configured. Go to Settings to add your own key, or set GEMINI_API_KEY in your environment."
    );
}

export async function generateStructured<T>({
    system,
    user,
    schema,
    maxTokens = 4096,
}: StructuredCallOptions): Promise<T> {
    const apiKey = await getGeminiApiKey();

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: GENERATION_MODEL,
        contents: user,
        config: {
            systemInstruction: system,
            responseMimeType: "application/json",
            responseSchema: schema,
            maxOutputTokens: maxTokens,
        },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Gemini SDK did not return a text response.");
    }

    return JSON.parse(text) as T;
}
