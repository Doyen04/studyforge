"use client";

import { motion } from "motion/react";
import { Reveal } from "./Reveal";

const features = [
    {
        title: "Flashcards",
        description: "Front-and-back recall cards for key terms and concepts.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5Z" />
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            </svg>
        ),
    },
    {
        title: "Multiple choice",
        description: "Four-option questions with explanations for the correct answer.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6" />
                <path d="M9 16h6" />
                <path d="M9 20h6" />
                <path d="M4 4h16v16H4z" />
                <path d="M4 8h16" />
            </svg>
        ),
    },
    {
        title: "Fill in the blank",
        description: "Sentence-completion exercises with synonym support.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
        ),
    },
    {
        title: "Theory questions",
        description: "Open-ended questions with AI grading against a rubric.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
    },
];

export function Features() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-20">
            <Reveal>
                <h2 className="text-center font-display text-3xl font-semibold text-ink">Four question types</h2>
                <p className="mt-3 text-center text-sm text-gray-400">
                    Every study set includes all four — built from your document, not a generic question bank.
                </p>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, i) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
                        whileHover={{ y: -5, boxShadow: "0 12px 24px rgba(91,58,92,0.08)" }}
                        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow"
                    >
                        <span className="block text-accent/70 mb-4">{feature.icon}</span>
                        <h3 className="text-sm font-semibold text-ink">{feature.title}</h3>
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
