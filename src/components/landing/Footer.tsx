import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-gray-100">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-sm text-gray-400">
                <span className="font-display text-base font-semibold text-ink">StudyForge</span>
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="transition-colors hover:text-accent">
                        Dashboard
                    </Link>
                    <Link href="/dashboard/study-sets" className="transition-colors hover:text-accent">
                        Study sets
                    </Link>
                    <Link href="/dashboard/quizzes" className="transition-colors hover:text-accent">
                        Quizzes
                    </Link>
                </div>
            </div>
        </footer>
    );
}
