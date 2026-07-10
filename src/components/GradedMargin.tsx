export function GradedMargin({
    matchedKeyPoints,
    missedKeyPoints,
}: {
    matchedKeyPoints: string[];
    missedKeyPoints: string[];
}) {
    const total = matchedKeyPoints.length + missedKeyPoints.length;
    const percent = total === 0 ? 0 : Math.round((matchedKeyPoints.length / total) * 100);

    return (
        <div className="flex gap-4">
            <div className="w-1 shrink-0 rounded-full bg-rule h-auto relative overflow-hidden min-h-[40px]">
                <div
                    className="w-full rounded-full bg-mastered transition-[height] duration-700 ease-out motion-reduce:transition-none absolute top-0 left-0"
                    style={{ height: `${percent}%` }}
                />
            </div>
            <ul className="flex-1 space-y-1.5 py-0.5">
                {matchedKeyPoints.map((point) => (
                    <li key={point} className="flex gap-2 text-sm text-ink">
                        <span aria-hidden className="font-semibold text-mastered">✓</span>
                        <span>{point}</span>
                    </li>
                ))}
                {missedKeyPoints.map((point) => (
                    <li key={point} className="flex gap-2 text-sm text-ink-muted">
                        <span aria-hidden className="font-semibold text-review">–</span>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
