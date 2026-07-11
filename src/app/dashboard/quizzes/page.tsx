import Link from "next/link";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";

export default async function QuizzesIndex() {
    const quizzes = await prisma.quiz.findMany({ orderBy: { createdAt: "desc" }, include: { studySet: true } });

    return (
        <main className="min-h-screen">
            <SiteHeader />
            <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
                <h1 className="text-3xl font-display text-ink">Quizzes</h1>
                <div className="grid gap-4">
                    {quizzes.map((q) => (
                        <Link key={q.id} href={`/dashboard/quizzes/${q.id}`} className="block rounded-3xl border border-rule bg-card p-4">
                            <div className="font-semibold">{q.title}</div>
                            <div className="text-sm text-ink/70">From set: {q.studySet.title}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
