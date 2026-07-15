import { generateStructured } from "../gemini";

const SYSTEM_PROMPT = `You are grading a university student's written answer to a theory question, using a reference answer and a numbered list of key points as the rubric. For each key point, decide whether the student's answer adequately addresses it. Return a list of the 0-based INTEGER INDICES of the key points the student matched (e.g. [0, 2] means key points 1 and 3 were matched). Then write brief, encouraging feedback. Do not invent key points that were not in the original list.`;

const SCHEMA = {
    type: "object",
    properties: {
        matchedIndices: { type: "array", items: { type: "integer" } },
        feedback: { type: "string" },
    },
    required: ["matchedIndices", "feedback"],
    additionalProperties: false,
};

export interface GradedTheoryAnswer {
    score: number;
    matchedKeyPoints: string[];
    missedKeyPoints: string[];
    feedback: string;
}

export async function gradeTheoryAnswer(
    question: string,
    referenceAnswer: string,
    keyPoints: string[],
    userAnswer: string
): Promise<GradedTheoryAnswer> {
    const keyPointsList = keyPoints.map((point, index) => `${index}. ${point}`).join("\n");

    const result = await generateStructured<{
        matchedIndices: number[];
        feedback: string;
    }>({
        system: SYSTEM_PROMPT,
        user: `<question>\n${question}\n</question>\n\n<reference_answer>\n${referenceAnswer}\n</reference_answer>\n\n<key_points>\n${keyPointsList}\n</key_points>\n\n<student_answer>\n${userAnswer}\n</student_answer>\n\nGrade the student's answer above. Return matched key point indices as integers.`,
        schema: SCHEMA,
        maxTokens: 1024,
    });

    // Clamp indices to valid range to guard against any LLM hallucination
    const validIndices = new Set(
        result.matchedIndices.filter((i) => Number.isInteger(i) && i >= 0 && i < keyPoints.length)
    );
    const matchedKeyPoints = keyPoints.filter((_, i) => validIndices.has(i));
    const missedKeyPoints = keyPoints.filter((_, i) => !validIndices.has(i));
    const score = keyPoints.length > 0 ? Math.round((matchedKeyPoints.length / keyPoints.length) * 100) : 0;

    return { score, matchedKeyPoints, missedKeyPoints, feedback: result.feedback };
}

