import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";
import Link from "next/link";
import { GradedMargin } from "@/components/GradedMargin";
import type { GradedAnswer } from "@/lib/types";

export default async function QuizResultsPage({ params }: { params: Promise<{ id: string; attemptId: string }> }) {
    const { id, attemptId } = await params;

    const [quiz, attempt] = await Promise.all([
        prisma.quiz.findUnique({ where: { id }, include: { studySet: { include: { mcqQuestions: true, fillInBlanks: true } } } }),
        prisma.quizAttempt.findUnique({ where: { id: attemptId }, include: { quiz: true } }),
    ]);

    if (!quiz || !attempt || attempt.quizId !== quiz.id) {
        notFound();
    }

    const answers = parseJsonArray<GradedAnswer>(attempt.answers);

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
                <div>
                    <Link href={`/dashboard/quizzes/${quiz.id}`} className="rounded-md border border-rule bg-card px-3 py-1.5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent">
                        Retake quiz
                    </Link>
                </div>

                {/* Score card */}
                <section className="rounded-lg border border-rule bg-card p-6 md:p-8 text-center space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Quiz Results</p>
                    <h1 className="font-sans text-xl font-bold text-ink">{quiz.title}</h1>
                    <div className="mt-2 font-data text-6xl font-semibold text-ink">{attempt.score}%</div>
                    <div className="mx-auto h-0.5 w-24 bg-accent" />
                    <p className="text-xs text-ink-muted">
                        Completed on {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : "recently"}.
                    </p>
                </section>

                {/* Answers list */}
                <section className="space-y-4">
                    {answers.map((answer, index) => {
                        const isTheory = answer.type === "theory";
                        const isCorrect = answer.isCorrect;

                        // Fetch additional data from static questions for MCQ & Fill in the Blank
                        let mcqQuestionText = "";
                        let mcqOptions: string[] = [];
                        let fillInBlankText = "";

                        if (answer.type === "mcq") {
                            const found = quiz.studySet.mcqQuestions.find((q) => q.id === answer.id);
                            if (found) {
                                mcqQuestionText = found.question;
                                mcqOptions = parseJsonArray<string>(found.options);
                            }
                        } else if (answer.type === "fillInBlank") {
                            const found = quiz.studySet.fillInBlanks.find((q) => q.id === answer.id);
                            if (found) {
                                fillInBlankText = found.sentence;
                            }
                        }

                        return (
                            <article key={answer.id} className="rounded-lg border border-rule bg-card p-5 md:p-6 space-y-4">
                                <div className="flex items-center justify-between border-b border-rule/50 pb-2">
                                    <span className="font-data text-xs text-ink-muted">Question {index + 1}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-paper px-2 py-0.5 font-sans text-[10px] font-semibold text-ink-muted uppercase tracking-wider">
                                            {answer.type}
                                        </span>
                                        {!isTheory && (
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold flex items-center gap-1 ${
                                                    isCorrect
                                                        ? "bg-mastered/10 text-mastered"
                                                        : "bg-error/10 text-error"
                                                }`}
                                            >
                                                <span>{isCorrect ? "✓" : "✗"}</span>
                                                <span>{isCorrect ? "Correct" : "Incorrect"}</span>
                                            </span>
                                        )}
                                        {isTheory && (
                                            <span className="font-data text-xs font-semibold text-ink">
                                                {answer.score}% matched
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Question body */}
                                <div className="space-y-3">
                                    <h2 className="text-base font-bold text-ink leading-7">
                                        {answer.type === "mcq" ? mcqQuestionText : answer.type === "fillInBlank" ? fillInBlankText : "Theory Question"}
                                    </h2>

                                    {/* MCQ breakdown */}
                                    {answer.type === "mcq" && (
                                        <div className="space-y-2">
                                            {mcqOptions.map((option, idx) => {
                                                const isUserChoice = String(idx) === answer.userAnswer;
                                                const isRight = idx === answer.correctIndex;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`rounded-md border p-3 text-sm flex items-center justify-between ${
                                                            isRight
                                                                ? "border-mastered bg-mastered/10 text-ink font-semibold"
                                                                : isUserChoice
                                                                ? "border-error bg-error/10 text-ink"
                                                                : "border-rule bg-paper text-ink-muted"
                                                        }`}
                                                    >
                                                        <span>{idx + 1}. {option}</span>
                                                        {isRight && <span className="text-xs text-mastered font-bold font-sans uppercase">Correct answer</span>}
                                                        {isUserChoice && !isRight && <span className="text-xs text-error font-bold font-sans uppercase">Your selection</span>}
                                                    </div>
                                                );
                                            })}
                                            {answer.explanation && (
                                                <div className="mt-3 text-xs leading-5 text-ink-muted bg-paper p-3 rounded border border-rule">
                                                    <span className="font-semibold text-accent block mb-1">Explanation</span>
                                                    {answer.explanation}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Fill in the blank breakdown */}
                                    {answer.type === "fillInBlank" && (
                                        <div className="space-y-3">
                                            <div className="text-sm font-semibold">
                                                Your answer: <span className={isCorrect ? "text-mastered font-bold" : "text-error font-bold"}>{answer.userAnswer || "(None)"}</span>
                                            </div>
                                            {!isCorrect && answer.correctAnswer && (
                                                <div className="text-sm">
                                                    Expected answer: <span className="text-mastered font-bold">{answer.correctAnswer}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Theory breakdown */}
                                    {isTheory && (
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Your response</p>
                                                <p className="text-sm leading-6 text-ink-muted bg-paper p-3 rounded-md border border-rule italic">
                                                    &ldquo;{answer.userAnswer || "(None)"}&rdquo;
                                                </p>
                                            </div>

                                            {answer.feedback && (
                                                <div className="space-y-1">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">Grading Feedback</p>
                                                    <p className="text-sm leading-6 text-ink">{answer.feedback}</p>
                                                </div>
                                            )}

                                            <div className="space-y-2 pt-2">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Rubric Matching</p>
                                                <GradedMargin
                                                    matchedKeyPoints={answer.matchedKeyPoints || []}
                                                    missedKeyPoints={answer.missedKeyPoints || []}
                                                />
                                            </div>

                                            {answer.correctAnswer && (
                                                <details className="text-xs border border-rule bg-paper p-3 rounded">
                                                    <summary className="font-semibold text-accent cursor-pointer">View Model Reference Answer</summary>
                                                    <p className="mt-2 text-sm text-ink-muted leading-6 font-sans">{answer.correctAnswer}</p>
                                                </details>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </section>
            </div>
        </main>
    );
}
