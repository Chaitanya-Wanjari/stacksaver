import { NextResponse } from "next/server";

import { runAudit } from "@/lib/audit/engine";

import { saveAudit } from "@/lib/db/audits";

import { auditInputSchema }
from "@/lib/validation/schemas";

import { generatePersonalizedSummary }
from "@/lib/ai/summary";

import { runAuditOrchestration }
from "@/lib/agents/orchestrator";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const input =
      auditInputSchema.parse(body);

    const result = runAudit(input);

    const agentAnalysis =
      await runAuditOrchestration(
        result
      );

    const personalizedSummary =
      await generatePersonalizedSummary(
        result
      );

    const enrichedResult = {
      ...result,

      personalizedSummary,

      agentAnalysis,
    };

    await saveAudit(enrichedResult);

    return NextResponse.json({
      ok: true,

      publicId:
        enrichedResult.publicId,

      result: enrichedResult,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,

        error:
          "Could not create audit",
      },

      { status: 400 }
    );
  }
}