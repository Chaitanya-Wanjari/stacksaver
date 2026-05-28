import { AuditGraphState } from "../state";
import { model } from "../utils/model";

export async function riskAgentNode(
  state: AuditGraphState
): Promise<Partial<AuditGraphState>> {
  const audit = state.audit;

  const prompt = `
You are an engineering productivity risk analyst.

Analyze risks associated with reducing AI tooling spend.

Focus on:
- productivity loss
- developer workflow disruption
- onboarding friction
- API dependency risk
- consolidation risk

Company stage: ${audit.input.companyStage}
Team size: ${audit.input.teamSize}

Recommendations:
${audit.recommendations
  .map((r) => `- ${r.toolLabel}: ${r.action}`)
  .join("\n")}

Generate:
1. Main operational risks
2. Which optimizations are safest
3. Which changes require caution
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
  riskAnalysis:
    completion.choices[0].message.content || "",
};
}