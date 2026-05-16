export type UseCase =
  | "coding"
  | "writing"
  | "data"
  | "research"
  | "support"
  | "mixed";

export type CompanyStage =
  | "solo"
  | "pre-seed"
  | "seed"
  | "series-a"
  | "growth"
  | "agency"
  | "other";

export type UsageIntensity = "light" | "moderate" | "heavy" | "critical";

export type ToolCategory =
  | "coding-assistant"
  | "chat-assistant"
  | "api"
  | "research"
  | "design"
  | "other";

export type ToolName =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf"
  | "v0";

export interface ToolSpendInput {
  id: string;
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
  usageIntensity: UsageIntensity;
}

export interface AuditInput {
  companyStage: CompanyStage;
  teamSize: number;
  engineeringTeamSize: number;
  useCase: UseCase;
  tools: ToolSpendInput[];
}

export type RecommendationType =
  | "keep"
  | "reduce-seats"
  | "downgrade"
  | "consolidate"
  | "credits"
  | "benchmark-warning"
  | "review";

export interface ToolRecommendation {
  tool: ToolName;
  toolLabel: string;
  category: ToolCategory;
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
  publicId: string;
  createdAt: string;
  input: AuditInput;
  totalCurrentSpend: number;
  totalRecommendedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  spendPerTeamMember: number;
  spendPerEngineer: number;
  benchmarkSpendPerEngineer: number;
  benchmarkDelta: number;
  efficiencyScore: number;
  segment: "optimized" | "moderate-savings" | "high-savings";
  recommendations: ToolRecommendation[];
  summary: string;
  personalizedSummary?: string;
}