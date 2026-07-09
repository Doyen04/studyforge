import { generateStructured } from "../anthropic";

const SYSTEM_PROMPT = `You are grading a university student's written answer to a theory question, using a reference answer and a list of key points as the rubric. For each key point, decide whether the student's answer adequately addresses it. Sort every key point from the original list into exactly one of matchedKeyPoints or missedKeyPoints. Then write brief, encouraging feedback. Do not invent key points that were not in the original list.`;

const SCHEMA = {
    type: "object",
    properties: {
        matchedKeyPoints: { type: "array", items: { type: "string" } },
        missedKeyPoints: { type: "array", items: { type: "string" } },
        feedback: { type: "string" },
    },
    required: ["matchedKeyPoints", "missedKeyPoints", "feedback"],
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
    const keyPointsList = keyPoints.map((point, index) => `${index + 1}. ${point}`).join("\n");

    const result = await generateStructured<{
        matchedKeyPoints: string[];
        missedKeyPoints: string[];
        feedback: string;
    }>({
        system: SYSTEM_PROMPT,
        user: `<question>\n${question}\n</question>\n\n<reference_answer>\n${referenceAnswer}\n</reference_answer>\n\n<key_points>\n${keyPointsList}\n</key_points>\n\n<student_answer>\n${userAnswer}\n</student_answer>\n\nGrade the student's answer above.`,
        schema: SCHEMA,
        maxTokens: 1024,
    });

    const matched = keyPoints.filter((point) => result.matchedKeyPoints.includes(point));
    const score = keyPoints.length > 0 ? Math.round((matched.length / keyPoints.length) * 100) : 0;

    return {
        score,
        matchedKeyPoints: matched,
        missedKeyPoints: keyPoints.filter((point) => !matched.includes(point)),
        feedback: result.feedback,
    };
}
