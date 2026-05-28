import { NextResponse } from "next/server";

import { spendAnalystNode }
from "@/lib/agents/nodes/spend-analyst";

export async function GET() {
  const result =
    await spendAnalystNode({
      audit: {
        totalCurrentSpend: 1200,

        totalMonthlySavings: 350,

        recommendations: [
          {
            toolLabel: "Cursor",

            reason:
              "Unused seats detected",
          },

          {
            toolLabel: "Claude",

            reason:
              "Duplicate AI assistant overlap",
          },
        ],
      },
    } as any);

  return NextResponse.json(result);
}