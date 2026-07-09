import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export const GENERATION_MODEL = "claude-sonnet-5";

interface StructuredCallOptions {
    system: string;
    user: string;
    schema: Record<string, unknown>;
    maxTokens?: number;
}

export async function generateStructured<T>({
    system,
    user,
    schema,
    maxTokens = 4096,
}: StructuredCallOptions): Promise<T> {
    const response = await anthropic.messages.create({
        model: GENERATION_MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
        output_config: {
            format: {
                type: "json_schema",
                schema,
            },
        },
    });

    if (response.stop_reason === "refusal") {
        throw new Error("Claude declined to generate content for this request.");
    }

    if (response.stop_reason === "max_tokens") {
        throw new Error("Response was cut off before completion.");
    }

    const textBlock = response.content.find(
        (block): block is { type: "text"; text: string } => block.type === "text"
    );
    if (!textBlock) {
        throw new Error("Claude did not return a text response.");
    }

    return JSON.parse(textBlock.text) as T;
}
