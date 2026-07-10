"use client";

import { useState } from "react";
import { FlashcardViewer } from "./FlashcardViewer";
import { McqCard } from "./McqCard";
import { FillInBlankCard } from "./FillInBlankCard";
import { TheoryCard } from "./TheoryCard";
import { CreateQuizPanel } from "./CreateQuizPanel";

interface Flashcard {
    id: string;
    studySetId: string;
    front: string;
    back: string;
}

interface McqQuestion {
    id: string;
    studySetId: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface FillInBlank {
    id: string;
    studySetId: string;
    sentence: string;
    answer: string;
    acceptableAnswers: string[];
}

interface TheoryQuestion {
    id: string;
    studySetId: string;
    question: string;
    referenceAnswer: string;
    keyPoints: string[];
}

interface StudySetViewerProps {
    studySet: {
        id: string;
        title: string;
        document: {
            filename: string;
            wordCount: number;
        };
        createdAt: Date;
        flashcards: Flashcard[];
        mcqQuestions: McqQuestion[];
        fillInBlanks: FillInBlank[];
        theoryQuestions: TheoryQuestion[];
    };
}

type TabType = "flashcards" | "mcq" | "fillInBlank" | "theory";

export function StudySetViewer({ studySet }: StudySetViewerProps) {
    const [activeTab, setActiveTab] = useState<TabType>("flashcards");
    const [showQuizCreator, setShowQuizCreator] = useState(false);

    const tabs = [
        { key: "flashcards" as const, label: "Flashcards", count: studySet.flashcards.length },
        { key: "mcq" as const, label: "MCQ", count: studySet.mcqQuestions.length },
        { key: "fillInBlank" as const, label: "Fill-in-Blank", count: studySet.fillInBlanks.length },
        { key: "theory" as const, label: "Theory", count: studySet.theoryQuestions.length },
    ];

    return (
        <div className="space-y-6">
            {/* Header info */}
            <section className="rounded-lg border border-rule bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-focus">Study Set</p>
                    <h1 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">{studySet.title}</h1>
                    <p className="mt-2 text-sm text-ink-muted leading-6">
                        {studySet.document.filename} · {studySet.document.wordCount} words · Created {new Date(studySet.createdAt).toLocaleDateString()}
                    </p>
                </div>
                {/* Desktop Create Quiz trigger */}
                <button
                    onClick={() => setShowQuizCreator(!showQuizCreator)}
                    className="hidden md:inline-flex cursor-pointer items-center justify-center rounded-md bg-focus hover:bg-focus-hover px-4 py-2.5 text-sm font-semibold text-white transition shrink-0"
                >
                    {showQuizCreator ? "Close quiz maker" : "Create a quiz →"}
                </button>
            </section>

            {/* Quick stats grid */}
            <section className="grid gap-3 grid-cols-2 md:grid-cols-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`rounded-lg border p-4 text-left transition select-none flex flex-col justify-between ${
                            activeTab === tab.key
                                ? "border-focus bg-focus/5 text-ink"
                                : "border-rule bg-card hover:bg-paper-hover text-ink"
                        }`}
                    >
                        <span className="text-xs font-semibold text-ink-muted">{tab.label}</span>
                        <span className="mt-2 font-data text-2xl font-bold">{tab.count}</span>
                    </button>
                ))}
            </section>

            {/* Horizontally scrollable Tab Switcher Bar */}
            <div className="border-b border-rule overflow-x-auto scrollbar-none flex">
                <div className="flex space-x-6 min-w-max px-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`py-3 text-sm font-semibold border-b-2 transition-all relative ${
                                activeTab === tab.key
                                    ? "border-focus text-focus"
                                    : "border-transparent text-ink-muted hover:text-ink"
                            }`}
                        >
                            {tab.label}
                            <span className="ml-1.5 font-data text-xs px-1.5 py-0.5 rounded-full bg-rule/45 text-ink-muted font-normal">
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content area */}
            <div className="min-h-[300px]">
                {activeTab === "flashcards" && (
                    <div className="py-6">
                        {studySet.flashcards.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                                No flashcards in this set.
                            </div>
                        ) : (
                            <FlashcardViewer cards={studySet.flashcards} />
                        )}
                    </div>
                )}

                {activeTab === "mcq" && (
                    <div className="space-y-3 py-2">
                        {studySet.mcqQuestions.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                                No MCQ questions in this set.
                            </div>
                        ) : (
                            studySet.mcqQuestions.map((q) => (
                                <McqCard
                                    key={q.id}
                                    question={q.question}
                                    options={q.options}
                                    correctIndex={q.correctIndex}
                                    explanation={q.explanation}
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === "fillInBlank" && (
                    <div className="space-y-3 py-2">
                        {studySet.fillInBlanks.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                                No Fill-in-Blank questions in this set.
                            </div>
                        ) : (
                            studySet.fillInBlanks.map((q) => (
                                <FillInBlankCard
                                    key={q.id}
                                    sentence={q.sentence}
                                    answer={q.answer}
                                    acceptableAnswers={q.acceptableAnswers}
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === "theory" && (
                    <div className="space-y-3 py-2">
                        {studySet.theoryQuestions.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                                No Theory questions in this set.
                            </div>
                        ) : (
                            studySet.theoryQuestions.map((q) => (
                                <TheoryCard
                                    key={q.id}
                                    question={q.question}
                                    referenceAnswer={q.referenceAnswer}
                                    keyPoints={q.keyPoints}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Quiz Maker Panel - rendered inline if toggled on desktop, or always visible on bottom on mobile if toggled */}
            <div className={`transition-all duration-300 ${showQuizCreator ? "block" : "hidden md:block"}`}>
                <CreateQuizPanel studySetId={studySet.id} studySetTitle={studySet.title} />
            </div>

            {/* Mobile sticky bottom Action trigger */}
            <div className="md:hidden sticky bottom-0 border-t border-rule bg-paper/95 p-4 backdrop-blur-xs flex justify-center -mx-4 -mb-4">
                <button
                    onClick={() => {
                        setShowQuizCreator(!showQuizCreator);
                        // scroll down to panel
                        if (!showQuizCreator) {
                            setTimeout(() => {
                                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                            }, 100);
                        }
                    }}
                    className="w-full cursor-pointer rounded-md bg-focus hover:bg-focus-hover px-4 py-3 text-sm font-semibold text-white transition text-center shadow-md"
                >
                    {showQuizCreator ? "Hide Quiz Maker" : "Create a quiz  →"}
                </button>
            </div>
        </div>
    );
}
