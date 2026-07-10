import Link from "next/link";
import { prisma } from "@/lib/db";
import { UploadWorkflow } from "@/components/UploadWorkflow";

function formatCount(value: number) {
    return new Intl.NumberFormat("en-US").format(value);
}

export default async function HomePage() {
    const recentStudySets = await prisma.studySet.findMany({
        include: { document: true, flashcards: true, mcqQuestions: true, fillInBlanks: true, theoryQuestions: true },
        orderBy: { createdAt: "desc" },
        take: 6,
    });

    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 md:py-10 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
                <header className="flex items-center justify-between border-b border-rule pb-4">
                    <Link href="/dashboard" className="font-display text-2xl text-ink font-semibold">
                        StudyForge
                    </Link>
                    <nav className="flex items-center gap-4 text-sm font-semibold text-ink-muted">
                        <Link href="/dashboard/study-sets" className="transition hover:text-focus">
                            All study sets
                        </Link>
                    </nav>
                </header>

                {/* Upload Section — Single column look */}
                <section className="mx-auto w-full max-w-2xl">
                    <UploadWorkflow />
                </section>

                {/* Recent Study Sets List */}
                <section className="space-y-6">
                    <div>
                        <h2 className="font-sans text-xl font-bold text-ink md:text-2xl">Recent study sets</h2>
                        <p className="mt-1 text-sm text-ink-muted">Your recently generated practice sets.</p>
                    </div>

                    {recentStudySets.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-rule bg-card p-8 text-center text-sm text-ink-muted">
                            Nothing here yet. Upload a slide deck, document, or PDF to turn it into flashcards and quizzes.
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {recentStudySets.map((set) => (
                                <Link
                                    key={set.id}
                                    href={`/dashboard/study-sets/${set.id}`}
                                    className="group rounded-lg border border-rule bg-card p-5 transition hover:bg-paper-hover hover:border-focus flex flex-col justify-between"
                                >
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-focus">
                                            Study Set
                                        </p>
                                        <h3 className="mt-2 font-sans text-base font-semibold text-ink group-hover:text-focus transition-colors">
                                            {set.title}
                                        </h3>
                                    </div>
                                    <div className="mt-4 border-t border-rule/50 pt-3 text-xs text-ink-muted space-y-1">
                                        <p className="truncate font-semibold">{set.document.filename}</p>
                                        <div className="flex flex-wrap gap-x-2 gap-y-1 font-data text-[11px]">
                                            <span>{set.flashcards.length} cards</span>
                                            <span>·</span>
                                            <span>{set.mcqQuestions.length} MCQ</span>
                                            <span>·</span>
                                            <span>{set.fillInBlanks.length} fill</span>
                                            <span>·</span>
                                            <span>{set.theoryQuestions.length} theory</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

