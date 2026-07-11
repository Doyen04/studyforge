"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Dashboard", active: pathname === "/dashboard" },
        { href: "/dashboard/study-sets", label: "Study sets", active: pathname.startsWith("/dashboard/study-sets") },
        { href: "/dashboard/quizzes", label: "Quizzes", active: pathname.startsWith("/dashboard/quizzes") },
        { href: "/dashboard/settings", label: "Settings", active: pathname.startsWith("/dashboard/settings") },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
                <Link href="/" className="font-display text-xl font-semibold text-ink tracking-tight">
                    StudyForge
                </Link>
                <nav className="flex items-center gap-8 text-sm">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative transition-colors ${
                                link.active
                                    ? "text-accent font-semibold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-accent"
                                    : "text-ink-muted font-medium hover:text-accent"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
