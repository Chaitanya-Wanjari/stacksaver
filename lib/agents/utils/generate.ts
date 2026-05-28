import { model } from "./model";

export async function generateText(
  prompt: string
) {
  const completion =
    await model.chat.completions.create({
      model: "openrouter/free",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  return (
    completion.choices[0].message.content ||
    ""
  );
}