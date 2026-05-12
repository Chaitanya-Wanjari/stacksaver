"use client";

import { useState } from "react";
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

      if (!res.ok) throw new Error("Could not submit lead");

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {result.segment === "high-savings"
            ? "Get help capturing this saving"
            : "Email me this report"}
        </CardTitle>
      </CardHeader>

      <CardContent>
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
            className="rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Company"
            className="rounded-md border px-3 py-2"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <input
            placeholder="Role"
            className="rounded-md border px-3 py-2"
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
          <p className="mt-3 text-sm text-green-600">
            Report request saved. Check your email if email sending is configured.
          </p>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-red-600">
            Something went wrong. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}