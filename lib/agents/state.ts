import { AuditResult } from "@/lib/audit/types";

export interface ToolInsight {
  tool: string;
  issue: string;
  recommendation: string;
  impact: "low" | "medium" | "high";
}

export interface RiskInsight {
  risk: string;
  severity: "low" | "medium" | "high";
  mitigation: string;
}

export interface OptimizationStrategy {
  priority: number;
  title: string;
  description: string;
  expectedSavings: number;
}

export interface AuditGraphState {
  audit: AuditResult;

  spendAnalysis?: string;

  benchmarkAnalysis?: string;

  consolidationAnalysis?: string;

  riskAnalysis?: string;

  executiveSummary?: string;

  toolInsights?: ToolInsight[];

  risks?: RiskInsight[];

  optimizationStrategies?: OptimizationStrategy[];

  messages?: string[];
}