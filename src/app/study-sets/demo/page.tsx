export default function DemoStudySetPage() {
    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <section className="rounded-4xl border border-rule bg-card p-8 shadow-[0_16px_40px_rgba(27,31,29,0.06)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-focus">Study set</p>
                    <h1 className="mt-3 font-display text-4xl text-ink">Demo study set</h1>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/70">
                        This page is a placeholder until the data-driven study-set detail route is connected to the API.
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-3xl border border-rule bg-card p-6">
                        <h2 className="text-lg font-semibold text-ink">Flashcards</h2>
                        <p className="mt-2 text-sm leading-6 text-ink/70">Flip-to-reveal review cards will live here.</p>
                    </article>
                    <article className="rounded-3xl border border-rule bg-card p-6">
                        <h2 className="text-lg font-semibold text-ink">Quizzes</h2>
                        <p className="mt-2 text-sm leading-6 text-ink/70">Quiz creation from this set will live here.</p>
                    </article>
                </section>
            </div>
        </main>
    );
}
