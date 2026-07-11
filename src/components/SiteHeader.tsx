import Link from "next/link";

export function SiteHeader() {
    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
                <Link href="/" className="font-display text-xl font-semibold text-ink tracking-tight">
                    StudyForge
                </Link>
                <nav className="flex items-center gap-8 text-sm font-medium text-ink-muted">
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
            </div>
        </header>
    );
}
