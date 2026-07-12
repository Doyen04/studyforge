"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [savedKey, setSavedKey] = useState<string | null>(null);
    const [showKey, setShowKey] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => {
                setSavedKey(data.geminiApiKey);
                if (data.geminiApiKey) setApiKey(data.geminiApiKey);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const hasStoredKey = savedKey !== null && savedKey.length > 0;
    const hasChanges = apiKey !== (savedKey ?? "");

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ geminiApiKey: apiKey }),
            });
            if (!res.ok) throw new Error("Failed to save");
            setSavedKey(apiKey.trim() || null);
            toast.success(apiKey.trim() ? "API key saved" : "API key removed");
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        setTesting(true);
        try {
            const res = await fetch("/api/settings/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ geminiApiKey: apiKey }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Connection failed");
            toast.success("API key is working");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Test failed");
        } finally {
            setTesting(false);
        }
    };

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-3xl px-6 py-8 lg:py-10 space-y-8">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-ink tracking-tight">Settings</h1>
                    <p className="text-sm text-ink-muted mt-1">Manage your preferences and API keys.</p>
                </div>

                <section className="rounded-lg border border-rule bg-card p-6 space-y-6">
                    <div>
                        <h2 className="text-sm font-semibold text-ink">Bring Your Own Key</h2>
                        <p className="text-xs text-ink-muted mt-1">
                            Provide your own Google Gemini API key. If none is set, the app falls back to the server environment variable.
                        </p>
                    </div>

                    {loading ? (
                        <div className="h-10 rounded-md bg-rule animate-pulse" />
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="gemini-key" className="text-xs font-semibold text-ink-muted">
                                    Gemini API Key
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            id="gemini-key"
                                            type={showKey ? "text" : "password"}
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="AIza..."
                                            className="w-full rounded-md border border-rule bg-paper px-3 py-2 pr-10 text-sm text-ink outline-none font-data transition focus:border-accent focus:ring-1 focus:ring-accent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowKey((v) => !v)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition cursor-pointer"
                                            aria-label={showKey ? "Hide key" : "Show key"}
                                        >
                                            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleTest}
                                        disabled={!apiKey.trim() || testing}
                                        className="cursor-pointer shrink-0 rounded-md border border-rule bg-card px-4 py-2 text-sm font-semibold text-ink transition hover:bg-paper-hover disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {testing ? <Loader2 size={16} className="animate-spin" /> : "Test"}
                                    </button>
                                </div>
                                {hasStoredKey && (
                                    <p className="text-xs text-mastered flex items-center gap-1.5">
                                        <Check size={12} />
                                        Key saved · {savedKey!.slice(0, 6)}…{savedKey!.slice(-4)}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <p className="text-xs text-ink-muted">
                                    {hasStoredKey ? "Using your personal key." : "No key stored — using server default."}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving || !hasChanges}
                                    className="cursor-pointer rounded-md bg-accent hover:bg-accent-hover px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? "Saving…" : "Save"}
                                </button>
                            </div>
                        </>
                    )}
                </section>

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
