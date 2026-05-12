"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { AuditResult } from "@/lib/audit/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeadCaptureForm({ result }: { result: AuditResult }) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId: result.publicId,
          email,
          companyName,
          role,
          teamSize: result.input.teamSize,
          wantsConsultation: result.segment === "high-savings",
          website,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error("Could not submit lead");
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-foreground text-background">
            <Mail className="size-5" />
          </div>
          <div>
            <CardTitle>
              {result.segment === "high-savings"
                ? "Get help capturing this saving"
                : "Email me this report"}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Save this report and receive a copy in your inbox.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
          <input
            className="hidden"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            placeholder="Website"
          />

          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-foreground/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Company"
            className="rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-foreground/20"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <input
            placeholder="Role"
            className="rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-foreground/20"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <Button disabled={status === "loading"}>
            {status === "loading"
              ? "Sending..."
              : result.segment === "high-savings"
                ? "Request review"
                : "Send report"}
          </Button>
        </form>

        {status === "success" && (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Report request saved. If email sending is enabled for this
            recipient, the report will arrive shortly.
          </p>
        )}

        {status === "error" && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Something went wrong. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}