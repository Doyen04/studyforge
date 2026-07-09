interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <section className="rounded-4xl border border-rule bg-card p-8 shadow-[0_16px_40px_rgba(27,31,29,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-focus">Quiz</p>
          <h1 className="mt-3 font-display text-4xl text-ink">Take quiz {id}</h1>
          <p className="mt-4 text-sm leading-6 text-ink/70">
            The quiz-taking flow will connect here once quiz assembly and answer submission are wired to the generated data.
          </p>
        </section>
      </div>
    </main>
  );
}
