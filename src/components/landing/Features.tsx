"use client";

import { motion } from "motion/react";
import { IconBook, IconListCheck, IconPencil, IconClock } from "@tabler/icons-react";
import { Reveal } from "./Reveal";

const features = [
    {
        title: "Flashcards",
        description: "Front-and-back recall cards for key terms and concepts.",
        icon: <IconBook size={24} stroke={1.5} />,
    },
    {
        title: "Multiple choice",
        description: "Four-option questions with explanations for the correct answer.",
        icon: <IconListCheck size={24} stroke={1.5} />,
    },
    {
        title: "Fill in the blank",
        description: "Sentence-completion exercises with synonym support.",
        icon: <IconPencil size={24} stroke={1.5} />,
    },
    {
        title: "Theory questions",
        description: "Open-ended questions with AI grading against a rubric.",
        icon: <IconClock size={24} stroke={1.5} />,
    },
];

export function Features() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-20">
            <Reveal>
                <h2 className="text-center font-display text-3xl font-semibold text-ink">Four question types</h2>
                <p className="mt-3 text-center text-sm text-ink-muted">
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
                        className="rounded-xl border border-rule bg-card p-6"
                    >
                        <span className="block text-accent/70 mb-4">{feature.icon}</span>
                        <h3 className="text-sm font-semibold text-ink">{feature.title}</h3>
                        <p className="mt-2 text-sm text-ink-muted leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
