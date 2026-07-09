import { z } from "zod";
import { generateStructured } from "../anthropic";
import type { GeneratedMcqQuestion } from "../types";

const SYSTEM_PROMPT = `You are an expert exam-question writer creating multiple-choice questions for a university student revising from their own course material. Each question must have exactly 4 options. Exactly one option is correct. The 3 incorrect options must be plausible and related to the topic. Do not use "All of the above" or "None of the above" as options. Base every question and every option only on the source text provided. Write a short explanation for why the correct option is correct.`;

const SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          correctIndex: { type: "integer" },
          explanation: { type: "string" },
        },
        required: ["question", "options", "correctIndex", "explanation"],
        additionalProperties: false,
      },
    },
  },
  required: ["questions"],
  additionalProperties: false,
};

const McqShape = z.object({
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
