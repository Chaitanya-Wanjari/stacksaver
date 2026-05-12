import { NextResponse } from "next/server";
import { getAuditByPublicId } from "@/lib/db/audits";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;

  const audit = await getAuditByPublicId(publicId);

  if (!audit) {
    return NextResponse.json(
      {
        ok: false,
        error: "Audit not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    audit: {
      publicId: audit.public_id,
      result: audit.result,
      createdAt: audit.created_at,
    },
  });
}