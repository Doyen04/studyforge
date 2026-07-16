"use client";

import { useCallback, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconCheck, IconArrowLeft, IconArrowRight, IconPlayerPlay, IconStack2, IconClipboardCheck, IconRefresh, IconCards } from "@tabler/icons-react";
import { FlashcardViewer } from "./FlashcardViewer";
import { McqCard } from "./McqCard";
import { FillInBlankCard } from "./FillInBlankCard";
import { TheoryCard } from "./TheoryCard";
import type { FlashcardData, McqQuestionData, FillInBlankData, TheoryQuestionData, QuestionType } from "@/types/domain";

interface QuizSummary {
    id: string;
    title: string;
    createdAt: Date;
    attemptCount: number;
    lastAttempt: { id: string; score: number; completedAt: Date } | null;
}

export interface StudySetData {
    id: string;
    title: string;
    document: { filename: string; wordCount: number };
    createdAt: Date;
    flashcards: FlashcardData[];
    mcqQuestions: McqQuestionData[];
    fillInBlanks: FillInBlankData[];
    theoryQuestions: TheoryQuestionData[];
    quizzes: QuizSummary[];
}

export function StudySetViewer({ studySet }: { studySet: StudySetData }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"questions" | "quizzes">("questions");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [creating, setCreating] = useState(false);
    const questionsRef = useRef<HTMLDivElement>(null);

    const now = new Date();
    const dueCount = studySet.flashcards.filter((f) => {
        if (!f.nextReviewDate) return true;
        return new Date(f.nextReviewDate) <= now;
    }).length;

    const totalQuizItems =
        studySet.mcqQuestions.length +
        studySet.fillInBlanks.length +
        studySet.theoryQuestions.length;

    const toggleSelect = useCallback((id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const selectAll = useCallback(() => {
        const all = new Set<string>();
        studySet.mcqQuestions.forEach((q) => all.add(q.id));
        studySet.fillInBlanks.forEach((q) => all.add(q.id));
        studySet.theoryQuestions.forEach((q) => all.add(q.id));
        setSelected(all);
    }, [studySet.mcqQuestions, studySet.fillInBlanks, studySet.theoryQuestions]);

    const clearSelection = useCallback(() => setSelected(new Set()), []);

    const handleCreateQuiz = async () => {
        if (selected.size === 0) return;
        setCreating(true);
        const questionRefs: { type: QuestionType; id: string }[] = [];
        studySet.mcqQuestions.forEach((q) => { if (selected.has(q.id)) questionRefs.push({ type: "mcq", id: q.id }); });
        studySet.fillInBlanks.forEach((q) => { if (selected.has(q.id)) questionRefs.push({ type: "fillInBlank", id: q.id }); });
        studySet.theoryQuestions.forEach((q) => { if (selected.has(q.id)) questionRefs.push({ type: "theory", id: q.id }); });

        try {
            const res = await fetch("/api/quizzes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studySetId: studySet.id,
                    title: `${studySet.title} Quiz`,
                    questionRefs,
                }),
            });
            if (!res.ok) throw new Error("Failed to create quiz");
            const data = await res.json();
            toast.success("Quiz created");
            setSelected(new Set());
            router.push(`/dashboard/quizzes/${data.quiz.id}`);
        } catch {
            toast.error("Failed to create quiz");
        } finally {
            setCreating(false);
        }
    };

    const scrollToQuestions = () => {
        setActiveTab("questions");
        setTimeout(() => {
            questionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    return (
        <div className="space-y-8">
            {/* Pagehead */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                    <Link
                        href="/dashboard/study-sets"
                        className="mb-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-muted hover:text-ink transition"
                    >
                        <IconArrowLeft size={14} stroke={2} />
                        Back to study sets
                    </Link>
                    <h1 className="font-display text-[28px] font-semibold text-ink tracking-tight mt-1">{studySet.title}</h1>
                    <p className="text-sm text-ink-muted mt-1">
                        {studySet.document.filename} · {new Date(studySet.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {studySet.quizzes.length > 0 ? (
                        <Link
                            href={`/dashboard/quizzes/${studySet.quizzes[0].id}`}
                            className="flex items-center gap-1.5 rounded-md border border-rule bg-card px-4 py-2 text-sm font-semibold text-ink transition hover:bg-paper"
                        >
                            <IconArrowRight size={14} stroke={2} />
                            Start studying
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={scrollToQuestions}
                            className="flex items-center gap-1.5 rounded-md border border-rule bg-card px-4 py-2 text-sm font-semibold text-ink transition hover:bg-paper cursor-pointer"
                        >
                            <IconArrowRight size={14} stroke={2} />
                            Start studying
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={totalQuizItems === 0}
                        onClick={scrollToQuestions}
                        className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
                    >
                        <IconPlayerPlay size={14} stroke={2} />
                        Create a quiz
                    </button>
                </div>
            </div>

            {/* Tab bar */}
            <div className="border-b border-rule">
                <div className="flex gap-0">
                    <button
                        onClick={() => setActiveTab("questions")}
                        className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition cursor-pointer ${
                            activeTab === "questions" ? "text-accent" : "text-ink-muted hover:text-ink"
                        }`}
                    >
                        <IconStack2 size={16} stroke={1.5} />
                        Questions
                        <span className="font-data text-xs px-1.5 py-0.5 rounded-full bg-rule/45 text-ink-muted">
                            {totalQuizItems}
                        </span>
                        {activeTab === "questions" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("quizzes")}
                        className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition cursor-pointer ${
                            activeTab === "quizzes" ? "text-accent" : "text-ink-muted hover:text-ink"
                        }`}
                    >
                        <IconClipboardCheck size={16} stroke={1.5} />
                        Quizzes
                        <span className="font-data text-xs px-1.5 py-0.5 rounded-full bg-rule/45 text-ink-muted">
                            {studySet.quizzes.length}
                        </span>
                        {activeTab === "quizzes" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
                    </button>
                </div>
            </div>

            {/* Questions tab */}
            {activeTab === "questions" && (
                <div ref={questionsRef} className="scroll-mt-8">
                    {totalQuizItems === 0 ? (
                        <div className="rounded-md border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                            No quiz questions in this set.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {studySet.mcqQuestions.length > 0 && (
                                <div>
                                    <p className="text-[13px] font-semibold text-ink-muted px-1 mb-2">Multiple Choice</p>
                                    {studySet.mcqQuestions.map((q) => (
                                        <QuestionCard
                                            key={q.id}
                                            id={q.id}
                                            selected={selected.has(q.id)}
                                            onToggle={toggleSelect}
                                        >
                                            <McqCard
                                                question={q.question}
                                                options={q.options}
                                                correctIndex={q.correctIndex}
                                                explanation={q.explanation}
                                            />
                                        </QuestionCard>
                                    ))}
                                </div>
                            )}
                            {studySet.fillInBlanks.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-[13px] font-semibold text-ink-muted px-1 mb-2">Fill-in-the-Blank</p>
                                    {studySet.fillInBlanks.map((q) => (
                                        <QuestionCard
                                            key={q.id}
                                            id={q.id}
                                            selected={selected.has(q.id)}
                                            onToggle={toggleSelect}
                                        >
                                            <FillInBlankCard
                                                sentence={q.sentence}
                                                answer={q.answer}
                                                acceptableAnswers={q.acceptableAnswers}
                                            />
                                        </QuestionCard>
                                    ))}
                                </div>
                            )}
                            {studySet.theoryQuestions.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-[13px] font-semibold text-ink-muted px-1 mb-2">Theory</p>
                                    {studySet.theoryQuestions.map((q) => (
                                        <QuestionCard
                                            key={q.id}
                                            id={q.id}
                                            selected={selected.has(q.id)}
                                            onToggle={toggleSelect}
                                        >
                                            <TheoryCard
                                                question={q.question}
                                                referenceAnswer={q.referenceAnswer}
                                                keyPoints={q.keyPoints}
                                            />
                                        </QuestionCard>
                                    ))}
                                </div>
                            )}

                            {/* Flashcards section (not quiz-able, no checkboxes) */}
                            {studySet.flashcards.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-rule space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <p className="font-display text-lg font-semibold text-ink">Flashcards</p>
                                            {dueCount > 0 ? (
                                                <p className="text-xs text-ink-muted mt-0.5">
                                                    You have <span className="font-bold text-accent">{dueCount}</span> card{dueCount === 1 ? "" : "s"} due for spaced-repetition review.
                                                </p>
                                            ) : (
                                                <p className="text-xs text-ink-muted mt-0.5">
                                                    All caught up! No cards currently due for review.
                                                </p>
                                            )}
                                        </div>
                                        <Link
                                            href={`/dashboard/study-sets/${studySet.id}/flashcards`}
                                            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold shadow-sm transition cursor-pointer ${
                                                dueCount > 0
                                                    ? "bg-accent text-white hover:bg-accent-hover"
                                                    : "border border-rule bg-card text-ink hover:bg-paper"
                                            }`}
                                        >
                                            {dueCount > 0 ? <IconRefresh size={14} stroke={2} /> : <IconCards size={14} stroke={2} />}
                                            {dueCount > 0 ? `Review Due Cards (${dueCount})` : "Study All Cards"}
                                        </Link>
                                    </div>
                                    <FlashcardViewer cards={studySet.flashcards} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sticky selection bar */}
                    {selected.size > 0 && (
                        <div className="sticky bottom-0 z-20 -mx-6 mt-6 border-t border-rule bg-card px-6 py-3 shadow-[0_-4px_12px_rgba(32,28,26,.08)] dark:shadow-[0_-4px_12px_rgba(0,0,0,.3)]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-ink">{selected.size} question{selected.size !== 1 ? "s" : ""} selected</span>
                                    <button
                                        type="button"
                                        onClick={clearSelection}
                                        className="text-xs font-semibold text-ink-muted hover:text-ink transition cursor-pointer"
                                    >
                                        Clear selection
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCreateQuiz}
                                        disabled={creating}
                                        className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
                                    >
                                        <IconPlayerPlay size={14} stroke={2} />
                                        {creating ? "Creating..." : `Create Quiz (${selected.size} questions)`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Quizzes tab */}
            {activeTab === "quizzes" && (
                <div>
                    {studySet.quizzes.length === 0 ? (
                        <div className="rounded-md border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                            No quizzes yet. Select questions and create one.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {studySet.quizzes.map((quiz) => (
                                <Link
                                    key={quiz.id}
                                    href={
                                        quiz.lastAttempt
                                            ? `/dashboard/quizzes/${quiz.id}/results/${quiz.lastAttempt.id}`
                                            : `/dashboard/quizzes/${quiz.id}`
                                    }
                                    className="flex items-center justify-between rounded-md border border-rule bg-card px-5 py-4 transition hover:bg-paper"
                                >
                                    <div>
                                        <p className="font-display text-[17px] font-semibold text-ink">{quiz.title}</p>
                                        <p className="text-xs text-ink-muted mt-0.5">
                                            {new Date(quiz.createdAt).toLocaleDateString()} · {quiz.attemptCount} attempt{quiz.attemptCount !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {quiz.lastAttempt && (
                                            <span
                                                className={`font-data text-lg font-semibold ${
                                                    quiz.lastAttempt.score >= 70 ? "text-mastered" : "text-review"
                                                }`}
                                            >
                                                {quiz.lastAttempt.score}%
                                            </span>
                                        )}
                                        <span className="text-accent text-sm font-semibold">
                                            {quiz.lastAttempt ? "View results →" : "Take quiz →"}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function QuestionCard({
    id,
    selected,
    onToggle,
    children,
}: {
    id: string;
    selected: boolean;
    onToggle: (id: string) => void;
    children: React.ReactNode;
}) {
    return (
        <div className={`relative rounded-md border transition ${
            selected ? "border-accent bg-wine-tint/30" : "border-rule bg-card"
        }`}>
            <button
                type="button"
                onClick={() => onToggle(id)}
                className={`absolute top-3 left-3 z-10 flex h-5 w-5 items-center justify-center rounded border transition cursor-pointer ${
                    selected
                        ? "border-accent bg-accent text-white"
                        : "border-rule bg-card text-transparent hover:border-ink-muted"
                }`}
                aria-label={selected ? "Deselect question" : "Select question"}
            >
                {selected && <IconCheck size={12} stroke={3} />}
            </button>
            <div className="pl-10 pr-4 py-3">
                {children}
            </div>
        </div>
    );
}
