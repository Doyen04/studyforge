import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function StudySetsIndex() {
    const sets = await prisma.studySet.findMany({ include: { document: true }, orderBy: { createdAt: "desc" } });

    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-display text-ink">Study sets</h1>
                <div className="mt-6 grid gap-4">
                    {sets.map((set) => (
                        <Link key={set.id} href={`/study-sets/${set.id}`} className="block rounded-3xl border border-rule bg-card p-4">
                            <div className="font-semibold">{set.title}</div>
                            <div className="text-sm text-ink/70">{set.document.filename} • {set.document.wordCount} words</div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
