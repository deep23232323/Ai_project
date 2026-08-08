export function parseLLMJson(text) {
    let cleaned = text.trim();

    cleaned = cleaned
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON object found.");
    }

    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    return JSON.parse(cleaned);
}