import { AuditGraphState } from "../state";
import { model } from "../utils/model";

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
  benchmarkAnalysis:
    completion.choices[0].message.content || "",
};
}