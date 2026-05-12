"use client";

import { useState } from "react";
import { SpendForm } from "@/components/audit/SpendForm";
import { AuditResults } from "@/components/audit/AuditResults";
import { AuditResult } from "@/lib/audit/types";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [result, setResult] = useState<AuditResult | null>(null);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <nav className="mb-16 flex items-center justify-between">
          <div className="font-bold">StackSaver</div>
          <Button variant="outline" size="sm">
            Free audit
          </Button>
        </nav>

        <div className="mb-12 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              AI Spend Audit for startup teams
            </p>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
              Find leaks in your AI spend.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Audit Cursor, Copilot, Claude, ChatGPT, Gemini, and API spend in
              two minutes. See where to downgrade, consolidate, or explore
              discounted AI credits.
            </p>
          </div>

          <div className="rounded-2xl border bg-muted p-6">
            <p className="text-sm text-muted-foreground">Example finding</p>
            <p className="mt-2 text-3xl font-bold">$740/mo saved</p>
            <p className="mt-2 text-sm text-muted-foreground">
              By reducing unused seats, consolidating duplicate coding
              assistants, and reviewing retail API spend.
            </p>
          </div>
        </div>

        {!result ? <SpendForm onResult={setResult} /> : <AuditResults result={result} />}

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold">1. Add your stack</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the AI tools, plans, seats, and monthly spend you already
              pay for.
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <h3 className="font-semibold">2. Get a defensible audit</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The engine uses deterministic pricing and usage-fit rules, not
              vague AI guesses.
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <h3 className="font-semibold">3. Share or capture savings</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Save the report, share a public URL, or request help if savings
              are significant.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
