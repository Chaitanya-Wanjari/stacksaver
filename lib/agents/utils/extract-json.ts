export function extractJson(
  text: string
) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}