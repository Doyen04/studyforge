"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function CTA() {
    return (
        <section className="bg-linear-to-r from-accent via-accent to-accent-hover">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mx-auto max-w-7xl px-6 py-20 text-center"
            >
                <h2 className="font-display text-3xl font-semibold text-white">Ready to study smarter?</h2>
                <p className="mt-3 text-sm text-white/70 max-w-xl mx-auto">
                    Upload your first document and let AI build a complete study set in seconds.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-8 inline-block rounded-lg border border-white/30 bg-white px-8 py-3 text-sm font-medium text-accent  transition-all hover:bg-white/90  active:scale-[0.97]"
                >
                    Go to dashboard
                </Link>
            </motion.div>
        </section>
    );
}
