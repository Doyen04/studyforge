import { GoogleGenAI } from "@google/genai";

export const GENERATION_MODEL = "gemini-3.1-flash-lite";

interface StructuredCallOptions {
    system: string;
    user: string;
    schema: Record<string, unknown>;
    maxTokens?: number;
}

export async function generateStructured<T>({
    system,
    user,
    schema,
    maxTokens = 4096,
}: StructuredCallOptions): Promise<T> {
    const apiKey = process.env.GEMINI_API_KEY;

    
    if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY environment variable. Please add it to your .env file.");
    }

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


