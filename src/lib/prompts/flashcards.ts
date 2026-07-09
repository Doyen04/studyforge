import { generateStructured } from "../anthropic";
import type { GeneratedFlashcard } from "../types";

const SYSTEM_PROMPT = `You are an expert study-materials writer creating active-recall flashcards for a university student revising from their own course material. Write flashcards that test understanding, not just word-matching. Each flashcard must be answerable using only the source text provided. Favor concise, unambiguous fronts and backs that are short but complete. Do not invent facts that are not supported by the source text. Do not create duplicate or near-duplicate flashcards.`;

const SCHEMA = {
    type: "object",
    properties: {
        flashcards: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    front: { type: "string" },
                    back: { type: "string" },
                },
                required: ["front", "back"],
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
        user: `Generate exactly ${count} flashcards from the study material below. Return the flashcards in the same order the ideas appear in the source.\n\n<source_material>\n${sourceText}\n</source_material>`,
        schema: SCHEMA,
        maxTokens: 4096,
    });

    return result.flashcards;
}
