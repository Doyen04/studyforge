export interface GeneratedFlashcard {
    subtopic: string;
    front: string;
    back: string;
}

export interface GeneratedMcqQuestion {
    subtopic: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface GeneratedFillInBlank {
    subtopic: string;
    sentence: string;
    answer: string;
    acceptableAnswers: string[];
}

export interface GeneratedTheoryQuestion {
    subtopic: string;
    question: string;
    referenceAnswer: string;
    keyPoints: string[];
}

export type QuestionType = "mcq" | "fillInBlank" | "theory";

export interface QuestionRef {
    type: QuestionType;
    id: string;
}

export interface GradedAnswer {
    type: QuestionType;
    id: string;
    userAnswer: string;
    score: number;
    isCorrect?: boolean;
    correctIndex?: number;
    explanation?: string;
    correctAnswer?: string;
    matchedKeyPoints?: string[];
    missedKeyPoints?: string[];
    feedback?: string;
}

// Persisted data shapes (Prisma scalar fields)
export interface FlashcardData {
    id: string;
    studySetId: string;
    subtopic: string | null;
    front: string;
    back: string;
}

export interface McqQuestionData {
    id: string;
    studySetId: string;
    subtopic: string | null;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface FillInBlankData {
    id: string;
    studySetId: string;
    subtopic: string | null;
    sentence: string;
    answer: string;
    acceptableAnswers: string[];
}

export interface TheoryQuestionData {
    id: string;
    studySetId: string;
    subtopic: string | null;
    question: string;
    referenceAnswer: string;
    keyPoints: string[];
}

// Quiz runner question
export type QuizQuestion =
    | { type: "mcq"; id: string; question: string; options: string[] }
    | { type: "fillInBlank"; id: string; sentence: string }
    | { type: "theory"; id: string; question: string };

// Submitted answer (client → API)
export interface SubmittedAnswer {
    type: QuestionType;
    id: string;
    userAnswer: string;
}

// Dashboard types
export interface DashboardStats {
    studySets: number;
    questionsGenerated: number;
    quizzesTaken: number;
    averageScore: number | null;
}

export interface StudySetSummary {
    id: string;
    title: string;
    filename: string;
    itemCounts: {
        flashcards: number;
        mcq: number;
        fillInBlank: number;
        theory: number;
    };
    lastScore: number | null;
}

export interface RecentAttempt {
    id: string;
    score: number;
    completedAt: Date | null;
    quiz: {
        studySet: {
            title: string;
        };
    };
}
