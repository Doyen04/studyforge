import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";
import Link from "next/link";

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
        <main className="min-h-screen px-4 py-4 sm:px-6 md:py-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                <header className="flex items-center justify-between border-b border-rule pb-4">
                    <Link href={`/study-sets/${quiz.studySetId}`} className="text-sm font-semibold text-focus hover:text-focus-hover">
                        ← {quiz.studySet.title}
                    </Link>
                    <Link href={`/quizzes/${quiz.id}`} className="text-sm font-semibold text-focus hover:text-focus-hover">
                        Retake quiz
                    </Link>
                </header>

                <section className="rounded-lg border border-rule bg-card p-6 md:p-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">Quiz results</p>
                    <h1 className="mt-3 font-sans text-2xl font-semibold text-ink md:text-3xl">{quiz.title}</h1>
                    <div className="mt-6 font-data text-5xl text-ink md:text-6xl">{attempt.score}%</div>
                    <div className="mx-auto mt-4 h-px w-24 bg-focus" />
                    <p className="mt-4 text-sm text-ink-muted">Attempt {attemptId} completed {attempt.completedAt ? attempt.completedAt.toLocaleDateString() : "recently"}.</p>
                </section>

                <section className="space-y-4">
                    {answers.map((answer, index) => (
                        <article key={answer.id} className="rounded-lg border border-rule bg-card p-5 md:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="font-data text-sm text-ink-muted">Q{index + 1}</div>
                                <div className="text-sm font-semibold text-ink">{answer.type}</div>
                            </div>
                            {answer.feedback ? <p className="mt-4 rounded-md bg-paper p-4 text-sm leading-6 text-ink-muted">{answer.feedback}</p> : null}
                            {answer.correctAnswer ? <p className="mt-4 text-sm font-semibold text-mastered">Correct answer: {answer.correctAnswer}</p> : null}
                            {answer.matchedKeyPoints?.length ? (
                                <div className="mt-4 flex gap-3">
                                    <div className="h-full w-1 rounded-full bg-mastered" />
                                    <ul className="space-y-2 text-sm leading-6 text-ink-muted">
                                        {answer.matchedKeyPoints.map((point, pointIndex) => (
                                            <li key={`${answer.id}-matched-${pointIndex}`}>✓ {point}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                            {answer.missedKeyPoints?.length ? (
                                <div className="mt-4 flex gap-3">
                                    <div className="h-full w-1 rounded-full bg-rule" />
                                    <ul className="space-y-2 text-sm leading-6 text-ink-muted">
                                        {answer.missedKeyPoints.map((point, pointIndex) => (
                                            <li key={`${answer.id}-missed-${pointIndex}`}>– {point}</li>
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
