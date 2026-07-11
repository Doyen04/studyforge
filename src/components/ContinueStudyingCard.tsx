import Link from "next/link";

export function ContinueStudyingCard({
    studySet,
    itemCounts,
    lastScore,
}: {
    studySet: { id: string; title: string };
    itemCounts: { flashcards: number; mcq: number; fillInBlank: number; theory: number };
    lastScore: number | null;
}) {
    const scoreColor = lastScore === null ? "text-ink-muted" : lastScore >= 70 ? "text-mastered" : "text-review";
    const scoreLabel = lastScore === null ? "Not quizzed yet" : `Last score ${lastScore}%`;

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-rule bg-card p-4">
            <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">Continue studying</p>
                <p className="font-sans text-base font-semibold text-ink">{studySet.title}</p>
                <p className="text-sm">
                    <span className={`font-medium ${scoreColor}`}>{scoreLabel}</span>
                    <span className="text-ink-muted">
                        {" "}
                        · {itemCounts.flashcards} cards · {itemCounts.mcq} MCQ · {itemCounts.fillInBlank} fill ·{" "}
                        {itemCounts.theory} theory
                    </span>
                </p>
            </div>
            <Link
                href={`/dashboard/study-sets/${studySet.id}`}
                className="whitespace-nowrap rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
                {lastScore === null ? "Take a quiz" : "Quiz again"}
            </Link>
        </div>
    );
}