import type { DashboardStats, StudySetSummary, RecentAttempt, QuizQuestion, GradedAnswer } from "./types";

async function api<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, { ...options, next: { revalidate: 0 } });
    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
}

type DashboardData = {
    stats: DashboardStats | null;
    studySets: StudySetSummary[];
    recentAttempts: RecentAttempt[];
};

export async function getDashboardData(): Promise<DashboardData> {
    return api<DashboardData>("/api/dashboard");
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const data = await api<DashboardData>("/api/dashboard");
    return data.stats ?? { studySets: 0, questionsGenerated: 0, quizzesTaken: 0, averageScore: null };
}

export async function getStudySetsWithScores(): Promise<StudySetSummary[]> {
    const data = await api<DashboardData>("/api/dashboard");
    return data.studySets;
}

export async function getRecentAttempts(): Promise<RecentAttempt[]> {
    const data = await api<DashboardData>("/api/dashboard");
    return data.recentAttempts;
}

type StudySetsIndexResponse = {
    studySets: Array<{
        id: string;
        title: string;
        document: { filename: string; wordCount: number };
    }>;
};

export async function getStudySetsIndex(): Promise<StudySetsIndexResponse["studySets"]> {
    const data = await api<StudySetsIndexResponse>("/api/study-sets");
    return data.studySets;
}

type StudySetDetailResponse = {
    studySet: {
        id: string;
        title: string;
        createdAt: Date;
        document: { filename: string; wordCount: number };
        flashcards: Array<{ id: string; studySetId: string; front: string; back: string }>;
        mcqQuestions: Array<{ id: string; studySetId: string; question: string; options: string[]; correctIndex: number; explanation: string }>;
        fillInBlanks: Array<{ id: string; studySetId: string; sentence: string; answer: string; acceptableAnswers: string[] }>;
        theoryQuestions: Array<{ id: string; studySetId: string; question: string; referenceAnswer: string; keyPoints: string[] }>;
    };
};

export async function getStudySetDetail(id: string): Promise<StudySetDetailResponse["studySet"] | null> {
    try {
        const data = await api<StudySetDetailResponse>(`/api/study-sets/${id}`);
        return data.studySet;
    } catch {
        return null;
    }
}

type QuizzesIndexResponse = {
    quizzes: Array<{
        id: string;
        title: string;
        createdAt: Date;
        studySet: { title: string };
        attempts: Array<{ score: number; completedAt: Date | null }>;
    }>;
};

export async function getQuizzesIndex(): Promise<QuizzesIndexResponse["quizzes"]> {
    const data = await api<QuizzesIndexResponse>("/api/quizzes");
    return data.quizzes;
}

type QuizWithQuestionsResponse = {
    quizId: string;
    title: string;
    questions: QuizQuestion[];
};

export async function getQuizWithQuestions(id: string): Promise<QuizWithQuestionsResponse | null> {
    try {
        return await api<QuizWithQuestionsResponse>(`/api/quizzes/${id}`);
    } catch {
        return null;
    }
}

type QuizResultsResponse = {
    quiz: {
        id: string;
        title: string;
        studySet: {
            mcqQuestions: Array<{ id: string; question: string; options: string; correctIndex: number; explanation: string }>;
            fillInBlanks: Array<{ id: string; sentence: string; answer: string; acceptableAnswers: string }>;
        };
    };
    attempt: {
        id: string;
        score: number;
        answers: string;
        completedAt: Date | null;
        quizId: string;
    };
    answers: GradedAnswer[];
};

export async function getQuizResults(quizId: string, attemptId: string): Promise<QuizResultsResponse | null> {
    try {
        return await api<QuizResultsResponse>(`/api/quizzes/${quizId}/results/${attemptId}`);
    } catch {
        return null;
    }
}
