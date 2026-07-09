import { generateStructured } from "../anthropic";
import type { GeneratedFillInBlank } from "../types";

const SYSTEM_PROMPT = `You are an expert study-materials writer creating fill-in-the-blank exercises for a university student revising from their own course material. Take a factual sentence from the source material or a close paraphrase and blank out exactly one key term or short phrase, replacing it with "_____". The blanked term must be unambiguous given the rest of the sentence. Provide the exact correct answer, plus any acceptable alternate phrasings or synonyms. If there are no reasonable alternates, return an empty array for acceptableAnswers.`;

const SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sentence: { type: "string" },
          answer: { type: "string" },
          acceptableAnswers: { type: "array", items: { type: "string" } },
        },
        required: ["sentence", "answer", "acceptableAnswers"],
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
