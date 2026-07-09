import { generateStructured } from "../anthropic";
import type { GeneratedTheoryQuestion } from "../types";

const SYSTEM_PROMPT = `You are an expert exam-question writer creating open-ended theory questions for a university student revising from their own course material. Each question should require a short written answer. For each question, write a model reference answer, and break that reference answer down into 3-5 distinct key points a strong answer would need to cover. Key points must be short, self-contained statements. Base every question, reference answer, and key point only on the source text provided.`;

const SCHEMA = {
    type: "object",
    properties: {
        questions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    referenceAnswer: { type: "string" },
                    keyPoints: { type: "array", items: { type: "string" } },
                },
                required: ["question", "referenceAnswer", "keyPoints"],
                additionalProperties: false,
            },
        },
    },
    required: ["questions"],
    additionalProperties: false,
};

export async function generateTheoryQuestions(sourceText: string, count: number): Promise<GeneratedTheoryQuestion[]> {
    const result = await generateStructured<{ questions: GeneratedTheoryQuestion[] }>({
        system: SYSTEM_PROMPT,
        user: `Generate exactly ${count} theory questions from the study material below.\n\n<source_material>\n${sourceText}\n</source_material>`,
        schema: SCHEMA,
        maxTokens: 4096,
    });

    return result.questions;
}
