import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <nav className="mb-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold">
            StackSaver
          </a>

          <Button asChild>
            <a href="/audit/new">Run free audit</a>
          </Button>
        </nav>

        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              AI Spend Audit for startup teams
            </p>

            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Find leaks in your AI spend.
            </h1>

            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Audit Cursor, Copilot, Claude, ChatGPT, Gemini, Windsurf, and API
              costs in minutes. Find unused seats, duplicate tools, and retail
              API spend before your next billing cycle.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href="/audit/new">Run free audit</a>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>
          </div>

          <Card className="border shadow-sm">
            <CardContent className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">Example audit</p>
              <p className="text-5xl font-bold">$740/mo</p>
              <p className="text-muted-foreground">
                Potential savings from unused seats, overlapping coding
                assistants, and retail API spend.
              </p>

              <div className="grid gap-3">
                <div className="rounded-xl border p-3">
                  Cursor Business → reduce unused seats
                </div>
                <div className="rounded-xl border p-3">
                  Copilot Business → consolidate duplicate assistant
                </div>
                <div className="rounded-xl border p-3">
                  OpenAI API → review discounted credits
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <section id="how-it-works" className="mt-20 grid gap-4 md:grid-cols-3">
          <Feature
            title="1. Add your stack"
            text="Enter your AI tools, plans, seats, monthly spend, and primary use case."
          />
          <Feature
            title="2. Get a defensible audit"
            text="StackSaver uses deterministic rules and pricing data, not vague AI guesses."
          />
          <Feature
            title="3. Share or capture savings"
            text="Generate a public report, email the audit, or request a review for high-savings cases."
          />
        </section>

        <section className="mt-20 rounded-2xl border p-8">
          <h2 className="text-3xl font-bold">Supported tools</h2>
          <p className="mt-2 text-muted-foreground">
            Cursor, GitHub Copilot, Claude, ChatGPT, OpenAI API, Anthropic API,
            Gemini, Windsurf, and v0.
          </p>
        </section>
      </section>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}