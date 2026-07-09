interface QuizResultsPageProps {
    params: Promise<{ id: string; attemptId: string }>;
}

export default async function QuizResultsPage({ params }: QuizResultsPageProps) {
    const { id, attemptId } = await params;

    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <section className="rounded-4xl border border-rule bg-card p-8 shadow-[0_16px_40px_rgba(27,31,29,0.06)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-focus">Results</p>
                    <h1 className="mt-3 font-display text-4xl text-ink">Quiz {id}</h1>
                    <p className="mt-4 text-sm leading-6 text-ink/70">
                        Attempt {attemptId} will render graded answers and theory rubrics here.
                    </p>
                </section>
            </div>
        </main>
    );
}
