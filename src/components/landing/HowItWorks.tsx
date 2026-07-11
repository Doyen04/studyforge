"use client";

import { motion } from "motion/react";
import { Reveal } from "./Reveal";

const steps = [
    {
        number: "1",
        title: "Upload your material",
        description: "Drop a PDF, DOCX, or PPTX. StudyForge reads and chunks it automatically.",
    },
    {
        number: "2",
        title: "AI generates questions",
        description: "Flashcards, multiple-choice, fill-in-the-blanks, and theory questions — built from your document.",
    },
    {
        number: "3",
        title: "Practice and track",
        description: "Take quizzes, review flashcards, and get AI-graded feedback on written answers.",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="border-t border-gray-100 bg-gray-50/50">
            <div className="mx-auto max-w-7xl px-6 py-20">
                <Reveal>
                    <h2 className="text-center font-display text-3xl font-semibold text-ink">How it works</h2>
                </Reveal>
                <div className="mt-14 grid gap-8 md:grid-cols-3">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                            whileHover={{ y: -3 }}
                            className="text-center rounded-xl bg-white p-8 border border-gray-100 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent font-semibold text-lg">
                                {step.number}
                            </div>
                            <h3 className="mt-5 text-base font-semibold text-ink">{step.title}</h3>
                            <p className="mt-2 text-sm text-gray-400 leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
