import { generateStructured } from "../gemini";
import type { GeneratedTheoryQuestion } from "@/types/domain";

const SYSTEM_PROMPT = `You are an expert exam-question writer creating open-ended theory questions for a university student revising from their own course material. Before writing any questions, identify the distinct subtopics the source material actually covers — use its own headings or structure where present, or your own judgment where it isn't. Then generate the requested questions, distributing them across as many of those subtopics as the requested count allows: if the count is at least the number of subtopics you found, give every subtopic at least one question before giving any subtopic a second; if the count is lower, prioritize breadth over depth. Tag each question with the subtopic it primarily covers. Each question should require a short written answer. For each question, write a model reference answer, and break that reference answer down into 3-5 distinct key points a strong answer would need to cover. Key points must be short, self-contained statements. Base every question, reference answer, and key point only on the source text provided. Do not invent facts the source doesn't support, and do not create duplicate or near-duplicate questions.`;

const SCHEMA = {
    type: "object",
    properties: {
        questions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    subtopic: { type: "string" },
                    question: { type: "string" },
                    referenceAnswer: { type: "string" },
                    keyPoints: { type: "array", items: { type: "string" } },
                },
                required: ["subtopic", "question", "referenceAnswer", "keyPoints"],
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
