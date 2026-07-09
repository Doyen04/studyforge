import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";
import { CreateQuizPanel } from "@/components/CreateQuizPanel";

interface StudySetPageProps {
    params: Promise<{ id: string }>;
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
    return (
        <section className="rounded-lg border border-rule bg-card p-5 md:p-6">
            <div className="flex items-end justify-between gap-4">
                <h2 className="font-sans text-lg font-semibold text-ink">{title}</h2>
                <span className="font-data text-sm text-ink-muted">{count}</span>
            </div>
            <div className="mt-4 space-y-3">{children}</div>
        </section>
    );
}

export default async function StudySetPage({ params }: StudySetPageProps) {
    const { id } = await params;

    const studySet = await prisma.studySet.findUnique({
        where: { id },
        include: {
            document: true,
            flashcards: true,
            mcqQuestions: true,
            fillInBlanks: true,
            theoryQuestions: true,
            quizzes: { orderBy: { createdAt: "desc" } },
        },
    });

    if (!studySet) {
        notFound();
    }

    return (
        <main className="min-h-screen px-4 py-4 sm:px-6 md:py-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <header className="flex items-center justify-between border-b border-rule pb-4">
                    <Link href="/study-sets" className="text-sm font-semibold text-focus hover:text-focus-hover">
                        ← All study sets
                    </Link>
                    {studySet.quizzes[0] ? (
                        <Link href={`/quizzes/${studySet.quizzes[0].id}`} className="text-sm font-semibold text-focus hover:text-focus-hover">
                            Take this quiz
                        </Link>
                    ) : (
                        <span className="text-sm text-ink-muted">No quiz yet</span>
                    )}
                </header>

                <section className="rounded-lg border border-rule bg-card p-6 md:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">Study set</p>
                    <h1 className="mt-3 font-sans text-2xl font-semibold text-ink md:text-3xl">{studySet.title}</h1>
                    <p className="mt-3 text-sm leading-6 text-ink-muted">
                        {studySet.document.filename} · {studySet.document.wordCount} words · created {studySet.createdAt.toLocaleDateString()}
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-lg border border-rule bg-card p-5">
                        <div className="text-sm font-semibold text-ink">Flashcards</div>
                        <div className="mt-2 font-data text-2xl text-ink">{studySet.flashcards.length}</div>
                    </div>
                    <div className="rounded-lg border border-rule bg-card p-5">
                        <div className="text-sm font-semibold text-ink">MCQ</div>
                        <div className="mt-2 font-data text-2xl text-ink">{studySet.mcqQuestions.length}</div>
                    </div>
                    <div className="rounded-lg border border-rule bg-card p-5">
                        <div className="text-sm font-semibold text-ink">Fill-in-blank</div>
                        <div className="mt-2 font-data text-2xl text-ink">{studySet.fillInBlanks.length}</div>
                    </div>
                    <div className="rounded-lg border border-rule bg-card p-5">
                        <div className="text-sm font-semibold text-ink">Theory</div>
                        <div className="mt-2 font-data text-2xl text-ink">{studySet.theoryQuestions.length}</div>
                    </div>
                </section>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Section title="Flashcards" count={studySet.flashcards.length}>
                        {studySet.flashcards.length === 0 ? (
                            <p className="text-sm text-ink-muted">No flashcards in this set yet.</p>
                        ) : (
                            studySet.flashcards.map((card) => (
                                <details key={card.id} className="rounded-md border border-rule bg-paper p-4">
                                    <summary className="cursor-pointer font-semibold text-ink">{card.front}</summary>
                                    <p className="mt-3 text-sm leading-6 text-ink-muted">{card.back}</p>
                                </details>
                            ))
                        )}
                    </Section>

                    <Section title="Question bank" count={studySet.mcqQuestions.length + studySet.fillInBlanks.length + studySet.theoryQuestions.length}>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-focus">MCQ</h3>
                                <div className="mt-3 space-y-3">
                                    {studySet.mcqQuestions.map((question) => {
                                        const options = parseJsonArray<string>(question.options);
                                        return (
                                            <details key={question.id} className="rounded-md border border-rule bg-paper p-4">
                                                <summary className="cursor-pointer font-semibold text-ink">{question.question}</summary>
                                                <ol className="mt-3 space-y-2 text-sm leading-6 text-ink-muted">
                                                    {options.map((option, index) => (
                                                        <li key={`${question.id}-${index}`}>{index + 1}. {option}</li>
                                                    ))}
                                                </ol>
                                                <p className="mt-3 text-sm font-semibold text-mastered">Correct option: {question.correctIndex + 1}</p>
                                                <p className="mt-1 text-sm leading-6 text-ink-muted">{question.explanation}</p>
                                            </details>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-focus">Fill-in-blank</h3>
                                <div className="mt-3 space-y-3">
                                    {studySet.fillInBlanks.map((question) => {
                                        const accepted = parseJsonArray<string>(question.acceptableAnswers);
                                        return (
                                            <details key={question.id} className="rounded-md border border-rule bg-paper p-4">
                                                <summary className="cursor-pointer font-semibold text-ink">{question.sentence}</summary>
                                                <p className="mt-3 text-sm font-semibold text-mastered">Answer: {question.answer}</p>
                                                <p className="mt-1 text-sm leading-6 text-ink-muted">
                                                    Acceptable answers: {accepted.length > 0 ? accepted.join(", ") : "None"}
                                                </p>
                                            </details>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-focus">Theory</h3>
                                <div className="mt-3 space-y-3">
                                    {studySet.theoryQuestions.map((question) => {
                                        const keyPoints = parseJsonArray<string>(question.keyPoints);
                                        return (
                                            <details key={question.id} className="rounded-md border border-rule bg-paper p-4">
                                                <summary className="cursor-pointer font-semibold text-ink">{question.question}</summary>
                                                <p className="mt-3 text-sm leading-6 text-ink-muted">{question.referenceAnswer}</p>
                                                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-muted">
                                                    {keyPoints.map((keyPoint, index) => (
                                                        <li key={`${question.id}-kp-${index}`}>{keyPoint}</li>
                                                    ))}
                                                </ul>
                                            </details>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Section>
                </div>

                <CreateQuizPanel studySetId={studySet.id} studySetTitle={studySet.title} />
            </div>
        </main>
    );
}
