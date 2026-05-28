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

  state = {
    ...state,
    ...(await spendAnalystNode(state)),
  };

  state = {
    ...state,
    ...(await benchmarkAgentNode(state)),
  };

  state = {
    ...state,
    ...(await consolidationAgentNode(state)),
  };

  state = {
    ...state,
    ...(await riskAgentNode(state)),
  };

  state = {
    ...state,
    ...(await executiveSummaryNode(state)),
  };

  return state;
}