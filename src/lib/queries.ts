export const queryKeys = {
    dashboard: ["dashboard"] as const,
    documents: (search: string) => ["documents", search] as const,
    studySets: (search: string, docId?: string | null) => ["study-sets", search, docId] as const,
    studySet: (id: string) => ["study-set", id] as const,
    quizzes: (search: string) => ["quizzes", search] as const,
    quiz: (id: string) => ["quiz", id] as const,
    quizResults: (quizId: string, attemptId: string) => ["quiz-results", quizId, attemptId] as const,
    settings: ["settings"] as const,
};

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data as T;
}
