"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

export function Nav() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-sm border-b border-rule" : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="font-display text-xl font-semibold text-ink tracking-tight">
                    StudyForge
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-muted">
                    <Link href="/dashboard" className="transition-colors hover:text-accent">
                        Dashboard
                    </Link>
                    <Link href="/dashboard/study-sets" className="transition-colors hover:text-accent">
                        Study sets
                    </Link>
                    <Link href="/dashboard/quizzes" className="transition-colors hover:text-accent">
                        Quizzes
                    </Link>
                </nav>
                <Link
                    href="/dashboard"
                    className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white!  transition-all hover:bg-accent-hover  active:scale-[0.97]"
                >
                    Get started
                </Link>
            </div>
        </motion.header>
    );
}
