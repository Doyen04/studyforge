export interface GeneratedFlashcard {
  front: string;
  back: string;
}

export interface GeneratedMcqQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GeneratedFillInBlank {
  sentence: string;
  answer: string;
  acceptableAnswers: string[];
}

export interface GeneratedTheoryQuestion {
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
