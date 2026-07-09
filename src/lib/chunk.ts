const WORDS_PER_CHUNK = 3000;
const SINGLE_CHUNK_THRESHOLD = 3500;

export function chunkText(text: string): string[] {
  const normalized = text.trim();
  const wordCount = normalized ? normalized.split(/\s+/).length : 0;
  if (wordCount <= SINGLE_CHUNK_THRESHOLD) {
    return [text];
  }

  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let current: string[] = [];
  let currentWords = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim() ? paragraph.trim().split(/\s+/).length : 0;
    if (currentWords + paragraphWords > WORDS_PER_CHUNK && current.length > 0) {
      chunks.push(current.join("\n\n"));
      current = [];
      currentWords = 0;
    }

    current.push(paragraph);
    currentWords += paragraphWords;
  }

  if (current.length > 0) {
    chunks.push(current.join("\n\n"));
  }

  return chunks;
}

export function distributeCount(total: number, chunks: string[]): number[] {
  if (chunks.length === 0) {
    return [];
  }
  if (total <= 0) {
    return chunks.map(() => 0);
  }

  const weights = chunks.map((chunk) => {
    const trimmed = chunk.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  });
  const totalWords = weights.reduce((sum, weight) => sum + weight, 0) || 1;

  const raw = weights.map((weight) => (weight / totalWords) * total);
  const floors = raw.map(Math.floor);
  let remainder = total - floors.reduce((sum, value) => sum + value, 0);

  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (const entry of order) {
    if (remainder <= 0) {
      break;
    }
    floors[entry.index] += 1;
    remainder -= 1;
  }

  return floors;
}
