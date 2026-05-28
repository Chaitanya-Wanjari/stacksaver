import { generateText } from "../utils/generate";

import {
  SpendAnalysisSchema,
} from "../schemas/analysis";

import type { AgentState } from "../orchestrator";
import { extractJson }
from "../utils/extract-json";

export async function spendAnalystNode(
  state: AgentState
) {
  const audit = state.audit;

  const prompt = `
You are an AI FinOps analyst.

Analyze this AI spend audit.

Return ONLY valid JSON.

Required schema:

{
  "summary": "string",

  "opportunities": [
    {
      "title": "string",
      "description": "string",
      "impact": "low | medium | high",
      "estimatedSavings": number
    }
  ],

  "risks": [
    {
      "risk": "string",
      "severity": "low | medium | high",
      "mitigation": "string"
    }
  ],

  "priorities": ["string"],

  "confidence": number
}

AUDIT DATA:

Current spend:
${audit.totalCurrentSpend}

Monthly savings:
${audit.totalMonthlySavings}

Recommendations:
${audit.recommendations
  .map(
    (r) => `
- ${r.toolLabel}
- ${r.reason}
`
  )
  .join("\n")}
`;

  const raw =
    await generateText(prompt);

  const cleaned =
  extractJson(raw);

const parsed =
  SpendAnalysisSchema.parse(
    JSON.parse(cleaned)
  );

  return {
    spendAnalysis: parsed,
  };
}