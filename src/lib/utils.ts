export function countWords(text: string): number {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function pick<T extends { id: string }>(pool: T[], count: number): string[] {
    return [...pool].sort(() => Math.random() - 0.5).slice(0, count).map((item) => item.id);
}
