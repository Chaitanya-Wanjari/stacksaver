import { nanoid } from "nanoid";
import {
  AuditInput,
  AuditResult,
  ToolRecommendation,
  ToolSpendInput,
} from "./types";
import {
  getCheapestPaidPlan,
  getPlanPrice,
  getToolCategory,
  getToolLabel,
} from "./pricing";
import { calculateEfficiencyScore } from "./scoring";

function money(value: number) {
  return Math.max(0, Math.round(value));
}

function countToolsByCategory(input: AuditInput, category: string) {
  return input.tools.filter((tool) => getToolCategory(tool.tool) === category)
    .length;
}

function getBenchmarkSpendPerEngineer(teamSize: number) {
  if (teamSize <= 5) return 120;
  if (teamSize <= 15) return 180;
  if (teamSize <= 50) return 240;
  return 300;
}

function evaluateTool(
  tool: ToolSpendInput,
  input: AuditInput
): ToolRecommendation {
  const label = getToolLabel(tool.tool);
  const category = getToolCategory(tool.tool);
  const officialPrice = getPlanPrice(tool.tool, tool.plan);

  let recommendedSpend = tool.monthlySpend;
  let action = "Keep current setup";
  let reason = "This tool appears reasonable for your team size and use case.";
  let confidence: ToolRecommendation["confidence"] = "medium";
  let type: ToolRecommendation["type"] = "keep";

  // Rule 1: unused seats
  if (
    officialPrice !== null &&
    officialPrice > 0 &&
    tool.seats > input.teamSize
  ) {
    const extraSeats = tool.seats - input.teamSize;
    const savings = extraSeats * officialPrice;

    recommendedSpend = money(tool.monthlySpend - savings);
    action = `Reduce ${extraSeats} unused ${extraSeats === 1 ? "seat" : "seats"}`;
    reason = `${label} has more paid seats than your total team size. Removing unused seats is a direct, high-confidence saving.`;
    confidence = "high";
    type = "reduce-seats";
  }

  // Rule 2: small team on heavy plan
  const heavyPlan =
    tool.plan.toLowerCase().includes("business") ||
    tool.plan.toLowerCase().includes("team") ||
    tool.plan.toLowerCase().includes("enterprise") ||
    tool.plan.toLowerCase().includes("max") ||
    tool.plan.toLowerCase().includes("ultra");

  if (type === "keep" && input.teamSize <= 3 && heavyPlan) {
    const cheapest = getCheapestPaidPlan(tool.tool);

    if (cheapest) {
      const estimatedSpend = cheapest.monthlyPerSeat * tool.seats;

      if (estimatedSpend < tool.monthlySpend) {
        recommendedSpend = money(estimatedSpend);
        action = `Review downgrade to ${cheapest.name}`;
        reason = `${label} ${tool.plan} may be more than a ${input.teamSize}-person team needs unless admin, compliance, or collaboration controls are required.`;
        confidence = "medium";
        type = "downgrade";
      }
    }
  }

  // Rule 3: duplicate coding assistants
  if (
    type === "keep" &&
    category === "coding-assistant" &&
    countToolsByCategory(input, "coding-assistant") >= 2 &&
    tool.usageIntensity !== "critical"
  ) {
    recommendedSpend = 0;
    action = "Consolidate coding assistants";
    reason =
      "Your stack includes multiple coding assistants. Most small teams should standardize on one primary coding assistant unless each has a clearly separate workflow.";
    confidence = "medium";
    type = "consolidate";
  }

  // Rule 4: duplicate chat assistants
  if (
    type === "keep" &&
    category === "chat-assistant" &&
    countToolsByCategory(input, "chat-assistant") >= 3 &&
    tool.usageIntensity === "light"
  ) {
    recommendedSpend = 0;
    action = "Remove lightly used overlapping assistant";
    reason =
      "You have several general-purpose AI assistants. Lightly used overlapping subscriptions are strong candidates for cancellation.";
    confidence = "medium";
    type = "consolidate";
  }

  // Rule 5: retail API spend
  if (
    type === "keep" &&
    category === "api" &&
    tool.monthlySpend >= 500
  ) {
    const estimatedSavings = tool.monthlySpend * 0.2;
    recommendedSpend = money(tool.monthlySpend - estimatedSavings);
    action = "Explore discounted AI credits";
    reason =
      "This API spend is high enough that discounted infrastructure credits could materially reduce retail AI costs.";
    confidence = "low";
    type = "credits";
  }

  const monthlySavings = money(tool.monthlySpend - recommendedSpend);

  return {
    tool: tool.tool,
    toolLabel: label,
    category,
    plan: tool.plan,
    currentSpend: money(tool.monthlySpend),
    recommendedSpend: money(recommendedSpend),
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
    return `Your AI stack shows a significant savings opportunity of $${result.totalMonthlySavings}/month, or $${result.totalAnnualSavings}/year. The biggest opportunities come from unused seats, overlapping tools, plan mismatch, or high retail API spend. Because the savings are material, this stack is worth reviewing before the next billing cycle.`;
  }

  if (result.totalMonthlySavings < 100) {
    return `Your AI spend appears relatively lean for your team size and use case. The audit did not find major savings without risking productivity. The best next step is to keep monitoring seat usage, pricing changes, and whether new tools duplicate capabilities you already pay for.`;
  }

  return `Your AI stack has a moderate savings opportunity of $${result.totalMonthlySavings}/month, or $${result.totalAnnualSavings}/year. The recommendations focus on practical changes such as reducing unused seats, reviewing plan fit, and consolidating overlapping tools while preserving the team’s core workflows.`;
}

export function runAudit(input: AuditInput): AuditResult {
  const recommendations = input.tools.map((tool) => evaluateTool(tool, input));

  const totalCurrentSpend = money(
    input.tools.reduce((sum, tool) => sum + Number(tool.monthlySpend || 0), 0)
  );

  const totalRecommendedSpend = money(
    recommendations.reduce((sum, rec) => sum + rec.recommendedSpend, 0)
  );

  const totalMonthlySavings = money(totalCurrentSpend - totalRecommendedSpend);
  const totalAnnualSavings = totalMonthlySavings * 12;

 const spendPerTeamMember = input.teamSize
  ? money(totalCurrentSpend / input.teamSize)
  : totalCurrentSpend;

const spendPerEngineer = input.engineeringTeamSize
  ? money(totalCurrentSpend / input.engineeringTeamSize)
  : spendPerTeamMember;

const benchmarkSpendPerEngineer = getBenchmarkSpendPerEngineer(input.teamSize);
const benchmarkDelta = Math.round(
  spendPerEngineer - benchmarkSpendPerEngineer
);

const efficiencyScore = calculateEfficiencyScore(
  input,
  recommendations,
  spendPerEngineer
);

  const base = {
    publicId: `aud_${nanoid(10)}`,
    createdAt: new Date().toISOString(),
    input,
    totalCurrentSpend,
    totalRecommendedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    spendPerTeamMember,
    spendPerEngineer,
    benchmarkSpendPerEngineer,
    benchmarkDelta,
    efficiencyScore,
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