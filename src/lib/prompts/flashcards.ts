import { generateStructured } from "../gemini";
import type { GeneratedFlashcard } from "@/types/domain";

const SYSTEM_PROMPT = `You are an expert study-materials writer creating active-recall flashcards for a university student revising from their own course material. Before writing any flashcards, identify the distinct subtopics the source material actually covers — use its own headings or structure where present, or your own judgment where it isn't. Then generate the requested flashcards, distributing them across as many of those subtopics as the requested count allows: if the count is at least the number of subtopics you found, give every subtopic at least one flashcard before giving any subtopic a second; if the count is lower, prioritize breadth over depth. Tag each flashcard with the subtopic it primarily covers. Each flashcard must be answerable using only the source text. Do not invent facts the source doesn't support, and do not create duplicate or near-duplicate flashcards.`;

const SCHEMA = {
    type: "object",
    properties: {
        flashcards: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    subtopic: { type: "string" },
                    front: { type: "string" },
                    back: { type: "string" },
                },
                required: ["subtopic", "front", "back"],
                additionalProperties: false,
            },
        },
    },
    required: ["flashcards"],
    additionalProperties: false,
};

export async function generateFlashcards(sourceText: string, count: number): Promise<GeneratedFlashcard[]> {
    const result = await generateStructured<{ flashcards: GeneratedFlashcard[] }>({
        system: SYSTEM_PROMPT,
        user: `Generate exactly ${count} flashcards from the study material below.\n\n<source_material>\n${sourceText}\n</source_material>`,
        schema: SCHEMA,
        maxTokens: 4096,
    });

    return result.flashcards;
}
