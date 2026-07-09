import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";

interface QuizResultsPageProps {
    params: Promise<{ id: string; attemptId: string }>;
}

export default async function QuizResultsPage({ params }: QuizResultsPageProps) {
    const { id, attemptId } = await params;

    const [quiz, attempt] = await Promise.all([
        prisma.quiz.findUnique({ where: { id }, include: { studySet: true } }),
        prisma.quizAttempt.findUnique({ where: { id: attemptId }, include: { quiz: true } }),
    ]);

    if (!quiz || !attempt || attempt.quizId !== quiz.id) {
        notFound();
    }

    const answers = parseJsonArray<{
        type: "mcq" | "fillInBlank" | "theory";
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
    }>(attempt.answers);

    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <section className="rounded-4xl border border-rule bg-card p-8 shadow-[0_16px_40px_rgba(27,31,29,0.06)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-focus">Results</p>
                    <h1 className="mt-3 font-display text-4xl text-ink">{quiz.title}</h1>
                    <p className="mt-4 text-sm leading-6 text-ink/70">Attempt {attemptId} scored {attempt.score}%.</p>
                </section>

                <section className="space-y-4">
                    {answers.map((answer, index) => (
                        <article key={answer.id} className="rounded-4xl border border-rule bg-card p-6">
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">Question {index + 1}</div>
                            <p className="mt-3 text-sm leading-6 text-ink/75">Type: {answer.type}</p>
                            <p className="mt-2 text-sm leading-6 text-ink/70">Score: {answer.score}%</p>
                            {answer.feedback ? <p className="mt-3 rounded-3xl bg-paper p-4 text-sm leading-6 text-ink/80">{answer.feedback}</p> : null}
                            {answer.correctAnswer ? <p className="mt-3 text-sm text-mastered">Correct answer: {answer.correctAnswer}</p> : null}
                            {answer.matchedKeyPoints?.length ? (
                                <div className="mt-4">
                                    <p className="text-sm font-semibold text-ink">Matched key points</p>
                                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-ink/75">
                                        {answer.matchedKeyPoints.map((point, pointIndex) => (
                                            <li key={`${answer.id}-matched-${pointIndex}`}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                            {answer.missedKeyPoints?.length ? (
                                <div className="mt-4">
                                    <p className="text-sm font-semibold text-ink">Missed key points</p>
                                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-review">
                                        {answer.missedKeyPoints.map((point, pointIndex) => (
                                            <li key={`${answer.id}-missed-${pointIndex}`}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}
