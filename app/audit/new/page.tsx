import { SpendForm } from "@/components/audit/SpendForm";

export default function NewAuditPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <a href="/" className="text-sm text-muted-foreground">
          ← Back to home
        </a>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Run your AI spend audit
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Add your AI tools, plans, seats, and monthly spend. StackSaver will
          calculate where you can reduce waste.
        </p>
      </div>

      <SpendForm />
    </main>
  );
}