import { z } from "zod";

export const toolSpendSchema = z.object({
  id: z.string(),
  tool: z.enum([
    "cursor",
    "github-copilot",
    "claude",
    "chatgpt",
    "anthropic-api",
    "openai-api",
    "gemini",
    "windsurf",
    "v0",
  ]),
  plan: z.string().min(1),
  monthlySpend: z.coerce.number().min(0),
  seats: z.coerce.number().int().min(1),
  usageIntensity: z.enum(["light", "moderate", "heavy", "critical"]),
});

export const auditInputSchema = z.object({
  companyStage: z.enum([
    "solo",
    "pre-seed",
    "seed",
    "series-a",
    "growth",
    "agency",
    "other",
  ]),
  teamSize: z.coerce.number().int().min(1),
  engineeringTeamSize: z.coerce.number().int().min(1),
  useCase: z.enum(["coding", "writing", "data", "research", "support", "mixed"]),
  tools: z.array(toolSpendSchema).min(1),
});

export const leadSchema = z.object({
  publicId: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.coerce.number().int().min(1).optional(),
  wantsConsultation: z.boolean().optional(),
  website: z.string().optional(),
});

export const eventSchema = z.object({
  publicId: z.string().optional(),
  eventName: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
});