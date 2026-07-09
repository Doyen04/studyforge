import { OfficeParser } from "officeparser";

const EXTENSION_TO_FILETYPE: Record<string, string> = {
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
    throw new Error(`Unsupported file type: ${ext}. Upload a .docx, .pptx, or .pdf file.`);
  }

  const ast = await OfficeParser.parseOffice(buffer, { fileType });
  const text = ast.toText().trim();
  const wordCount = text.length ? text.split(/\s+/).length : 0;

  if (wordCount < 30) {
    throw new Error(
      "Couldn't find enough readable text in this file. If it's a scanned/image-only PDF, OCR isn't enabled by default."
    );
  }

  return { text, wordCount, fileType };
}
