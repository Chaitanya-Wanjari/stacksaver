import { AuditResult } from "@/lib/audit/types";
import { createServiceSupabaseClient } from "./supabase";

export async function saveAudit(result: AuditResult) {
  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from("audits")
    .insert({
      public_id: result.publicId,
      company_stage: result.input.companyStage,
      team_size: result.input.teamSize,
      engineering_team_size: result.input.engineeringTeamSize,
      use_case: result.input.useCase,
      tools: result.input.tools,
      result,
      summary: result.summary,
      efficiency_score: result.efficiencyScore,
      total_current_spend: result.totalCurrentSpend,
      total_recommended_spend: result.totalRecommendedSpend,
      total_monthly_savings: result.totalMonthlySavings,
      total_annual_savings: result.totalAnnualSavings,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAuditByPublicId(publicId: string) {
  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("public_id", publicId)
    .single();

  if (error) {
    return null;
  }

  return data;
}