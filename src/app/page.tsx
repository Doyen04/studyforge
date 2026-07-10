import Link from "next/link";
// import { ArrowRight } from "lucide-react"; // Wait, is lucide-react installed? I'll check or not use it. Let's just use a plain arrow '→' to be safe.

export default function LandingPage() {
    return (
        <main className="min-h-screen px-4 py-12 sm:px-6 md:py-24 lg:px-8 bg-paper flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background motif — card fan, quiet and non-interactive */}
            <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 opacity-30 sm:opacity-50">
                <div className="relative w-[300px] h-[400px]">
                    {[-12, -4, 6, 14].map((deg, i) => (
                        <div
                            key={i}
                            className="absolute left-1/2 top-1/2 h-72 w-52 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-rule bg-card/40"
                            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
                        />
                    ))}
                </div>
            </div>

            <div className="mx-auto w-full max-w-2xl text-center space-y-10">
                <div className="space-y-6">
                    <p className="font-data text-sm font-semibold uppercase tracking-widest text-focus">
                        StudyForge
                    </p>
                    <h1 className="font-display text-4xl font-medium text-ink md:text-6xl text-balance">
                        Turn course material into active-recall practice.
                    </h1>
                    <p className="font-sans text-lg text-ink-muted text-balance mx-auto max-w-lg">
                        Upload your slide decks, documents, and PDFs. Get instantly generated flashcards, multiple-choice questions, and graded free-response practice.
                    </p>
                </div>

                <div className="pt-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center rounded-md bg-focus px-8 py-3.5 font-sans text-base font-semibold text-white transition hover:bg-focus-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper shadow-sm"
                    >
                        Go to Dashboard
                        <span className="ml-2 font-data">→</span>
                    </Link>
                </div>

                <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-rule">
                    <div className="space-y-2">
                        <h3 className="font-sans font-semibold text-ink">Zero Setup</h3>
                        <p className="font-sans text-sm text-ink-muted">
                            Drop a file and start studying in seconds. No accounts required for v1.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-sans font-semibold text-ink">Smart Grading</h3>
                        <p className="font-sans text-sm text-ink-muted">
                            Theory questions are graded by an AI that checks for key concepts, not exact wording.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-sans font-semibold text-ink">Clean Focus</h3>
                        <p className="font-sans text-sm text-ink-muted">
                            A paper-like interface designed for two hours of focused studying, free from dashboard noise.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
