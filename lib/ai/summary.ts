import { AuditResult } from "@/lib/audit/types";

export function buildFallbackSummary(result: AuditResult) {
  if (result.totalMonthlySavings >= 500) {
    return `Your audit shows a significant AI spend optimization opportunity. Based on your current stack, you are spending $${result.totalCurrentSpend}/month and could potentially save $${result.totalMonthlySavings}/month, or $${result.totalAnnualSavings}/year. The biggest opportunities appear to come from unused seats, overlapping tools, or high retail API spend. Because the savings are material, this stack is a strong candidate for a deeper credit and vendor review.`;
  }

  if (result.totalMonthlySavings < 100) {
    return `Your AI stack appears relatively efficient. Based on the information provided, you are spending $${result.totalCurrentSpend}/month with only $${result.totalMonthlySavings}/month in estimated savings. That suggests your current plans and usage are mostly aligned with your team size and workflow. The best next step is to monitor usage over time and revisit the audit when your team grows or adds new AI tools.`;
  }

  return `Your audit shows a moderate AI spend optimization opportunity. Based on your current stack, you are spending $${result.totalCurrentSpend}/month and could potentially save $${result.totalMonthlySavings}/month, or $${result.totalAnnualSavings}/year. The recommendations focus on reducing waste without removing tools that are likely important to your workflow. Reviewing seat counts, overlapping subscriptions, and plan fit should help improve efficiency.`;
}

export async function generatePersonalizedSummary(result: AuditResult) {
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey) {
    return buildFallbackSummary(result);
  }

  try {
    const prompt = `
You are writing a concise B2B SaaS audit summary for a startup founder or engineering manager.

Write approximately 100 words.
Be specific, practical, and finance-literate.
Do not invent savings beyond the provided numbers.
Do not mention that you are an AI.
If savings are low, be honest and say the stack is already efficient.

Audit data:
Current monthly spend: $${result.totalCurrentSpend}
Recommended monthly spend: $${result.totalRecommendedSpend}
Monthly savings: $${result.totalMonthlySavings}
Annual savings: $${result.totalAnnualSavings}
Efficiency score: ${result.efficiencyScore}/100
Segment: ${result.segment}
Top recommendations:
${result.recommendations
  .slice(0, 3)
  .map((rec) => `- ${rec.toolLabel}: ${rec.action}. Savings: $${rec.monthlySavings}/mo. Reason: ${rec.reason}`)
  .join("\n")}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You write concise, practical SaaS spend audit summaries for startup operators.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 180,
      }),
    });

    if (!response.ok) {
      return buildFallbackSummary(result);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || buildFallbackSummary(result);
  } catch {
    return buildFallbackSummary(result);
  }
}