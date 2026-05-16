import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditResults } from "@/components/audit/AuditResults";
import { getAuditByPublicId } from "@/lib/db/audits";
import { AuditResult } from "@/lib/audit/types";
import { ThemeToggle } from "@/components/theme-toggle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const audit = await getAuditByPublicId(publicId);

  if (!audit) {
    return {
      title: "Audit not found | StackSaver",
      description: "This StackSaver audit report could not be found.",
    };
  }

  const result = audit.result as AuditResult;

  const title = `$${result.totalMonthlySavings}/mo AI savings found | StackSaver`;
  const description = `This AI spend audit found $${result.totalAnnualSavings}/year in potential savings with an efficiency score of ${result.efficiencyScore}/100.`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reportUrl = `${appUrl}/audit/${publicId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: reportUrl,
      siteName: "StackSaver",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
export default async function PublicAuditPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  const audit = await getAuditByPublicId(publicId);

  if (!audit) {
    notFound();
  }

  const result = audit.result as AuditResult;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
  <div className="mb-8 flex items-center justify-between rounded-2xl border bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
    <a href="/" className="flex items-center gap-2 text-sm font-medium">
      <span className="flex size-8 items-center justify-center rounded-xl bg-foreground text-background">
        S
      </span>
      StackSaver
    </a>

    <div className="flex items-center gap-2">
  <ThemeToggle />
  <a
    href="/audit/new"
    className="rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted"
  >
    Run your own audit
  </a>
</div>
  </div>

  <AuditResults result={result} />
</main>
  );
}