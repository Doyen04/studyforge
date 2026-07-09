interface StudySetPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudySetPage({ params }: StudySetPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-4xl border border-rule bg-card p-8 shadow-[0_16px_40px_rgba(27,31,29,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-focus">Study set</p>
          <h1 className="mt-3 font-display text-4xl text-ink">Study set {id}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/70">
            Flashcards, MCQ, fill-in-the-blank, and theory tabs will render here once the set detail view is connected to the API data.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-rule bg-card p-6">
            <h2 className="text-lg font-semibold text-ink">Flashcards</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">Flip cards and navigate through the set.</p>
          </article>
          <article className="rounded-3xl border border-rule bg-card p-6">
            <h2 className="text-lg font-semibold text-ink">MCQ</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">Review multiple-choice questions and explanations.</p>
          </article>
          <article className="rounded-3xl border border-rule bg-card p-6">
            <h2 className="text-lg font-semibold text-ink">Fill in the blank</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">Practice precise recall with one missing term.</p>
          </article>
          <article className="rounded-3xl border border-rule bg-card p-6">
            <h2 className="text-lg font-semibold text-ink">Theory</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">Prepare for rubric-based graded responses.</p>
          </article>
        </section>
      </div>
    </main>
  );
}