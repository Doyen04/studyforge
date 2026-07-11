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
    const scoreColor = lastScore === null ? "text-gray-400" : lastScore >= 70 ? "text-mastered" : "text-review";
    const scoreLabel = lastScore === null ? "Not quizzed yet" : `Last score ${lastScore}%`;

    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-r-full" />
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Continue studying</p>
                    <p className="font-sans text-lg font-semibold text-ink">{studySet.title}</p>
                    <div className="flex items-center gap-1.5 text-sm">
                        <span className={`font-medium ${scoreColor}`}>{scoreLabel}</span>
                        <span className="text-gray-300 mx-1">·</span>
                        <span className="text-gray-400">
                            {itemCounts.flashcards}c · {itemCounts.mcq}m · {itemCounts.fillInBlank}f · {itemCounts.theory}t
                        </span>
                    </div>
                </div>
                <Link
                    href={`/dashboard/study-sets/${studySet.id}`}
                    className="whitespace-nowrap rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md"
                >
                    {lastScore === null ? "Start studying" : "Quiz again"}
                </Link>
            </div>
        </div>
    );
}