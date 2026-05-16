import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit/engine";
import { saveAudit } from "@/lib/db/audits";
import { auditInputSchema } from "@/lib/validation/schemas";
import { generatePersonalizedSummary } from "@/lib/ai/summary";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = auditInputSchema.parse(body);

    const result = runAudit(input);

    const personalizedSummary = await generatePersonalizedSummary(result);

    const resultWithSummary = {
      ...result,
      personalizedSummary,
    };

    await saveAudit(resultWithSummary);

    return NextResponse.json({
      ok: true,
      publicId: resultWithSummary.publicId,
      result: resultWithSummary,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Could not create audit",
      },
      { status: 400 }
    );
  }
}