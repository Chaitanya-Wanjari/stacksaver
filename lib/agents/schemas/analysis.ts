import { z } from "zod";

export const OpportunitySchema = z.object({
  title: z.string(),

  description: z.string(),

  impact: z.enum([
    "low",
    "medium",
    "high",
  ]),

  estimatedSavings: z.number(),
});

export const RiskSchema = z.object({
  risk: z.string(),

  severity: z.enum([
    "low",
    "medium",
    "high",
  ]),

  mitigation: z.string(),
});

export const SpendAnalysisSchema =
  z.object({
    summary: z.string(),

    opportunities: z.array(
      OpportunitySchema
    ),

    risks: z.array(RiskSchema),

    priorities: z.array(z.string()),

    confidence: z.number(),
  });

export type SpendAnalysis =
  z.infer<typeof SpendAnalysisSchema>;