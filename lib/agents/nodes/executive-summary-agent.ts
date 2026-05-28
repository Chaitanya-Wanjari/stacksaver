import { AuditGraphState } from "../state";
import { model } from "../utils/model";

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

  const completion =
  await model.chat.completions.create({
    model: "deepseek/deepseek-r1:free",

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

return {
  executiveSummary:
    completion.choices[0].message.content || "",
};
}