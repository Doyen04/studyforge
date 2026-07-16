"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { IconArrowLeft, IconCheck, IconCards, IconRotateDot, IconChevronRight } from "@tabler/icons-react";
import type { FlashcardData } from "@/types/domain";

interface StudySetData {
    id: string;
    title: string;
    flashcards: FlashcardData[];
}

interface FlashcardsStudyPageProps {
    params: Promise<{ id: string }>;
}

export default function FlashcardsStudyPage({ params }: FlashcardsStudyPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [studySet, setStudySet] = useState<StudySetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dueCards, setDueCards] = useState<FlashcardData[]>([]);
    const [shuffledCards, setShuffledCards] = useState<FlashcardData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [studyMode, setStudyMode] = useState<"due" | "all">("due");
    const [completed, setCompleted] = useState(false);
    const [reviewedCount, setReviewedCount] = useState(0);

    useEffect(() => {
        fetch(`/api/study-sets/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.studySet) {
                    notFound();
                    return;
                }
                setStudySet(data.studySet);

                // Filter due cards (where nextReviewDate <= now)
                const now = new Date();
                const due = data.studySet.flashcards.filter((f: FlashcardData) => {
                    if (!f.nextReviewDate) return true;
                    return new Date(f.nextReviewDate) <= now;
                });

                setDueCards(due);

                if (due.length > 0) {
                    setShuffledCards([...due].sort(() => Math.random() - 0.5));
                    setStudyMode("due");
                } else {
                    // Default to study-all mode if no due cards exist
                    setShuffledCards([...data.studySet.flashcards].sort(() => Math.random() - 0.5));
                    setStudyMode("all");
                }
            })
            .catch(() => {
                toast.error("Failed to load study set");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleStartAll = () => {
        if (!studySet) return;
        setShuffledCards([...studySet.flashcards].sort(() => Math.random() - 0.5));
        setStudyMode("all");
        setCurrentIndex(0);
        setIsFlipped(false);
        setCompleted(false);
        setReviewedCount(0);
    };

    const handleReview = async (quality: number) => {
        const currentCard = shuffledCards[currentIndex];
        setIsFlipped(false);

        // If studying due cards, record progress to API
        if (studyMode === "due") {
            try {
                const res = await fetch(`/api/flashcards/${currentCard.id}/review`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quality }),
                });
                if (!res.ok) throw new Error();
                setReviewedCount((prev) => prev + 1);
            } catch {
                toast.error("Failed to save progress, but moving to next card");
            }
        } else {
            setReviewedCount((prev) => prev + 1);
        }

        // Wait brief delay for flip transition before advancing
        setTimeout(() => {
            if (currentIndex + 1 < shuffledCards.length) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                setCompleted(true);
            }
        }, 200);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-paper flex items-center justify-center">
                <div className="w-full max-w-lg px-6 space-y-6 animate-pulse text-center">
                    <div className="h-4 w-32 bg-rule rounded mx-auto" />
                    <div className="h-8 w-64 bg-rule rounded mx-auto" />
                    <div className="h-64 bg-rule rounded-xl" />
                    <div className="h-10 w-48 bg-rule rounded mx-auto" />
                </div>
            </main>
        );
    }

    if (!studySet) return null;

    if (shuffledCards.length === 0) {
        return (
            <main className="min-h-screen bg-paper flex items-center justify-center">
                <div className="w-full max-w-md px-6 py-12 text-center bg-card border border-rule rounded-xl space-y-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rule/30 text-ink-muted">
                        <IconCards size={24} />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-ink">No Flashcards</h1>
                    <p className="text-sm text-ink-muted">There are no flashcards available to study in this set.</p>
                    <Link
                        href={`/dashboard/study-sets/${id}`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
                    >
                        <IconArrowLeft size={16} />
                        Back to study set
                    </Link>
                </div>
            </main>
        );
    }

    const currentCard = shuffledCards[currentIndex];

    return (
        <main className="min-h-screen bg-paper py-8 md:py-12">
            <div className="mx-auto max-w-xl px-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link
                        href={`/dashboard/study-sets/${id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition"
                    >
                        <IconArrowLeft size={14} />
                        Back to set
                    </Link>
                    <span className="font-data text-xs text-ink-muted">
                        {studyMode === "due" ? "Spaced-Repetition Study" : "Study All Cards"}
                    </span>
                </div>

                {!completed ? (
                    <>
                        {/* Title and Progress */}
                        <div className="space-y-2">
                            <h1 className="font-display text-xl font-bold text-ink tracking-tight line-clamp-1">{studySet.title}</h1>
                            <div className="flex items-center justify-between text-xs text-ink-muted font-semibold">
                                <span>Card {currentIndex + 1} of {shuffledCards.length}</span>
                                <span>{Math.round((currentIndex / shuffledCards.length) * 100)}% complete</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-rule overflow-hidden">
                                <div
                                    className="h-full bg-accent transition-all duration-300"
                                    style={{ width: `${(currentIndex / shuffledCards.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Card Flip Component */}
                        <div
                            onClick={() => setIsFlipped((prev) => !prev)}
                            className="relative h-72 md:h-80 w-full cursor-pointer [perspective:1000px] group"
                        >
                            <div
                                className="relative h-full w-full rounded-xl border border-rule transition-transform duration-500 [transform-style:preserve-3d] shadow-[0_1px_2px_rgba(32,28,26,.05),0_8px_20px_-10px_rgba(32,28,26,.14)] bg-card"
                                style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                            >
                                {/* Front Face */}
                                <div className="absolute inset-0 h-full w-full p-6 md:p-8 flex flex-col justify-between [backface-visibility:hidden]">
                                    <span className="font-data text-[10px] uppercase tracking-wider text-accent font-bold">Front</span>
                                    <div className="flex-1 flex items-center justify-center text-center">
                                        <p className="font-sans text-base md:text-lg font-medium text-ink leading-relaxed">
                                            {currentCard.front}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-ink-muted text-center italic">Click card to reveal answer</span>
                                </div>

                                {/* Back Face */}
                                <div
                                    className="absolute inset-0 h-full w-full p-6 md:p-8 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]"
                                >
                                    <span className="font-data text-[10px] uppercase tracking-wider text-accent font-bold">Back</span>
                                    <div className="flex-1 flex items-center justify-center text-center overflow-y-auto my-2">
                                        <p className="font-sans text-base md:text-lg font-medium text-ink leading-relaxed">
                                            {currentCard.back}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-ink-muted text-center italic">Click card to see front</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="min-h-16">
                            <AnimatePresence mode="wait">
                                {!isFlipped ? (
                                    <motion.button
                                        key="reveal-btn"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        onClick={() => setIsFlipped(true)}
                                        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-accent hover:bg-accent-hover py-3 text-sm font-semibold text-white shadow transition cursor-pointer"
                                    >
                                        Reveal Answer
                                        <IconChevronRight size={16} />
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        key="ratings-container"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-3"
                                    >
                                        <p className="text-center text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                                            How well did you know this?
                                        </p>
                                        <div className="grid grid-cols-4 gap-2">
                                            <button
                                                onClick={() => handleReview(0)}
                                                className="flex flex-col items-center justify-center py-2.5 rounded-lg bg-error/10 hover:bg-error/15 border border-error/20 text-error transition font-semibold cursor-pointer"
                                            >
                                                <span className="text-[10px] font-bold tracking-wider uppercase font-data">Again</span>
                                                <span className="text-xs font-semibold mt-0.5">Forget</span>
                                            </button>
                                            <button
                                                onClick={() => handleReview(2)}
                                                className="flex flex-col items-center justify-center py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 transition font-semibold cursor-pointer"
                                            >
                                                <span className="text-[10px] font-bold tracking-wider uppercase font-data">Hard</span>
                                                <span className="text-xs font-semibold mt-0.5">Struggled</span>
                                            </button>
                                            <button
                                                onClick={() => handleReview(4)}
                                                className="flex flex-col items-center justify-center py-2.5 rounded-lg bg-mastered/10 hover:bg-mastered/15 border border-mastered/20 text-mastered transition font-semibold cursor-pointer"
                                            >
                                                <span className="text-[10px] font-bold tracking-wider uppercase font-data">Good</span>
                                                <span className="text-xs font-semibold mt-0.5">Recalled</span>
                                            </button>
                                            <button
                                                onClick={() => handleReview(5)}
                                                className="flex flex-col items-center justify-center py-2.5 rounded-lg bg-accent/10 hover:bg-accent/15 border border-accent/20 text-accent transition font-semibold cursor-pointer"
                                            >
                                                <span className="text-[10px] font-bold tracking-wider uppercase font-data">Easy</span>
                                                <span className="text-xs font-semibold mt-0.5">Instant</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    /* Completed Screen */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-xl border border-rule bg-card p-6 md:p-8 text-center space-y-6 shadow-[0_1px_2px_rgba(32,28,26,.05),0_8px_20px_-10px_rgba(32,28,26,.14)]"
                    >
                        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-mastered/10 text-mastered">
                            <IconCheck size={24} stroke={2.5} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="font-display text-2xl font-bold text-ink">Session Complete!</h2>
                            <p className="text-sm text-ink-muted leading-relaxed">
                                {studyMode === "due"
                                    ? `Incredible! You've successfully reviewed and rated all ${shuffledCards.length} due flashcards in this set. Your next review intervals have been updated.`
                                    : `Great work! You've completed reviewing all ${shuffledCards.length} flashcards in this set.`}
                            </p>
                        </div>
                        <div className="h-px bg-rule/50" />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href={`/dashboard/study-sets/${id}`}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md bg-accent hover:bg-accent-hover px-5 py-2 text-sm font-semibold text-white transition cursor-pointer"
                            >
                                <IconArrowLeft size={16} />
                                Back to Study Set
                            </Link>
                            {studyMode === "due" && studySet.flashcards.length > dueCards.length && (
                                <button
                                    onClick={handleStartAll}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-rule bg-paper hover:bg-paper-hover px-5 py-2 text-sm font-semibold text-ink transition cursor-pointer"
                                >
                                    <IconRotateDot size={16} />
                                    Study All Cards
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
