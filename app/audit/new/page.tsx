import { SpendForm } from "@/components/audit/SpendForm";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function NewAuditPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="mb-8 flex items-center justify-between rounded-2xl border bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
  <span className="flex size-8 items-center justify-center rounded-xl bg-foreground text-background">
    S
  </span>
  StackSaver
</Link>

        <div className="flex items-center gap-2">
  <ThemeToggle />
 <Link
  href="/"
  className="rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted"
>
  Back home
</Link>
</div>
      </div>

      <section className="mb-8 rounded-3xl border bg-background/70 p-6 shadow-sm backdrop-blur md:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          Free AI spend audit
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          Run your AI spend audit
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Add your AI tools, plans, seats, and monthly spend. StackSaver will
          calculate where you can reduce waste and generate a shareable report.
        </p>
      </section>

      <SpendForm />
    </main>
  );
}