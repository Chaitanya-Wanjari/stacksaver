export function extractJson(
  text: string
) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

  if (
    firstBrace === -1 ||
    lastBrace === -1
  ) {
    throw new Error(
      "No valid JSON object found"
    );
  }

  const jsonString = cleaned.slice(
    firstBrace,
    lastBrace + 1
  );

  try {
    JSON.parse(jsonString);

    return jsonString;
  } catch (error) {
    console.error(
      "Invalid JSON extracted:",
      jsonString
    );

    throw error;
  }
}