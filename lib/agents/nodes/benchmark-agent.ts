import { AuditGraphState } from "../state";
import { generateText }
from "../utils/generate";

export async function benchmarkAgentNode(
  state: AuditGraphState
): Promise<Partial<AuditGraphState>> {
  const audit = state.audit;

  const prompt = `
You are an AI infrastructure benchmarking analyst.

Analyze this company's AI spending efficiency.

Company stage: ${audit.input.companyStage}
Team size: ${audit.input.teamSize}

Spend per engineer: ${audit.spendPerEngineer}
Benchmark spend per engineer: ${audit.benchmarkSpendPerEngineer}

Benchmark delta: ${audit.benchmarkDelta}

Explain:
- Whether the company is above or below benchmark
- What this implies operationally
- Whether the spend profile is sustainable
- Key efficiency concerns
`;

  const response =
  await generateText(prompt);

return {
  benchmarkAnalysis: response,
};
}