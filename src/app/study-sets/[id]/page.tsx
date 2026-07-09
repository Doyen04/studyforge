import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";

interface StudySetPageProps {
    params: Promise<{ id: string }>;
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
        },
    });

    if (!studySet) {
        notFound();
    }

    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <section className="rounded-4xl border border-rule bg-card p-8 shadow-[0_16px_40px_rgba(27,31,29,0.06)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-focus">Study set</p>
                    <h1 className="mt-3 font-display text-4xl text-ink">{studySet.title}</h1>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/70">
                        Source file: {studySet.document.filename} • {studySet.document.wordCount} words • created {studySet.createdAt.toLocaleDateString()}
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <article className="rounded-3xl border border-rule bg-card p-6">
                        <h2 className="text-lg font-semibold text-ink">Flashcards</h2>
                        <p className="mt-2 text-sm leading-6 text-ink/70">{studySet.flashcards.length} cards ready for flip-based review.</p>
                    </article>
                    <article className="rounded-3xl border border-rule bg-card p-6">
                        <h2 className="text-lg font-semibold text-ink">MCQ</h2>
                        <p className="mt-2 text-sm leading-6 text-ink/70">{studySet.mcqQuestions.length} multiple-choice questions with explanations.</p>
                    </article>
                    <article className="rounded-3xl border border-rule bg-card p-6">
                        <h2 className="text-lg font-semibold text-ink">Fill in the blank</h2>
                        <p className="mt-2 text-sm leading-6 text-ink/70">{studySet.fillInBlanks.length} recall prompts with accepted answers.</p>
                    </article>
                    <article className="rounded-3xl border border-rule bg-card p-6">
                        <h2 className="text-lg font-semibold text-ink">Theory</h2>
                        <p className="mt-2 text-sm leading-6 text-ink/70">{studySet.theoryQuestions.length} rubric-based responses with key points.</p>
                    </article>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-4xl border border-rule bg-card p-6">
                        <h2 className="font-display text-2xl text-ink">Flashcards</h2>
                        <div className="mt-4 space-y-3">
                            {studySet.flashcards.map((flashcard) => (
                                <details key={flashcard.id} className="rounded-3xl border border-rule bg-paper p-4">
                                    <summary className="cursor-pointer font-semibold text-ink">{flashcard.front}</summary>
                                    <p className="mt-3 text-sm leading-6 text-ink/75">{flashcard.back}</p>
                                </details>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-4xl border border-rule bg-card p-6">
                        <h2 className="font-display text-2xl text-ink">Question bank</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-focus">MCQ</h3>
                                <div className="mt-3 space-y-3">
                                    {studySet.mcqQuestions.map((question) => {
                                        const options = parseJsonArray<string>(question.options);
                                        return (
                                            <details key={question.id} className="rounded-3xl border border-rule bg-paper p-4">
                                                <summary className="cursor-pointer font-semibold text-ink">{question.question}</summary>
                                                <ol className="mt-3 space-y-2 text-sm leading-6 text-ink/75">
                                                    {options.map((option, index) => (
                                                        <li key={`${question.id}-${index}`}>{index + 1}. {option}</li>
                                                    ))}
                                                </ol>
                                                <p className="mt-3 text-sm text-mastered">Correct option: {question.correctIndex + 1}</p>
                                                <p className="mt-1 text-sm leading-6 text-ink/70">{question.explanation}</p>
                                            </details>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-focus">Fill in the blank</h3>
                                <div className="mt-3 space-y-3">
                                    {studySet.fillInBlanks.map((question) => {
                                        const accepted = parseJsonArray<string>(question.acceptableAnswers);
                                        return (
                                            <details key={question.id} className="rounded-3xl border border-rule bg-paper p-4">
                                                <summary className="cursor-pointer font-semibold text-ink">{question.sentence}</summary>
                                                <p className="mt-3 text-sm text-mastered">Answer: {question.answer}</p>
                                                <p className="mt-1 text-sm leading-6 text-ink/70">
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
                                            <details key={question.id} className="rounded-3xl border border-rule bg-paper p-4">
                                                <summary className="cursor-pointer font-semibold text-ink">{question.question}</summary>
                                                <p className="mt-3 text-sm leading-6 text-ink/75">{question.referenceAnswer}</p>
                                                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-ink/70">
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
                    </div>
                </section>
            </div>
        </main>
    );
}