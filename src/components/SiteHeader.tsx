"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/study-sets", label: "Study sets" },
    { href: "/dashboard/quizzes", label: "Quizzes" },
    { href: "/dashboard/documents", label: "Documents" },
    { href: "/dashboard/settings", label: "Settings" },
];

export function SiteHeader() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    function isActive(href: string) {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-rule bg-card">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
                <Link href="/" className="font-display text-xl font-semibold text-ink tracking-tight">
                    StudyForge
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative transition-colors ${
                                isActive(link.href)
                                    ? "text-accent font-semibold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-accent"
                                    : "text-ink-muted font-medium hover:text-accent"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="md:hidden flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-rule hover:text-ink transition cursor-pointer"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile nav panel */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-rule md:hidden"
                    >
                        <div className="flex flex-col gap-1 px-6 py-4">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`rounded-md px-3 py-2.5 text-sm transition-colors ${
                                        isActive(link.href)
                                            ? "bg-accent/5 text-accent font-semibold"
                                            : "text-ink-muted font-medium hover:bg-paper-hover hover:text-ink"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}
