import Link from "next/link";

export function SiteHeader() {
    return (
        <header className="w-full border-b border-rule/80 bg-paper/80 backdrop-blur-sm">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <Link href="/" className="font-display text-2xl font-semibold text-ink">
                    StudyForge
                </Link>
                <nav className="flex items-center gap-6 text-sm font-semibold text-ink-muted">
                    <Link href="/" className="transition hover:text-accent">
                        Dashboard
                    </Link>
                    <Link href="/dashboard/study-sets" className="transition hover:text-accent">
                        Study sets
                    </Link>
                    <Link href="/dashboard/quizzes" className="transition hover:text-accent">
                        Quizzes
                    </Link>
                </nav>
            </div>
        </header>
    );
}
