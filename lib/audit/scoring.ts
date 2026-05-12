import { AuditInput, ToolRecommendation } from "./types";

export function calculateEfficiencyScore(
  input: AuditInput,
  recommendations: ToolRecommendation[],
  spendPerEngineer: number
) {
  let score = 100;

  const duplicateCount = recommendations.filter(
    (r) => r.type === "consolidate"
  ).length;

  const unusedSeatCount = recommendations.filter(
    (r) => r.type === "reduce-seats"
  ).length;

  const creditCount = recommendations.filter((r) => r.type === "credits").length;

  const downgradeCount = recommendations.filter(
    (r) => r.type === "downgrade"
  ).length;

  score -= duplicateCount * 12;
  score -= unusedSeatCount * 10;
  score -= downgradeCount * 8;
  score -= creditCount * 8;

  if (spendPerEngineer > 150) score -= 20;
  else if (spendPerEngineer > 75) score -= 10;

  if (input.tools.length >= 6) score -= 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}