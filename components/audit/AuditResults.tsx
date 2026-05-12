"use client";

import { AuditResult } from "@/lib/audit/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadCaptureForm } from "./LeadCaptureForm";

export function AuditResults({ result }: { result: AuditResult }) {
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/audit/${result.publicId}`
      : `/audit/${result.publicId}`;

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="space-y-6 p-6 md:p-8">
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
            <h1 className="text-5xl font-bold tracking-tight">
              ${result.totalMonthlySavings}
              <span className="text-lg font-medium text-muted-foreground">
                /mo
              </span>
            </h1>
            <p className="mt-2 text-xl text-muted-foreground">
              ${result.totalAnnualSavings}/year back into runway
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <Metric label="Current spend" value={`$${result.totalCurrentSpend}/mo`} />
            <Metric
              label="Recommended spend"
              value={`$${result.totalRecommendedSpend}/mo`}
            />
            <Metric
              label="Spend per engineer"
              value={`$${result.spendPerEngineer}/mo`}
            />
            <Metric
              label="Efficiency score"
              value={`${result.efficiencyScore}/100`}
            />
          </div>

          <div className="rounded-xl border bg-muted p-4">
            <p className="text-sm leading-6">{result.summary}</p>
          </div>

          {result.segment === "high-savings" && (
            <div className="rounded-xl border p-4">
              <h3 className="font-semibold">Credit review recommended</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your savings are high enough that discounted AI infrastructure
                credits may be worth reviewing.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={copyLink}>Copy public report link</Button>
            <Button variant="outline" asChild>
              <a href={publicUrl}>Open public report</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {result.recommendations.map((rec, index) => (
          <Card key={`${rec.tool}-${index}`}>
            <CardHeader>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <CardTitle>{rec.toolLabel}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{rec.category}</Badge>
                  <Badge>{rec.confidence} confidence</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Metric label="Current" value={`$${rec.currentSpend}/mo`} />
                <Metric
                  label="Recommended"
                  value={`$${rec.recommendedSpend}/mo`}
                />
                <Metric label="Savings" value={`$${rec.monthlySavings}/mo`} />
              </div>

              <div>
                <p className="font-medium">{rec.action}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {rec.reason}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <LeadCaptureForm result={result} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}