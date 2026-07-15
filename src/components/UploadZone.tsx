"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";

interface UploadZoneProps {
    onUploadSuccess: (documentId: string) => void;
}

export function UploadZone({ onUploadSuccess }: UploadZoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [uploadStage, setUploadStage] = useState<"idle" | "uploading" | "processing">("idle");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            void startUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            void startUpload(e.target.files[0]);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const startUpload = async (file: File) => {
        const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (![".docx", ".pptx", ".pdf"].includes(ext)) {
            const msg = "That's not a format StudyForge reads yet. Upload a .pptx, .docx, or .pdf.";
            setError(msg);
            toast.error(msg);
            setUploadStage("idle");
            return;
        }

        setError(null);
        setUploadStage("uploading");
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const xhr = new XMLHttpRequest();
            const uploadPromise = new Promise<{ documentId: string; error?: string }>((resolve, reject) => {
                xhr.open("POST", "/api/documents");
                xhr.responseType = "json";

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        setUploadProgress(Math.round((event.loaded / event.total) * 100));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response as { documentId: string; error?: string });
                    } else {
                        const errMsg = (xhr.response as { error?: string })?.error || "Failed to parse file.";
                        reject(new Error(errMsg));
                    }
                };

                xhr.onerror = () => reject(new Error("Network upload failed. Check your connection."));
                xhr.send(formData);
            });

            const response = await uploadPromise;
            setUploadStage("processing");

            // Brief delay so user sees processing state
            await new Promise((r) => setTimeout(r, 800));

            onUploadSuccess(response.documentId);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to parse file.";
            setError(msg);
            toast.error(msg);
            setUploadStage("idle");
            setUploadProgress(0);
        }
    };

    return (
        <div className="w-full">
            {error && (
                <div className="mb-3 rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error font-medium">
                    {error}
                    <button
                        type="button"
                        onClick={() => setError(null)}
                        className="ml-3 underline cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={uploadStage === "idle" ? handleButtonClick : undefined}
                className={`relative flex min-h-[140px] flex-col items-center justify-center rounded-md border-[1.5px] border-dashed p-8 text-center transition-colors duration-150 ${
                    uploadStage === "idle" ? "cursor-pointer hover:border-accent hover:text-accent" : ""
                } ${
                    error
                        ? "border-error text-error"
                        : dragActive || uploadStage !== "idle"
                        ? "border-accent"
                        : "border-rule text-ink-muted"
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.pptx,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {uploadStage === "idle" && (
                    <div className="flex flex-col items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-current">
                            <IconPlus size={14} stroke={2.5} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-ink">Upload material</p>
                            <p className="mt-1 text-xs text-current">.pptx, .docx, or .pdf</p>
                        </div>
                    </div>
                )}

                {uploadStage === "uploading" && (
                    <div className="flex w-full max-w-[160px] flex-col items-center gap-3">
                        <p className="text-sm font-semibold text-ink">Uploading… {uploadProgress}%</p>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-rule">
                            <div
                                className="h-full rounded-full bg-accent transition-[width] duration-200 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {uploadStage === "processing" && (
                    <div className="flex flex-col items-center gap-2.5">
                        <div className="h-[22px] w-[22px] animate-spin rounded-full border-[2.5px] border-rule border-t-accent" />
                        <div>
                            <p className="text-sm font-semibold text-ink">Generating your study set…</p>
                            <p className="mt-0.5 text-xs text-ink-muted">This can take a minute for longer documents.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
