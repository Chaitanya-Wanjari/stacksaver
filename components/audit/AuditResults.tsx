"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Clipboard,
  DollarSign,
  Gauge,
  Share2,
  TrendingDown,
} from "lucide-react";
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

  const isHighSavings = result.segment === "high-savings";
  const isOptimized = result.segment === "optimized";

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border shadow-xl">
        <div
          className={
            isHighSavings
              ? "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500"
              : "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-200"
          }
        />

        <CardContent className="space-y-8 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <Badge className="mb-4">
                {isHighSavings
                  ? "High savings opportunity"
                  : isOptimized
                    ? "Already lean"
                    : "Moderate savings"}
              </Badge>

              <p className="text-sm text-muted-foreground">
                Estimated monthly savings
              </p>

              <h1 className="mt-2 text-6xl font-bold tracking-tight">
                ${result.totalMonthlySavings}
                <span className="text-xl font-medium text-muted-foreground">
                  /mo
                </span>
              </h1>

              <p className="mt-3 text-lg text-muted-foreground">
                ${result.totalAnnualSavings}/year back into runway
              </p>
            </div>

            <div className="rounded-3xl border bg-muted/40 p-5 text-center">
              <p className="text-sm text-muted-foreground">Efficiency score</p>
              <p className="mt-1 text-5xl font-bold">
                {result.efficiencyScore}
              </p>
              <p className="text-sm text-muted-foreground">out of 100</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
  <Metric
    icon={<DollarSign className="size-4" />}
    label="Current spend"
    value={`$${result.totalCurrentSpend}/mo`}
  />
  <Metric
    icon={<TrendingDown className="size-4" />}
    label="Recommended spend"
    value={`$${result.totalRecommendedSpend}/mo`}
  />
  <Metric
    icon={<Gauge className="size-4" />}
    label="Spend per engineer"
    value={`$${result.spendPerEngineer}/mo`}
  />
  <Metric
    icon={<Gauge className="size-4" />}
    label="Benchmark"
    value={`$${result.benchmarkSpendPerEngineer}/engineer`}
  />
</div>

<div className="rounded-3xl border bg-muted/40 p-5">
  <h3 className="font-semibold">Benchmark mode</h3>
  <p className="mt-2 text-sm leading-6 text-muted-foreground">
    Your AI spend is ${result.spendPerEngineer}/engineer/month. Similar teams
    are estimated at around ${result.benchmarkSpendPerEngineer}/engineer/month.
    {result.benchmarkDelta > 0
      ? ` You are currently $${result.benchmarkDelta}/engineer/month above benchmark.`
      : result.benchmarkDelta < 0
        ? ` You are currently $${Math.abs(
            result.benchmarkDelta
          )}/engineer/month below benchmark.`
        : " You are currently aligned with the benchmark range."}
  </p>
</div>

<div className="rounded-3xl border bg-muted/40 p-5">
  <div className="mb-2 flex items-center gap-2 font-medium">
    <CheckCircle2 className="size-5" />
    Audit summary
  </div>
            <p className="text-sm leading-7 text-muted-foreground">
              {result.personalizedSummary || result.summary}
            </p>
          </div>

          {isHighSavings && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
              <h3 className="font-semibold">Credit review recommended</h3>
              <p className="mt-1 text-sm text-emerald-800">
                Your savings are high enough that discounted AI infrastructure
                credits may be worth reviewing.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={copyLink}>
              <Clipboard className="mr-2 size-4" />
              Copy public report link
            </Button>

            <Button variant="outline" asChild>
              <a href={publicUrl}>
                <Share2 className="mr-2 size-4" />
                Open public report
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Recommendations</h2>
            <p className="text-sm text-muted-foreground">
              Explainable actions based on your stack, seats, spend, and usage.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {result.recommendations.map((rec, index) => (
            <Card key={`${rec.tool}-${index}`} className="border shadow-sm">
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>{rec.toolLabel}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {rec.plan}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{rec.category}</Badge>
                    <Badge>{rec.confidence} confidence</Badge>
                    {rec.monthlySavings > 0 && (
                      <Badge className="bg-emerald-600">
                        Save ${rec.monthlySavings}/mo
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-3 md:grid-cols-3">
                  <Metric label="Current" value={`$${rec.currentSpend}/mo`} />
                  <Metric
                    label="Recommended"
                    value={`$${rec.recommendedSpend}/mo`}
                  />
                  <Metric label="Savings" value={`$${rec.monthlySavings}/mo`} />
                </div>

                <div className="rounded-2xl border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 font-medium">
                    {rec.action}
                    <ArrowUpRight className="size-4" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {rec.reason}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <LeadCaptureForm result={result} />
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}