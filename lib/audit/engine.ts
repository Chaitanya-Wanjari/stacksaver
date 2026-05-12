import { nanoid } from "nanoid";
import {
  AuditInput,
  AuditResult,
  ToolRecommendation,
  ToolSpendInput,
} from "./types";
import { getCheapestPaidPlan, getPlanPrice, TOOL_LABELS } from "./pricing";

function roundMoney(value: number) {
  return Math.max(0, Math.round(value));
}

function hasDuplicateCodingAssistants(input: AuditInput) {
  const codingTools = input.tools.filter((t) =>
    ["cursor", "github-copilot", "windsurf"].includes(t.tool)
  );

  return input.useCase === "coding" && codingTools.length >= 2;
}

function evaluateTool(
  tool: ToolSpendInput,
  input: AuditInput
): ToolRecommendation {
  const label = TOOL_LABELS[tool.tool];
  const officialSeatPrice = getPlanPrice(tool.tool, tool.plan);
  const expectedSpend =
    officialSeatPrice !== null && officialSeatPrice > 0
      ? officialSeatPrice * tool.seats
      : tool.monthlySpend;

  let recommendedSpend = tool.monthlySpend;
  let action = "Keep current setup";
  let reason = "Your current spend appears reasonable for this tool and team size.";
  let confidence: ToolRecommendation["confidence"] = "medium";
  let type: ToolRecommendation["type"] = "keep";

  // Rule 1: unused seats
  if (tool.seats > input.teamSize && officialSeatPrice && officialSeatPrice > 0) {
    const extraSeats = tool.seats - input.teamSize;
    const savings = extraSeats * officialSeatPrice;

    recommendedSpend = roundMoney(tool.monthlySpend - savings);
    action = `Reduce ${extraSeats} unused ${extraSeats === 1 ? "seat" : "seats"}`;
    reason = `${label} has more paid seats than your team size. Reducing unused seats is a direct, high-confidence saving.`;
    confidence = "high";
    type = "reduce-seats";
  }

  // Rule 2: small team on enterprise/team plan
  const expensivePlan =
    tool.plan.toLowerCase().includes("enterprise") ||
    tool.plan.toLowerCase().includes("business") ||
    tool.plan.toLowerCase().includes("team") ||
    tool.plan.toLowerCase().includes("ultra") ||
    tool.plan.toLowerCase().includes("max");

  if (
    input.teamSize <= 3 &&
    expensivePlan &&
    tool.monthlySpend > 80 &&
    type === "keep"
  ) {
    const cheapest = getCheapestPaidPlan(tool.tool);
    if (cheapest) {
      const newSpend = cheapest.monthlyPerSeat * Math.max(1, tool.seats);
      if (newSpend < tool.monthlySpend) {
        recommendedSpend = roundMoney(newSpend);
        action = `Review downgrade to ${cheapest.plan}`;
        reason = `${label} ${tool.plan} may be heavy for a ${input.teamSize}-person team unless you need admin, compliance, or enterprise controls.`;
        confidence = "medium";
        type = "downgrade";
      }
    }
  }

  // Rule 3: duplicate coding assistants
  if (
    hasDuplicateCodingAssistants(input) &&
    ["github-copilot", "windsurf"].includes(tool.tool) &&
    type === "keep"
  ) {
    recommendedSpend = 0;
    action = `Consolidate coding assistants`;
    reason = `Your stack includes multiple coding assistants. For a small team, standardizing on one primary coding assistant can reduce duplicate spend.`;
    confidence = "medium";
    type = "consolidate";
  }

  // Rule 4: retail credit opportunity for high API spend
  if (
    ["openai-api", "anthropic-api", "gemini"].includes(tool.tool) &&
    tool.monthlySpend >= 500 &&
    type === "keep"
  ) {
    const estimatedSavings = tool.monthlySpend * 0.2;
    recommendedSpend = roundMoney(tool.monthlySpend - estimatedSavings);
    action = "Explore discounted AI credits";
    reason = `${label} spend is high enough that discounted infrastructure credits could materially reduce retail API cost.`;
    confidence = "low";
    type = "credits";
  }

  const monthlySavings = roundMoney(tool.monthlySpend - recommendedSpend);

  return {
    tool: tool.tool,
    plan: tool.plan,
    currentSpend: roundMoney(tool.monthlySpend),
    recommendedSpend: roundMoney(recommendedSpend),
    monthlySavings,
    annualSavings: monthlySavings * 12,
    action,
    reason,
    confidence,
    type,
  };
}

export function buildFallbackSummary(result: Omit<AuditResult, "summary">) {
  if (result.totalMonthlySavings >= 500) {
    return `Your AI stack shows a significant savings opportunity of $${result.totalMonthlySavings}/month, or $${result.totalAnnualSavings}/year. The largest opportunities come from duplicate tools, plan fit, unused seats, or retail API spend. Because the savings are material, this is a strong case for reviewing discounted AI credits and consolidating your stack before the next billing cycle.`;
  }

  if (result.totalMonthlySavings < 100) {
    return `Your AI spend appears relatively lean for your team size and use case. The audit did not find major savings without risking productivity. The best next step is to keep monitoring pricing changes, seat usage, and whether new tools are duplicating capabilities you already pay for.`;
  }

  return `Your AI stack has a moderate savings opportunity of $${result.totalMonthlySavings}/month, or $${result.totalAnnualSavings}/year. The recommendations focus on practical changes such as right-sizing seats, reviewing plan fit, and avoiding overlapping tools. These changes can reduce spend while keeping the team’s core AI workflows intact.`;
}

export function runAudit(input: AuditInput): AuditResult {
  const recommendations = input.tools.map((tool) => evaluateTool(tool, input));

  const totalCurrentSpend = roundMoney(
    input.tools.reduce((sum, tool) => sum + Number(tool.monthlySpend || 0), 0)
  );

  const totalRecommendedSpend = roundMoney(
    recommendations.reduce((sum, rec) => sum + rec.recommendedSpend, 0)
  );

  const totalMonthlySavings = roundMoney(totalCurrentSpend - totalRecommendedSpend);
  const totalAnnualSavings = totalMonthlySavings * 12;

  const base = {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    input,
    totalCurrentSpend,
    totalRecommendedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    spendPerTeamMember: input.teamSize
      ? roundMoney(totalCurrentSpend / input.teamSize)
      : totalCurrentSpend,
    segment:
      totalMonthlySavings >= 500
        ? "high-savings"
        : totalMonthlySavings < 100
          ? "optimized"
          : "moderate-savings",
    recommendations,
  } satisfies Omit<AuditResult, "summary">;

  return {
    ...base,
    summary: buildFallbackSummary(base),
  };
}