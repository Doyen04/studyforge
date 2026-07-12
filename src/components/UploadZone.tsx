"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";


function ProgressBar({ value, indeterminate = false }: { value?: number; indeterminate?: boolean }) {
    return (
        <div className="h-2 overflow-hidden rounded-full bg-rule w-full">
            <div
                className={`h-full rounded-full bg-accent ${
                    indeterminate
                        ? "w-1/3 animate-[pulse_1.4s_ease-in-out_infinite]"
                        : "transition-[width] duration-300 ease-out"
                }`}
                style={
                    indeterminate
                        ? { transform: "translateX(100%)" }
                        : { width: `${Math.max(0, Math.min(100, value ?? 0))}%` }
                }
            />
        </div>
    );
}

interface UploadZoneProps {
    onUploadSuccess: (documentId: string) => void;
}

export function UploadZone({ onUploadSuccess }: UploadZoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [uploadStage, setUploadStage] = useState<"idle" | "uploading" | "parsing">("idle");
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
            setUploadStage("parsing");
            
            // Wait briefly to allow user to see parsing stage
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
                <div className="mb-4 rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error font-medium">
                    {error}
                </div>
            )}

            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={uploadStage === "idle" ? handleButtonClick : undefined}
                className={`group relative min-h-[148px] rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 flex flex-col items-center justify-center ${
                    uploadStage === "idle" ? "cursor-pointer hover:border-accent/60" : ""
                } ${dragActive ? "border-accent bg-accent/[0.07]" : "border-accent/30 bg-accent/[0.03]"}`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.pptx,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {uploadStage === "idle" && (
                    <div className="space-y-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg font-semibold text-accent mx-auto group-hover:bg-accent/20 group-hover:scale-110 transition-all">+</span>
                        <p className="font-sans text-sm font-semibold text-accent">
                            Upload material
                        </p>
                        <p className="font-sans text-[11px] text-accent/60">
                            .pptx, .docx, or .pdf
                        </p>
                    </div>
                )}

                {uploadStage === "uploading" && (
                    <div className="w-full max-w-xs space-y-4">
                        <p className="font-sans text-sm font-semibold text-ink">
                            Uploading document… {uploadProgress}%
                        </p>
                        <ProgressBar value={uploadProgress} />
                    </div>
                )}

                {uploadStage === "parsing" && (
                    <div className="w-full max-w-xs space-y-4">
                        <p className="font-sans text-sm font-semibold text-ink">
                            Reading document details…
                        </p>
                        <ProgressBar indeterminate />
                    </div>
                )}
            </div>
        </div>
    );
}
