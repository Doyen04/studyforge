import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/deserialize";

interface QuizPageProps {
    params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
    const { id } = await params;

    const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: {
            studySet: {
                include: { mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
            },
        },
    });

    if (!quiz) {
        notFound();
    }

    const refs = parseJsonArray<{ type: "mcq" | "fillInBlank" | "theory"; id: string }>(quiz.questionRefs);

    const questions = refs
        .map((ref) => {
            if (ref.type === "mcq") {
                const question = quiz.studySet.mcqQuestions.find((item) => item.id === ref.id);
                if (!question) {
                    return null;
                }

                return {
                    type: "mcq" as const,
                    id: question.id,
                    question: question.question,
                    options: parseJsonArray<string>(question.options),
                    correctIndex: question.correctIndex,
                };
            }

            if (ref.type === "fillInBlank") {
                const question = quiz.studySet.fillInBlanks.find((item) => item.id === ref.id);
                if (!question) {
                    return null;
                }

                return {
                    type: "fillInBlank" as const,
                    id: question.id,
                    sentence: question.sentence,
                    answer: question.answer,
                    acceptableAnswers: parseJsonArray<string>(question.acceptableAnswers),
                };
            }

            const question = quiz.studySet.theoryQuestions.find((item) => item.id === ref.id);
            if (!question) {
                return null;
            }

            return {
                type: "theory" as const,
                id: question.id,
                question: question.question,
                referenceAnswer: question.referenceAnswer,
                keyPoints: parseJsonArray<string>(question.keyPoints),
            };
        })
        .filter((question): question is NonNullable<typeof question> => question !== null);

    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <section className="rounded-4xl border border-rule bg-card p-8 shadow-[0_16px_40px_rgba(27,31,29,0.06)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-focus">Quiz</p>
                    <h1 className="mt-3 font-display text-4xl text-ink">{quiz.title}</h1>
                    <p className="mt-4 text-sm leading-6 text-ink/70">{questions.length} questions ready to take.</p>
                </section>

                <section className="space-y-4">
                    {questions.map((question, index) => (
                        <article key={question.id} className="rounded-4xl border border-rule bg-card p-6">
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-focus">
                                Question {index + 1} / {questions.length}
                            </div>
                            <h2 className="mt-3 text-xl font-semibold text-ink">
                                {question.type === "mcq" ? question.question : question.type === "fillInBlank" ? question.sentence : question.question}
                            </h2>

                            {question.type === "mcq" ? (
                                <ol className="mt-4 space-y-2 text-sm leading-6 text-ink/75">
                                    {question.options.map((option, optionIndex) => (
                                        <li key={`${question.id}-${optionIndex}`} className="rounded-2xl border border-rule bg-paper px-4 py-3">
                                            {optionIndex + 1}. {option}
                                        </li>
                                    ))}
                                </ol>
                            ) : question.type === "fillInBlank" ? (
                                <p className="mt-4 text-sm text-ink/70">Answer: {question.answer}</p>
                            ) : (
                                <div className="mt-4 space-y-3 text-sm leading-6 text-ink/75">
                                    <p>{question.referenceAnswer}</p>
                                    <ul className="list-disc space-y-2 pl-5">
                                        {question.keyPoints.map((keyPoint, keyIndex) => (
                                            <li key={`${question.id}-kp-${keyIndex}`}>{keyPoint}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}
