import { AuditGraphState } from "../state";
import { generateText }
from "../utils/generate";

export async function consolidationAgentNode(
  state: AuditGraphState
): Promise<Partial<AuditGraphState>> {
  const tools = state.audit.input.tools;

  const prompt = `
You are an AI tooling consolidation strategist.

Analyze these tools for overlap and redundancy.

TOOLS:
${tools
  .map(
    (tool) => `
- ${tool.tool}
Plan: ${tool.plan}
Monthly Spend: ${tool.monthlySpend}
Seats: ${tool.seats}
Usage: ${tool.usageIntensity}
`
  )
  .join("\n")}

Tasks:
1. Detect overlapping tools
2. Suggest consolidation opportunities
3. Identify risky removals
4. Explain migration tradeoffs
`;
const response =
  await generateText(prompt);

return {
  consolidationAnalysis: response,
};
}