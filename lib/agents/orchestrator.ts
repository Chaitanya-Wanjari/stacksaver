import { AuditResult } from "@/lib/audit/types";

import { spendAnalystNode } from "./nodes/spend-analyst";
import { benchmarkAgentNode } from "./nodes/benchmark-agent";
import { consolidationAgentNode } from "./nodes/consolidation-agent";
import { riskAgentNode } from "./nodes/risk-agent";
import { executiveSummaryNode } from "./nodes/executive-summary-agent";

export interface AgentState {
  audit: AuditResult;

  spendAnalysis?: any;

  benchmarkAnalysis?: any;

  consolidationAnalysis?: any;

  riskAnalysis?: any;

  executiveSummary?: any;

  [key: string]: any;
}

export async function runAuditOrchestration(
  audit: AuditResult
) {
  let state: AgentState = {
    audit,
  };

  console.time("spendAnalyst");

  state = {
    ...state,
    ...(await spendAnalystNode(state)),
  };

  console.timeEnd("spendAnalyst");

console.time("parallelAgents");

const [
  benchmarkResult,
  consolidationResult,
  riskResult,
] = await Promise.all([
  benchmarkAgentNode(state),
  consolidationAgentNode(state),
  riskAgentNode(state),
]);

console.timeEnd("parallelAgents");

state = {
  ...state,
  ...benchmarkResult,
  ...consolidationResult,
  ...riskResult,
};

  console.time("executiveSummaryAgent");

  state = {
    ...state,
    ...(await executiveSummaryNode(state)),
  };

  console.timeEnd("executiveSummaryAgent");

  return state;
}