"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronDown } from "@tabler/icons-react";
import { Reveal } from "./Reveal";

const faqs = [
    {
        q: "What file formats can I upload?",
        a: "StudyForge supports PDF, DOCX, and PPTX files. Documents must contain at least 30 words of readable text to be processed.",
    },
    {
        q: "How many questions does a study set include?",
        a: "Each study set contains flashcards, multiple-choice questions, fill-in-the-blank exercises, and theory questions. The exact count depends on your document length — roughly 4 questions per ~3000-word chunk.",
    },
    {
        q: "Can I choose which question types to include in a quiz?",
        a: "Yes. When creating a quiz, you can select exactly which question types (MCQ, fill-in-the-blank, theory) to include and how many of each.",
    },
    {
        q: "How does AI grading work for theory questions?",
        a: "Your answer is compared against the reference answer and key points generated when the study set was created. The AI checks for conceptual coverage, not exact wording, and returns a score with matched and missed key points.",
    },
    {
        q: "Is there a cost to use StudyForge?",
        a: "StudyForge is free to use during the preview period. Each API call to generate study sets or grade theory answers uses Google Gemini, which is covered at no charge to you.",
    },
    {
        q: "Where is my data stored?",
        a: "Uploaded documents, generated study sets, and quiz attempts are stored in a PostgreSQL database hosted on Neon. Document text is sent to Google Gemini for AI processing but is not retained by Gemini after each request.",
    },
];

function ChevronDownIcon({ open }: { open: boolean }) {
    return (
        <IconChevronDown
            size={16}
            className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
    );
}

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="mx-auto max-w-3xl px-6 py-20">
            <Reveal>
                <h2 className="text-center font-display text-3xl font-semibold text-ink">Frequently asked questions</h2>
                <p className="mt-3 text-center text-sm text-ink-muted">
                    Everything you need to know about StudyForge.
                </p>
            </Reveal>
            <div className="mt-12 space-y-3">
                {faqs.map((faq, i) => (
                    <motion.div
                        key={faq.q}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                        className="rounded-lg border border-rule bg-card"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-ink transition hover:text-accent cursor-pointer"
                        >
                            {faq.q}
                            <ChevronDownIcon open={openIndex === i} />
                        </button>
                        <AnimatePresence>
                            {openIndex === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <p className="border-t border-rule px-5 py-4 text-sm leading-6 text-ink-muted">
                                        {faq.a}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
