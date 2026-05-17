import {
  ArrowRight,
  BarChart3,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const supportedTools = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "OpenAI API",
  "Anthropic API",
  "Gemini",
  "Windsurf",
  "v0",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <nav className="flex items-center justify-between rounded-2xl border bg-card/80 px-4 py-3 text-card-foreground shadow-sm backdrop-blur">
          <Link href="/" className="flex items-center gap-2 font-bold">
  <span className="flex size-8 items-center justify-center rounded-xl bg-foreground text-background">
    S
  </span>
  StackSaver
</Link>

          <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">
              Features
            </a>
            <a
              href="#how-it-works"
              className="transition hover:text-foreground"
            >
              How it works
            </a>
            <a href="#tools" className="transition hover:text-foreground">
              Tools
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
              <Link href="/audit/new">
                Run free audit <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </nav>

        <div className="grid gap-10 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="size-4" />
              AI spend audit for startup teams
            </div>

            <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
              Find leaks in your AI tool spend.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              StackSaver audits your AI subscriptions and API usage to detect
              unused seats, duplicate tools, plan mismatch, and high retail API
              spend before your next billing cycle.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size='lg' asChild>
  <Link href="/audit/new">
    Run free audit <ArrowRight className="ml-2 size-4" />
  </Link>
</Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <TrustItem
                icon={<ShieldCheck className="size-4" />}
                text="No signup required"
              />
              <TrustItem
                icon={<Lock className="size-4" />}
                text="Public report links"
              />
              <TrustItem
                icon={<Zap className="size-4" />}
                text="Results in minutes"
              />
            </div>
          </div>

          <Card className="relative overflow-hidden border bg-card text-card-foreground shadow-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />

            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Example audit
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">Seed-stage SaaS</h2>
                </div>

                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  High savings
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Estimated savings
                </p>
                <p className="mt-2 text-6xl font-bold tracking-tight">
                  $740
                  <span className="text-xl font-medium text-muted-foreground">
                    /mo
                  </span>
                </p>
                <p className="mt-2 text-muted-foreground">
                  $8,880/year back into runway
                </p>
              </div>

              <div className="grid gap-3">
                <AuditPreviewItem
                  title="Cursor Business"
                  text="Reduce unused seats"
                  value="$200/mo"
                />
                <AuditPreviewItem
                  title="Copilot Business"
                  text="Consolidate duplicate assistant"
                  value="$95/mo"
                />
                <AuditPreviewItem
                  title="OpenAI API"
                  text="Review discounted credits"
                  value="$600/mo"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <section id="features" className="grid gap-4 md:grid-cols-3">
          <Feature
            icon={<TrendingDown className="size-5" />}
            title="Savings detection"
            text="Find unused seats, overlapping subscriptions, plan mismatch, and high API spend."
          />
          <Feature
            icon={<BarChart3 className="size-5" />}
            title="Efficiency score"
            text="Get a simple 0–100 score that summarizes how optimized your AI stack is."
          />
          <Feature
            icon={<Mail className="size-5" />}
            title="Lead-ready reports"
            text="Generate public reports and email summaries from a real Supabase-backed flow."
          />
        </section>

        <section
          id="how-it-works"
          className="mt-20 rounded-3xl border bg-card p-6 text-card-foreground shadow-sm md:p-10"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">
              A finance-literate audit in three steps.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Step
              number="01"
              title="Add your AI stack"
              text="Enter tools, plans, seats, monthly spend, team size, and usage intensity."
            />
            <Step
              number="02"
              title="Run deterministic checks"
              text="The engine calculates savings using explainable rules instead of hallucinated AI math."
            />
            <Step
              number="03"
              title="Share the report"
              text="Save the audit to Supabase, generate a public URL, and capture leads."
            />
          </div>
        </section>

        <section id="tools" className="mt-20 pb-16">
          <div className="rounded-3xl border bg-card p-8 text-card-foreground shadow-sm md:p-10">
            <h2 className="text-3xl font-bold">Supported tools</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              StackSaver supports the AI tools most startup teams already pay
              for.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {supportedTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border bg-muted px-4 py-2 text-sm text-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function TrustItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      {text}
    </div>
  );
}

function AuditPreviewItem({
  title,
  text,
  value,
}: {
  title: string;
  text: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-muted/40 p-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>

      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
        {value}
      </p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border bg-muted/40 p-5">
      <p className="text-sm font-semibold text-muted-foreground">{number}</p>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}