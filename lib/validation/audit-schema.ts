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
  ]),
  plan: z.string().min(1),
  monthlySpend: z.coerce.number().min(0),
  seats: z.coerce.number().int().min(1),
});

export const auditInputSchema = z.object({
  teamSize: z.coerce.number().int().min(1),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  tools: z.array(toolSpendSchema).min(1),
});

export type AuditInputForm = z.infer<typeof auditInputSchema>;