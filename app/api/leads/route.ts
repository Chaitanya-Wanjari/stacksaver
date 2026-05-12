import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/db/supabase";
import { getAuditByPublicId } from "@/lib/db/audits";
import { sendAuditEmail } from "@/lib/email/resend";
import { leadSchema } from "@/lib/validation/schemas";
import { AuditResult } from "@/lib/audit/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = leadSchema.parse(body);

    // Honeypot: silently accept bot submissions
    if (input.website) {
      return NextResponse.json({ ok: true });
    }

    const audit = await getAuditByPublicId(input.publicId);

    if (!audit) {
      return NextResponse.json(
        {
          ok: false,
          error: "Audit not found",
        },
        { status: 404 }
      );
    }

    const result = audit.result as AuditResult;
    const supabase = createServiceSupabaseClient();

    const { error } = await supabase.from("leads").insert({
      audit_id: audit.id,
      email: input.email,
      company_name: input.companyName || null,
      role: input.role || null,
      team_size: input.teamSize || result.input.teamSize,
      monthly_savings: result.totalMonthlySavings,
      is_high_savings: result.totalMonthlySavings >= 500,
      wants_consultation: input.wantsConsultation || false,
    });

    if (error) {
      throw new Error(error.message);
    }

    await sendAuditEmail({
      to: input.email,
      result,
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Could not capture lead",
      },
      { status: 400 }
    );
  }
}