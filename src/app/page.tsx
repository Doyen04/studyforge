import Link from "next/link";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white">
            <header className="w-full border-b border-gray-100">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <span className="font-display text-xl font-semibold text-ink tracking-tight">StudyForge</span>
                    <Link
                        href="/dashboard"
                        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium !text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md"
                    >
                        Go to dashboard
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 pt-24 pb-20 text-center">
                <h1 className="font-display text-5xl font-semibold text-ink tracking-tight sm:text-6xl">
                    Turn your notes into
                    <br />
                    <span className="text-accent">active recall</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
                    Upload your slides, documents, or PDFs. StudyForge generates flashcards, quizzes, and written
                    questions — then grades your answers so you know exactly what you have down and what needs work.
                </p>
                <div className="mt-10 flex items-center justify-center gap-4">
                    <Link
                        href="/dashboard"
                        className="rounded-lg bg-accent px-8 py-3 text-sm font-medium !text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md"
                    >
                        Get started
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="rounded-lg border border-gray-200 px-8 py-3 text-sm font-medium text-ink transition-colors hover:bg-gray-50"
                    >
                        How it works
                    </Link>
                </div>
            </section>

            <section id="how-it-works" className="border-t border-gray-100 bg-gray-50/50">
                <div className="mx-auto max-w-7xl px-6 py-20">
                    <h2 className="text-center font-display text-3xl font-semibold text-ink">How it works</h2>
                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent font-semibold text-lg">
                                1
                            </div>
                            <h3 className="mt-5 text-base font-semibold text-ink">Upload your material</h3>
                            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                                Drop a PDF, DOCX, or PPTX. StudyForge reads and chunks it automatically.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent font-semibold text-lg">
                                2
                            </div>
                            <h3 className="mt-5 text-base font-semibold text-ink">AI generates questions</h3>
                            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                                Flashcards, multiple-choice, fill-in-the-blanks, and theory questions — built from your document.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent font-semibold text-lg">
                                3
                            </div>
                            <h3 className="mt-5 text-base font-semibold text-ink">Practice and track</h3>
                            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                                Take quizzes, review flashcards, and get AI-graded feedback on written answers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20">
                <h2 className="text-center font-display text-3xl font-semibold text-ink">Four question types</h2>
                <p className="mt-3 text-center text-sm text-gray-400">
                    Every study set includes all four — built from your document, not a generic question bank.
                </p>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-ink">Flashcards</h3>
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                            Front-and-back recall cards for key terms and concepts.
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-ink">Multiple choice</h3>
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                            Four-option questions with explanations for the correct answer.
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-ink">Fill in the blank</h3>
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                            Sentence-completion exercises with synonym support.
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-ink">Theory questions</h3>
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                            Open-ended questions with AI grading against a rubric.
                        </p>
                    </div>
                </div>
            </section>

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
        </main>
    );
}
