import { z } from "zod";
import { generateStructured } from "../anthropic";
import type { GeneratedMcqQuestion } from "@/types/domain";

const SYSTEM_PROMPT = `You are an expert exam-question writer creating multiple-choice questions for a university student revising from their own course material. Before writing any questions, identify the distinct subtopics the source material actually covers — use its own headings or structure where present, or your own judgment where it isn't. Then generate the requested questions, distributing them across as many of those subtopics as the requested count allows: if the count is at least the number of subtopics you found, give every subtopic at least one question before giving any subtopic a second; if the count is lower, prioritize breadth over depth. Tag each question with the subtopic it primarily covers. Each question must have exactly 4 options. Exactly one option is correct. The 3 incorrect options must be plausible and related to the topic. Do not use "All of the above" or "None of the above" as options. Base every question and every option only on the source text provided. Write a short explanation for why the correct option is correct. Do not invent facts the source doesn't support, and do not create duplicate or near-duplicate questions.`;

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
                    options: { type: "array", items: { type: "string" } },
                    correctIndex: { type: "integer" },
                    explanation: { type: "string" },
                },
                required: ["subtopic", "question", "options", "correctIndex", "explanation"],
                additionalProperties: false,
            },
        },
    },
    required: ["questions"],
    additionalProperties: false,
};

const McqShape = z.object({
    subtopic: z.string(),
    question: z.string(),
    options: z.array(z.string()).length(4),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string(),
});

export async function generateMcqQuestions(sourceText: string, count: number): Promise<GeneratedMcqQuestion[]> {
    const result = await generateStructured<{ questions: GeneratedMcqQuestion[] }>({
        system: SYSTEM_PROMPT,
        user: `Generate exactly ${count} multiple-choice questions from the study material below.\n\n<source_material>\n${sourceText}\n</source_material>`,
        schema: SCHEMA,
        maxTokens: 4096,
    });

    return result.questions.filter((question) => McqShape.safeParse(question).success);
}
