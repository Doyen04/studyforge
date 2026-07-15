import { generateStructured } from "../gemini";
import type { GeneratedFillInBlank } from "@/types/domain";

const SYSTEM_PROMPT = `You are an expert study-materials writer creating fill-in-the-blank exercises for a university student revising from their own course material. Before writing any exercises, identify the distinct subtopics the source material actually covers — use its own headings or structure where present, or your own judgment where it isn't. Then generate the requested exercises, distributing them across as many of those subtopics as the requested count allows: if the count is at least the number of subtopics you found, give every subtopic at least one exercise before giving any subtopic a second; if the count is lower, prioritize breadth over depth. Tag each exercise with the subtopic it primarily covers. Take a factual sentence from the source material or a close paraphrase and blank out exactly one key term or short phrase, replacing it with "_____". The blanked term must be unambiguous given the rest of the sentence. Provide the exact correct answer, plus any acceptable alternate phrasings or synonyms. If there are no reasonable alternates, return an empty array for acceptableAnswers. Do not invent facts the source doesn't support, and do not create duplicate or near-duplicate exercises.`;

const SCHEMA = {
    type: "object",
    properties: {
        items: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    subtopic: { type: "string" },
                    sentence: { type: "string" },
                    answer: { type: "string" },
                    acceptableAnswers: { type: "array", items: { type: "string" } },
                },
                required: ["subtopic", "sentence", "answer", "acceptableAnswers"],
                additionalProperties: false,
            },
        },
    },
    required: ["items"],
    additionalProperties: false,
};

export async function generateFillInBlanks(sourceText: string, count: number): Promise<GeneratedFillInBlank[]> {
    const result = await generateStructured<{ items: GeneratedFillInBlank[] }>({
        system: SYSTEM_PROMPT,
        user: `Generate exactly ${count} fill-in-the-blank exercises from the study material below.\n\n<source_material>\n${sourceText}\n</source_material>`,
        schema: SCHEMA,
        maxTokens: 4096,
    });

    return result.items;
}
