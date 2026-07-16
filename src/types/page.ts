import type { GradedAnswer, QuizQuestion } from "./domain";

export interface QuizIndexItem {
    id: string;
    title: string;
    studySet: { title: string };
    attempts: Array<{ score: number; completedAt: string | null }>;
}

export interface McqQuestionBrief {
    id: string;
    question: string;
    options: string;
}

export interface FillInBlankBrief {
    id: string;
    sentence: string;
}

export interface TheoryQuestionBrief {
    id: string;
    question: string;
}

export interface QuizResultData {
    quiz: {
        id: string;
        title: string;
        studySet: {
            mcqQuestions: McqQuestionBrief[];
            fillInBlanks: FillInBlankBrief[];
            theoryQuestions: TheoryQuestionBrief[];
        };
    };
    attempt: {
        score: number;
        completedAt: string | null;
    };
    answers: GradedAnswer[];
}

export interface QuizPageData {
    quizId: string;
    title: string;
    questions: QuizQuestion[];
    attempts: Array<{ id: string; score: number; completedAt: Date | string | null }>;
}

export interface DocumentItem {
    id: string;
    filename: string;
    fileType: string;
    wordCount: number;
    createdAt: string;
    _count: { studySets: number };
}
