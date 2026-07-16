import OfficeParser  from "officeparser";
import { countWords } from "./utils";

type SupportedFileType = "docx" | "pptx" | "pdf";

const EXTENSION_TO_FILETYPE: Record<string, SupportedFileType> = {
    ".docx": "docx",
    ".pptx": "pptx",
    ".pdf": "pdf",
};

export interface ParsedDocument {
    text: string;
    wordCount: number;
    fileType: string;
}

export async function parseDocument(buffer: Buffer, originalFilename: string): Promise<ParsedDocument> {
    const ext = originalFilename.slice(originalFilename.lastIndexOf(".")).toLowerCase();
    const fileType = EXTENSION_TO_FILETYPE[ext];

    if (!fileType) {
        throw new Error("Unsupported file type. Upload a .docx, .pptx, or .pdf file.");
    }

    const ast = await OfficeParser.parseOffice(buffer, { fileType, ocr: fileType === "pdf" });
    const text = await ast.to('text').then(r => r.value.trim());
    const wordCount = countWords(text);

    if (wordCount < 30) {
        throw new Error(
            "This document has very little readable text. Image-only or scanned PDFs aren't supported — try a text-based PDF, DOCX, or PPTX file instead."
        );
    }

    return { text, wordCount, fileType };
}
