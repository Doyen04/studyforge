"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconCards, IconClipboardCheck, IconStack2, IconPencilMinus, IconMessage, IconPlayerPlay, IconArrowLeft, IconArrowRight, IconRefresh, IconTrash } from "@tabler/icons-react";
import { FlashcardViewer } from "./FlashcardViewer";
import { McqCard } from "./McqCard";
import { FillInBlankCard } from "./FillInBlankCard";
import { TheoryCard } from "./TheoryCard";
import { fetchJson } from "@/lib/queries";
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

type Tab = "flashcards" | "mcq" | "fillInBlank" | "theory" | "quizzes";

const tabs: { id: Tab; label: string; icon: typeof IconStack2 }[] = [
    { id: "flashcards", label: "Flashcards", icon: IconCards },
    { id: "mcq", label: "MCQ", icon: IconStack2 },
    { id: "fillInBlank", label: "Fill-in-blank", icon: IconPencilMinus },
    { id: "theory", label: "Theory", icon: IconMessage },
    { id: "quizzes", label: "Quizzes", icon: IconClipboardCheck },
];

export function StudySetViewer({ studySet, refresh }: { studySet: StudySetData; refresh: () => void }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("flashcards");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(studySet.title);
    const panelRef = useRef<HTMLDivElement>(null);

    const renameMutation = useMutation({
        mutationFn: (title: string) =>
            fetchJson(`/api/study-sets/${studySet.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            }),
        onSuccess: () => {
            toast.success("Study set renamed");
            refresh();
        },
    });

    const handleRename = () => {
        if (!newTitle.trim() || newTitle === studySet.title) {
            setIsEditingTitle(false);
            return;
        }
        renameMutation.mutate(newTitle);
        setIsEditingTitle(false);
    };

    const createQuizMutation = useMutation({
        mutationFn: (questionRefs: { type: QuestionType; id: string }[]) =>
            fetchJson<{ quiz: { id: string } }>("/api/quizzes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studySetId: studySet.id,
                    title: `${studySet.title} Quiz`,
                    questionRefs,
                }),
            }),
        onSuccess: (data) => {
            toast.success("Quiz created");
            router.push(`/dashboard/quizzes/${data.quiz.id}`);
        },
    });

    const now = new Date();
    const dueCount = studySet.flashcards.filter((f) => {
        if (!f.nextReviewDate) return true;
        return new Date(f.nextReviewDate) <= now;
    }).length;

    const totalQuizItems =
        studySet.mcqQuestions.length +
        studySet.fillInBlanks.length +
        studySet.theoryQuestions.length;

    const allQuestionRefs = (): { type: QuestionType; id: string }[] => {
        const refs: { type: QuestionType; id: string }[] = [];
        studySet.mcqQuestions.forEach((q) => refs.push({ type: "mcq", id: q.id }));
        studySet.fillInBlanks.forEach((q) => refs.push({ type: "fillInBlank", id: q.id }));
        studySet.theoryQuestions.forEach((q) => refs.push({ type: "theory", id: q.id }));
        return refs;
    };

    const handleCreateQuizAll = () => {
        const refs = allQuestionRefs();
        if (refs.length === 0) {
            toast.error("No questions to create a quiz from");
            return;
        }
        createQuizMutation.mutate(refs);
    };

    const handleCreateQuizFromTab = (tab: "mcq" | "fillInBlank" | "theory") => {
        const refs: { type: QuestionType; id: string }[] = [];
        if (tab === "mcq") studySet.mcqQuestions.forEach((q) => refs.push({ type: "mcq", id: q.id }));
        if (tab === "fillInBlank") studySet.fillInBlanks.forEach((q) => refs.push({ type: "fillInBlank", id: q.id }));
        if (tab === "theory") studySet.theoryQuestions.forEach((q) => refs.push({ type: "theory", id: q.id }));
        if (refs.length === 0) return;
        createQuizMutation.mutate(refs);
    };

    const setActiveTabAndScroll = (tab: Tab) => {
        setActiveTab(tab);
        setTimeout(() => {
            panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const countForTab = (tab: Tab): number => {
        switch (tab) {
            case "flashcards": return studySet.flashcards.length;
            case "mcq": return studySet.mcqQuestions.length;
            case "fillInBlank": return studySet.fillInBlanks.length;
            case "theory": return studySet.theoryQuestions.length;
            case "quizzes": return studySet.quizzes.length;
        }
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
                    {isEditingTitle ? (
                        <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={handleRename}
                            onKeyDown={(e) => e.key === "Enter" && handleRename()}
                            className="font-display text-[28px] font-semibold text-ink tracking-tight mt-1 w-full bg-transparent border-b border-accent outline-none"
                            autoFocus
                        />
                    ) : (
                        <h1 className="font-display text-[28px] font-semibold text-ink tracking-tight mt-1 cursor-pointer hover:text-accent transition" onClick={() => setIsEditingTitle(true)}>
                            {studySet.title}
                        </h1>
                    )}
                    <p className="text-sm text-ink-muted mt-1">
                        {studySet.document.filename} · {new Date(studySet.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {studySet.quizzes.length > 0 ? (
                        <Link
                            href={`/dashboard/quizzes/${studySet.quizzes[0].id}`}
                            className="flex items-center gap-1.5 rounded-md border border-rule bg-card px-4 py-2 text-sm font-semibold text-ink transition hover:bg-paper cursor-pointer  "
                        >
                            <IconArrowRight size={14} stroke={2} />
                            Start studying
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setActiveTabAndScroll("flashcards")}
                            className="flex items-center gap-1.5 rounded-md border border-rule bg-card px-4 py-2 text-sm font-semibold text-ink transition hover:bg-paper cursor-pointer  "
                        >
                            <IconArrowRight size={14} stroke={2} />
                            Start studying
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={totalQuizItems === 0 || createQuizMutation.isPending}
                        onClick={handleCreateQuizAll}
                        className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
                    >
                        <IconPlayerPlay size={14} stroke={2} />
                        {createQuizMutation.isPending ? "Creating..." : "Create a quiz"}
                    </button>
                </div>
            </div>

            {/* Tab bar */}
            <div className="border-b border-rule">
                <div className="flex gap-0 overflow-x-auto">
                    {tabs.map(({ id, label, icon: Icon }) => {
                        const count = countForTab(id);
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTabAndScroll(id)}
                                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition cursor-pointer whitespace-nowrap ${activeTab === id ? "text-accent" : "text-ink-muted hover:text-ink"
                                    }`}
                            >
                                <Icon size={16} stroke={1.5} />
                                {label}
                                <span className="font-data text-xs px-1.5 py-0.5 rounded-full bg-rule/45 text-ink-muted">
                                    {count}
                                </span>
                                {activeTab === id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab panels */}
            <div ref={panelRef} className="scroll-mt-8">
                {activeTab === "flashcards" && (
                    studySet.flashcards.length === 0 ? (
                        <div className="rounded-md border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                            No flashcards in this set.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <p className="font-display text-lg font-semibold text-ink">Flashcards</p>
                                    {dueCount > 0 ? (
                                        <p className="text-xs text-ink-muted mt-0.5">
                                            You have <span className="font-bold text-accent">{dueCount}</span> card{dueCount === 1 ? "" : "s"} due for spaced-repetition review.
                                        </p>
                                    ) : (
                                        <p className="text-xs text-ink-muted mt-0.5">All caught up! No cards currently due for review.</p>
                                    )}
                                </div>
                                <Link
                                    href={`/dashboard/study-sets/${studySet.id}/flashcards`}
                                    className={`inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold transition cursor-pointer   ${dueCount > 0
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
                    )
                )}

                {activeTab === "mcq" && (
                    studySet.mcqQuestions.length === 0 ? (
                        <div className="rounded-md border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                            No MCQ questions in this set.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-[0.07em] text-accent">Multiple Choice</p>
                                <button
                                    type="button"
                                    onClick={() => handleCreateQuizFromTab("mcq")}
                                    disabled={createQuizMutation.isPending}
                                    className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
                                >
                                    <IconPlayerPlay size={12} stroke={2} />
                                    Quiz from these
                                </button>
                            </div>
                            {studySet.mcqQuestions.map((q) => (
                                <div key={q.id} className="relative">
                                    <DeleteQuestionButton id={q.id} type="mcq" refresh={refresh} />
                                    <McqCard
                                        question={q.question}
                                        options={q.options}
                                        correctIndex={q.correctIndex}
                                        explanation={q.explanation}
                                    />
                                </div>
                            ))}
                        </div>
                    )
                )}

                {activeTab === "fillInBlank" && (
                    studySet.fillInBlanks.length === 0 ? (
                        <div className="rounded-md border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                            No fill-in-blank questions in this set.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-[0.07em] text-accent">Fill-in-the-Blank</p>
                                <button
                                    type="button"
                                    onClick={() => handleCreateQuizFromTab("fillInBlank")}
                                    disabled={createQuizMutation.isPending}
                                    className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
                                >
                                    <IconPlayerPlay size={12} stroke={2} />
                                    Quiz from these
                                </button>
                            </div>
                            {studySet.fillInBlanks.map((q) => (
                                <div key={q.id} className="relative">
                                    <DeleteQuestionButton id={q.id} type="fillInBlank" refresh={refresh} />
                                    <FillInBlankCard
                                        sentence={q.sentence}
                                        answer={q.answer}
                                        acceptableAnswers={q.acceptableAnswers}
                                    />
                                </div>
                            ))}
                        </div>
                    )
                )}

                {activeTab === "theory" && (
                    studySet.theoryQuestions.length === 0 ? (
                        <div className="rounded-md border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                            No theory questions in this set.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-[0.07em] text-accent">Theory</p>
                                <button
                                    type="button"
                                    onClick={() => handleCreateQuizFromTab("theory")}
                                    disabled={createQuizMutation.isPending}
                                    className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
                                >
                                    <IconPlayerPlay size={12} stroke={2} />
                                    Quiz from these
                                </button>
                            </div>
                            {studySet.theoryQuestions.map((q) => (
                                <div key={q.id} className="relative">
                                    <DeleteQuestionButton id={q.id} type="theory" refresh={refresh} />
                                    <TheoryCard
                                        question={q.question}
                                        referenceAnswer={q.referenceAnswer}
                                        keyPoints={q.keyPoints}
                                    />
                                </div>
                            ))}
                        </div>
                    )
                )}

                {activeTab === "quizzes" && (
                    studySet.quizzes.length === 0 ? (
                        <div className="rounded-md border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                            No quizzes yet. Create one from the button above.
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
                                    className="flex items-center justify-between rounded-md border border-rule bg-card px-5 py-4 transition hover:bg-paper  "
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
                                                className={`font-data text-lg font-semibold ${quiz.lastAttempt.score >= 70 ? "text-mastered" : "text-review"
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
                    )
                )}
            </div>
        </div>
    );
}

function DeleteQuestionButton({ id, type, refresh }: { id: string; type: QuestionType; refresh: () => void }) {
    const deleteMutation = useMutation({
        mutationFn: () => fetchJson(`/api/questions/${type}/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            toast.success("Question deleted");
            refresh();
        },
    });

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this question?")) return;
        deleteMutation.mutate();
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            className="absolute top-2 right-2 z-10 p-1.5 rounded hover:bg-paper text-ink-muted hover:text-error transition cursor-pointer"
            aria-label="Delete question"
        >
            <IconTrash size={14} />
        </button>
    );
}
