"use client";

import Link from "next/link";
import { motion } from "motion/react";

const blobs = [
    { width: 400, height: 400, top: "-10%", left: "-8%", bg: "bg-accent/5", delay: 0 },
    { width: 500, height: 500, top: "5%", right: "-12%", bg: "bg-mastered/5", delay: 1.5 },
    { width: 300, height: 300, bottom: "5%", left: "35%", bg: "bg-accent/5", delay: 3 },
];

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
            {blobs.map((blob, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${blob.bg} blur-3xl pointer-events-none`}
                    style={{ width: blob.width, height: blob.height, top: blob.top, left: blob.left, right: blob.right, bottom: blob.bottom }}
                    animate={{ y: [0, -24, 0] }}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: blob.delay }}
                />
            ))}

            <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="font-display text-5xl font-semibold text-ink tracking-tight sm:text-6xl lg:text-7xl"
                >
                    Turn your notes into
                    <br />
                    <span className="bg-linear-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                        active recall
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted leading-relaxed"
                >
                    Upload your slides, documents, or PDFs. StudyForge generates flashcards, quizzes, and written
                    questions — then grades your answers so you know exactly what you have down and what needs work.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                    className="mt-10 flex items-center justify-center gap-4"
                >
                    <Link
                        href="/dashboard"
                        className="rounded-lg bg-accent px-8 py-3 text-sm font-medium text-white!  transition-all hover:bg-accent-hover  active:scale-[0.97]"
                    >
                        Get started
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="rounded-lg border border-rule px-8 py-3 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent active:scale-[0.97]"
                    >
                        How it works
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
