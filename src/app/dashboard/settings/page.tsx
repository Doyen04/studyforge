export default function SettingsPage() {
    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-3xl px-6 py-8 lg:py-10 space-y-8">
                <div>
                    <h1 className="text-2xl font-semibold text-ink tracking-tight">Settings</h1>
                    <p className="text-sm text-ink-muted mt-1">Manage your preferences and account.</p>
                </div>

                <section className="rounded-lg border border-rule bg-card p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-ink">Preferences</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-ink">Theory answer word limit</p>
                            <p className="text-xs text-ink-muted mt-0.5">Minimum words required for theory responses in quizzes.</p>
                        </div>
                        <span className="font-data text-sm text-ink-muted">15 words</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-ink">Default quiz count per type</p>
                            <p className="text-xs text-ink-muted mt-0.5">Preset when creating a new quiz.</p>
                        </div>
                        <span className="font-data text-sm text-ink-muted">5</span>
                    </div>
                </section>

                <section className="rounded-lg border border-rule bg-card p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-ink">Account</h2>
                    <p className="text-sm text-ink-muted">Account management is not yet available.</p>
                </section>
            </div>
        </main>
    );
}
