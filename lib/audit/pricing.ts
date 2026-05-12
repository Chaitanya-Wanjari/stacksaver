import { ToolCategory, ToolName } from "./types";

export interface PlanPrice {
  name: string;
  monthlyPerSeat: number;
  pricingType: "per-seat" | "usage-based" | "custom";
}

export interface ToolPricing {
  label: string;
  category: ToolCategory;
  officialUrl: string;
  verifiedAt: string;
  plans: PlanPrice[];
}

export const TOOL_PRICING: Record<ToolName, ToolPricing> = {
  cursor: {
    label: "Cursor",
    category: "coding-assistant",
    officialUrl: "https://cursor.com/pricing",
    verifiedAt: "2026-05-12",
    plans: [
      { name: "Hobby", monthlyPerSeat: 0, pricingType: "per-seat" },
      { name: "Pro", monthlyPerSeat: 20, pricingType: "per-seat" },
      { name: "Business", monthlyPerSeat: 40, pricingType: "per-seat" },
      { name: "Enterprise", monthlyPerSeat: 60, pricingType: "custom" },
    ],
  },

  "github-copilot": {
    label: "GitHub Copilot",
    category: "coding-assistant",
    officialUrl: "https://github.com/features/copilot/plans",
    verifiedAt: "2026-05-12",
    plans: [
      { name: "Individual", monthlyPerSeat: 10, pricingType: "per-seat" },
      { name: "Business", monthlyPerSeat: 19, pricingType: "per-seat" },
      { name: "Enterprise", monthlyPerSeat: 39, pricingType: "per-seat" },
    ],
  },

  claude: {
    label: "Claude",
    category: "chat-assistant",
    officialUrl: "https://www.anthropic.com/pricing",
    verifiedAt: "2026-05-12",
    plans: [
      { name: "Free", monthlyPerSeat: 0, pricingType: "per-seat" },
      { name: "Pro", monthlyPerSeat: 20, pricingType: "per-seat" },
      { name: "Max", monthlyPerSeat: 100, pricingType: "per-seat" },
      { name: "Team", monthlyPerSeat: 30, pricingType: "per-seat" },
      { name: "Enterprise", monthlyPerSeat: 60, pricingType: "custom" },
      { name: "API direct", monthlyPerSeat: 0, pricingType: "usage-based" },
    ],
  },

  chatgpt: {
    label: "ChatGPT",
    category: "chat-assistant",
    officialUrl: "https://openai.com/chatgpt/pricing/",
    verifiedAt: "2026-05-12",
    plans: [
      { name: "Plus", monthlyPerSeat: 20, pricingType: "per-seat" },
      { name: "Team", monthlyPerSeat: 30, pricingType: "per-seat" },
      { name: "Enterprise", monthlyPerSeat: 60, pricingType: "custom" },
      { name: "API direct", monthlyPerSeat: 0, pricingType: "usage-based" },
    ],
  },

  "anthropic-api": {
    label: "Anthropic API",
    category: "api",
    officialUrl: "https://www.anthropic.com/pricing#api",
    verifiedAt: "2026-05-12",
    plans: [
      { name: "API direct", monthlyPerSeat: 0, pricingType: "usage-based" },
    ],
  },

  "openai-api": {
    label: "OpenAI API",
    category: "api",
    officialUrl: "https://openai.com/api/pricing/",
    verifiedAt: "2026-05-12",
    plans: [
      { name: "API direct", monthlyPerSeat: 0, pricingType: "usage-based" },
    ],
  },

  gemini: {
    label: "Gemini",
    category: "chat-assistant",
    officialUrl: "https://ai.google.dev/pricing",
    verifiedAt: "2026-05-12",
    plans: [
      { name: "Pro", monthlyPerSeat: 20, pricingType: "per-seat" },
      { name: "Ultra", monthlyPerSeat: 250, pricingType: "per-seat" },
      { name: "API", monthlyPerSeat: 0, pricingType: "usage-based" },
    ],
  },

  windsurf: {
    label: "Windsurf",
    category: "coding-assistant",
    officialUrl: "https://windsurf.com/pricing",
    verifiedAt: "2026-05-12",
    plans: [
      { name: "Free", monthlyPerSeat: 0, pricingType: "per-seat" },
      { name: "Pro", monthlyPerSeat: 15, pricingType: "per-seat" },
      { name: "Teams", monthlyPerSeat: 30, pricingType: "per-seat" },
    ],
  },

  v0: {
    label: "v0",
    category: "design",
    officialUrl: "https://v0.dev/pricing",
    verifiedAt: "2026-05-12",
    plans: [
      { name: "Free", monthlyPerSeat: 0, pricingType: "per-seat" },
      { name: "Premium", monthlyPerSeat: 20, pricingType: "per-seat" },
      { name: "Team", monthlyPerSeat: 30, pricingType: "per-seat" },
    ],
  },
};

export function getToolLabel(tool: ToolName) {
  return TOOL_PRICING[tool].label;
}

export function getToolCategory(tool: ToolName) {
  return TOOL_PRICING[tool].category;
}

export function getPlanPrice(tool: ToolName, plan: string) {
  const found = TOOL_PRICING[tool].plans.find(
    (p) => p.name.toLowerCase() === plan.toLowerCase()
  );

  return found?.monthlyPerSeat ?? null;
}

export function getCheapestPaidPlan(tool: ToolName) {
  const paidPlans = TOOL_PRICING[tool].plans.filter(
    (p) => p.monthlyPerSeat > 0 && p.pricingType === "per-seat"
  );

  if (!paidPlans.length) return null;

  return paidPlans.sort((a, b) => a.monthlyPerSeat - b.monthlyPerSeat)[0];
}