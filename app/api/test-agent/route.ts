import { NextResponse } from "next/server";

import { model } from "@/lib/agents/utils/model";

export async function GET() {
  const completion =
    await model.chat.completions.create({
      model: "openrouter/free",

      messages: [
        {
          role: "user",
          content:
            "Explain AI infrastructure optimization in 3 concise lines.",
        },
      ],
    });

  return NextResponse.json({
    response:
      completion.choices[0].message.content,
  });
}