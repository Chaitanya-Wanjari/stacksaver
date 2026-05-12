import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit/engine";
import { AuditInput } from "@/lib/audit/types";

function baseInput(overrides?: Partial<AuditInput>): AuditInput {
  return {
    companyStage: "seed",
    teamSize: 5,
    engineeringTeamSize: 3,
    useCase: "coding",
    tools: [
      {
        id: "1",
        tool: "cursor",
        plan: "Pro",
        monthlySpend: 100,
        seats: 5,
        usageIntensity: "heavy",
      },
    ],
    ...overrides,
  };
}

describe("audit engine", () => {
  it("calculates current spend", () => {
    const result = runAudit(baseInput());

    expect(result.totalCurrentSpend).toBe(100);
  });

  it("calculates annual savings from monthly savings", () => {
    const result = runAudit(
      baseInput({
        teamSize: 3,
        tools: [
          {
            id: "1",
            tool: "cursor",
            plan: "Pro",
            monthlySpend: 100,
            seats: 5,
            usageIntensity: "heavy",
          },
        ],
      })
    );

    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it("detects unused seats", () => {
    const result = runAudit(
      baseInput({
        teamSize: 3,
        tools: [
          {
            id: "1",
            tool: "cursor",
            plan: "Pro",
            monthlySpend: 100,
            seats: 5,
            usageIntensity: "heavy",
          },
        ],
      })
    );

    expect(result.recommendations[0].type).toBe("reduce-seats");
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  it("detects duplicate coding assistants", () => {
    const result = runAudit(
      baseInput({
        tools: [
          {
            id: "1",
            tool: "cursor",
            plan: "Pro",
            monthlySpend: 100,
            seats: 5,
            usageIntensity: "heavy",
          },
          {
            id: "2",
            tool: "github-copilot",
            plan: "Business",
            monthlySpend: 95,
            seats: 5,
            usageIntensity: "moderate",
          },
        ],
      })
    );

    expect(result.recommendations.some((r) => r.type === "consolidate")).toBe(
      true
    );
  });

  it("detects high API spend credit opportunity", () => {
    const result = runAudit(
      baseInput({
        useCase: "mixed",
        tools: [
          {
            id: "1",
            tool: "openai-api",
            plan: "API direct",
            monthlySpend: 3000,
            seats: 1,
            usageIntensity: "critical",
          },
        ],
      })
    );

    expect(result.segment).toBe("high-savings");
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(500);
  });

  it("does not manufacture savings for lean stack", () => {
    const result = runAudit(
      baseInput({
        teamSize: 2,
        engineeringTeamSize: 1,
        useCase: "writing",
        tools: [
          {
            id: "1",
            tool: "chatgpt",
            plan: "Plus",
            monthlySpend: 20,
            seats: 1,
            usageIntensity: "heavy",
          },
        ],
      })
    );

    expect(result.segment).toBe("optimized");
    expect(result.totalMonthlySavings).toBeLessThan(100);
  });

  it("calculates spend per engineer", () => {
    const result = runAudit(baseInput());

    expect(result.spendPerEngineer).toBe(33);
  });

  it("generates efficiency score", () => {
    const result = runAudit(baseInput());

    expect(result.efficiencyScore).toBeGreaterThanOrEqual(0);
    expect(result.efficiencyScore).toBeLessThanOrEqual(100);
  });

  it("returns public audit id", () => {
    const result = runAudit(baseInput());

    expect(result.publicId).toMatch(/^aud_/);
  });

  it("includes summary", () => {
    const result = runAudit(baseInput());

    expect(result.summary.length).toBeGreaterThan(20);
  });
});