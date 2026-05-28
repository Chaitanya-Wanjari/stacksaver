import { AuditGraphState } from "../state";
import { generateText }
from "../utils/generate";

export async function executiveSummaryNode(
  state: AuditGraphState
): Promise<Partial<AuditGraphState>> {
  const prompt = `
You are a CFO-level AI infrastructure consultant.

Using the analyses below, generate a concise executive optimization strategy.

SPEND ANALYSIS:
${state.spendAnalysis}

BENCHMARK ANALYSIS:
${state.benchmarkAnalysis}

CONSOLIDATION ANALYSIS:
${state.consolidationAnalysis}

RISK ANALYSIS:
${state.riskAnalysis}

Generate:
- Executive summary
- Highest priority actions
- Estimated operational impact
- Recommended implementation order
`;

 const response =
  await generateText(prompt);

return {
  executiveSummary: response,
};
}