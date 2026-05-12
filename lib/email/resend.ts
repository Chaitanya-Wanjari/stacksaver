import { Resend } from "resend";
import { AuditResult } from "@/lib/audit/types";

const resendApiKey = process.env.RESEND_API_KEY;

export async function sendAuditEmail({
  to,
  result,
}: {
  to: string;
  result: AuditResult;
}) {
  if (!resendApiKey) {
    return {
      skipped: true,
      reason: "RESEND_API_KEY not configured",
    };
  }

  const resend = new Resend(resendApiKey);

  const topRecommendations = result.recommendations
    .filter((r) => r.monthlySavings > 0)
    .slice(0, 3)
    .map(
      (r) =>
        `<li><strong>${r.toolLabel}</strong>: ${r.action} — save $${r.monthlySavings}/mo</li>`
    )
    .join("");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reportUrl = `${appUrl}/audit/${result.publicId}`;

  return resend.emails.send({
  from: "StackSaver <audit@hireflowai.in>",
  to,
  replyTo: "imt_2022034@iiitm.ac.in",
  subject: `Your AI spend audit: $${result.totalAnnualSavings}/year potential savings`,
  html: `
    <h1>Your StackSaver audit is ready</h1>
    <p>Your audit found <strong>$${result.totalMonthlySavings}/month</strong> in potential savings.</p>
    <p>That is <strong>$${result.totalAnnualSavings}/year</strong>.</p>
    <h2>Top recommendations</h2>
    <ul>${topRecommendations || "<li>Your stack appears lean.</li>"}</ul>
    <p><a href="${reportUrl}">View your public report</a></p>
  `,
});
}