"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    setMessage("Uploading...");

    try {
      const res = await fetch("/api/documents", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      setMessage(`Uploaded: ${json.documentId} (${json.wordCount} words)`);
    } catch (err) {
      setMessage((err as Error).message);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-display text-ink">Upload a document</h1>
        <p className="mt-2 text-sm text-ink/70">Supported: .docx, .pptx, .pdf</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="file"
            accept=".docx,.pptx,.pdf"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="block w-full rounded-2xl border border-rule bg-white px-4 py-3"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-focus px-5 py-3 text-sm font-semibold text-white"
            >
              Upload
            </button>
            <div className="text-sm text-ink/70">{message}</div>
          </div>
        </form>
      </div>
    </main>
  );
}
