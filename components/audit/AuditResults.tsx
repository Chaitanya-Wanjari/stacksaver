"use client";

import { AuditResult } from "@/lib/audit/types";
import { TOOL_LABELS } from "@/lib/audit/pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuditResultsProps {
  result: AuditResult;
}

export function AuditResults({ result }: AuditResultsProps) {
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/audit/${result.id}`
      : `/audit/${result.id}`;

  function copyLink() {
    navigator.clipboard.writeText(publicUrl);
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="space-y-4 p-6 md:p-8">
          <Badge>
            {result.segment === "high-savings"
              ? "High savings opportunity"
              : result.segment === "optimized"
                ? "Already lean"
                : "Moderate savings"}
          </Badge>

          <div>
            <p className="text-sm text-muted-foreground">
              Estimated monthly savings
            </p>
            <h2 className="text-5xl font-bold tracking-tight">
              ${result.totalMonthlySavings}
              <span className="text-lg font-medium text-muted-foreground">
                /mo
              </span>
            </h2>
          </div>

          <p className="text-xl text-muted-foreground">
            That is ${result.totalAnnualSavings}/year back into runway.
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Current spend</p>
              <p className="text-2xl font-semibold">
                ${result.totalCurrentSpend}/mo
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Recommended spend</p>
              <p className="text-2xl font-semibold">
                ${result.totalRecommendedSpend}/mo
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Spend per teammate</p>
              <p className="text-2xl font-semibold">
                ${result.spendPerTeamMember}/mo
              </p>
            </div>
          </div>

          {result.segment === "high-savings" ? (
            <div className="rounded-xl border bg-muted p-4">
              <h3 className="font-semibold">Credex opportunity</h3>
              <p className="text-sm text-muted-foreground">
                Your savings are high enough that discounted AI credits may be
                worth reviewing. This is where Credex could help capture more of
                the savings.
              </p>
            </div>
          ) : result.segment === "optimized" ? (
            <div className="rounded-xl border bg-muted p-4">
              <h3 className="font-semibold">You are spending well</h3>
              <p className="text-sm text-muted-foreground">
                This audit did not find major savings. You can still get notified
                when new pricing changes affect your stack.
              </p>
            </div>
          ) : null}

          <p className="rounded-xl border p-4 text-sm leading-6">
            {result.summary}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={copyLink}>Copy share link</Button>
            <Button variant="outline" asChild>
              <a href={`/audit/${result.id}`}>Open public report</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {result.recommendations.map((rec) => (
          <Card key={`${rec.tool}-${rec.plan}`}>
            <CardHeader>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <CardTitle>{TOOL_LABELS[rec.tool]}</CardTitle>
                <Badge variant="outline">{rec.confidence} confidence</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className="font-semibold">${rec.currentSpend}/mo</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Recommended</p>
                  <p className="font-semibold">${rec.recommendedSpend}/mo</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Savings</p>
                  <p className="font-semibold">${rec.monthlySavings}/mo</p>
                </div>
              </div>

              <div>
                <p className="font-medium">{rec.action}</p>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <LeadCapture result={result} />
    </div>
  );
}

function LeadCapture({ result }: { result: AuditResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {result.segment === "high-savings"
            ? "Get this reviewed by Credex"
            : "Email me this audit"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          className="grid gap-3 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Lead captured in demo. Connect Supabase/Resend for production.");
          }}
        >
          <input
            name="website"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-md border px-3 py-2"
          />

          <input
            placeholder="Company"
            className="rounded-md border px-3 py-2"
          />

          <input
            placeholder="Role"
            className="rounded-md border px-3 py-2"
          />

          <Button type="submit">
            {result.segment === "high-savings"
              ? "Request consultation"
              : "Send report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}