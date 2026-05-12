export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolName =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export interface ToolSpendInput {
  id: string;
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  useCase: UseCase;
  tools: ToolSpendInput[];
}

export type RecommendationType =
  | "keep"
  | "downgrade"
  | "reduce-seats"
  | "consolidate"
  | "credits"
  | "review";

export interface ToolRecommendation {
  tool: ToolName;
  plan: string;
  currentSpend: number;
  recommendedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  action: string;
  reason: string;
  confidence: "high" | "medium" | "low";
  type: RecommendationType;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  input: AuditInput;
  totalCurrentSpend: number;
  totalRecommendedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  spendPerTeamMember: number;
  segment: "optimized" | "moderate-savings" | "high-savings";
  recommendations: ToolRecommendation[];
  summary: string;
}