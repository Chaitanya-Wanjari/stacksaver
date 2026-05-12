import { ToolName } from "./types";

export interface PlanPrice {
  plan: string;
  monthlyPerSeat: number;
  notes?: string;
}

export const TOOL_LABELS: Record<ToolName, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

export const PRICING: Record<ToolName, PlanPrice[]> = {
  cursor: [
    { plan: "Hobby", monthlyPerSeat: 0 },
    { plan: "Pro", monthlyPerSeat: 20 },
    { plan: "Business", monthlyPerSeat: 40 },
    { plan: "Enterprise", monthlyPerSeat: 60, notes: "Estimated/custom pricing placeholder" },
  ],
  "github-copilot": [
    { plan: "Individual", monthlyPerSeat: 10 },
    { plan: "Business", monthlyPerSeat: 19 },
    { plan: "Enterprise", monthlyPerSeat: 39 },
  ],
  claude: [
    { plan: "Free", monthlyPerSeat: 0 },
    { plan: "Pro", monthlyPerSeat: 20 },
    { plan: "Max", monthlyPerSeat: 100 },
    { plan: "Team", monthlyPerSeat: 30 },
    { plan: "Enterprise", monthlyPerSeat: 60, notes: "Estimated/custom pricing placeholder" },
    { plan: "API direct", monthlyPerSeat: 0 },
  ],
  chatgpt: [
    { plan: "Plus", monthlyPerSeat: 20 },
    { plan: "Team", monthlyPerSeat: 30 },
    { plan: "Enterprise", monthlyPerSeat: 60, notes: "Estimated/custom pricing placeholder" },
    { plan: "API direct", monthlyPerSeat: 0 },
  ],
  "anthropic-api": [
    { plan: "API direct", monthlyPerSeat: 0 },
  ],
  "openai-api": [
    { plan: "API direct", monthlyPerSeat: 0 },
  ],
  gemini: [
    { plan: "Pro", monthlyPerSeat: 20 },
    { plan: "Ultra", monthlyPerSeat: 250 },
    { plan: "API", monthlyPerSeat: 0 },
  ],
  windsurf: [
    { plan: "Free", monthlyPerSeat: 0 },
    { plan: "Pro", monthlyPerSeat: 15 },
    { plan: "Teams", monthlyPerSeat: 30 },
  ],
};

export function getPlanPrice(tool: ToolName, plan: string): number | null {
  const found = PRICING[tool].find(
    (p) => p.plan.toLowerCase() === plan.toLowerCase()
  );

  return found?.monthlyPerSeat ?? null;
}

export function getCheapestPaidPlan(tool: ToolName): PlanPrice | null {
  const paid = PRICING[tool].filter((p) => p.monthlyPerSeat > 0);
  if (!paid.length) return null;
  return paid.sort((a, b) => a.monthlyPerSeat - b.monthlyPerSeat)[0];
}