import { NextResponse } from "next/server";

import { runAudit } from "@/lib/audit/engine";

import { auditInputSchema }
from "@/lib/validation/schemas";

import { spendAnalystNode }
from "@/lib/agents/nodes/spend-analyst";

import { benchmarkAgentNode }
from "@/lib/agents/nodes/benchmark-agent";

import { consolidationAgentNode }
from "@/lib/agents/nodes/consolidation-agent";

import { riskAgentNode }
from "@/lib/agents/nodes/risk-agent";

import { executiveSummaryNode }
from "@/lib/agents/nodes/executive-summary-agent";

export async function POST(
  req: Request
) {
  const body = await req.json();

  const input =
    auditInputSchema.parse(body);

  const audit =
    runAudit(input);

  const encoder =
    new TextEncoder();

  const stream =
    new ReadableStream({
      async start(controller) {
        const send = (
          data: unknown
        ) => {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify(
                data
              )}\n\n`
            )
          );
        };

        try {
          let state: any = {
            audit,
          };

          send({
            type: "status",

            message:
              "Running spend analyst...",
          });

          const spend =
            await spendAnalystNode(
              state
            );

          state = {
            ...state,
            ...spend,
          };

          send({
            type: "status",

            message:
              "Benchmarking stack...",
          });

          const benchmark =
            await benchmarkAgentNode(
              state
            );

          state = {
            ...state,
            ...benchmark,
          };

          send({
            type: "status",

            message:
              "Analyzing consolidation opportunities...",
          });

          const consolidation =
            await consolidationAgentNode(
              state
            );

          state = {
            ...state,
            ...consolidation,
          };

          send({
            type: "status",

            message:
              "Evaluating operational risks...",
          });

          const risk =
            await riskAgentNode(
              state
            );

          state = {
            ...state,
            ...risk,
          };

          send({
            type: "status",

            message:
              "Generating executive summary...",
          });

          const executive =
            await executiveSummaryNode(
              state
            );

          state = {
            ...state,
            ...executive,
          };

          send({
            type: "complete",

            result: state,
          });

          controller.close();
        } catch (error) {
          send({
            type: "error",

            message:
              "Streaming orchestration failed",
          });

          controller.close();
        }
      },
    });

  return new Response(stream, {
    headers: {
      "Content-Type":
        "text/event-stream",

      "Cache-Control":
        "no-cache",

      Connection: "keep-alive",
    },
  });
}