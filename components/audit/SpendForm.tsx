"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { TOOL_PRICING } from "@/lib/audit/pricing";
import { AuditInput, ToolName, UseCase, CompanyStage } from "@/lib/audit/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STORAGE_KEY = "stacksaver-audit-draft";

const fieldLabelClass = "mb-2 block text-sm font-medium";

const defaultInput: AuditInput = {
  companyStage: "seed",
  teamSize: 8,
  engineeringTeamSize: 5,
  useCase: "coding",
  tools: [
    {
      id: nanoid(),
      tool: "cursor",
      plan: "Pro",
      monthlySpend: 100,
      seats: 5,
      usageIntensity: "heavy",
    },
  ],
};

export function SpendForm() {
  const router = useRouter();
  const [form, setForm] = useState<AuditInput>(defaultInput);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {
        setForm(defaultInput);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  function updateTool(index: number, key: string, value: string | number) {
    const tools = [...form.tools];

    tools[index] = {
      ...tools[index],
      [key]: value,
    };

    if (key === "tool") {
      const selectedTool = value as ToolName;
      tools[index].plan = TOOL_PRICING[selectedTool].plans[0].name;
    }

    setForm({ ...form, tools });
  }

  function addTool() {
    setForm({
      ...form,
      tools: [
        ...form.tools,
        {
          id: nanoid(),
          tool: "chatgpt",
          plan: "Plus",
          monthlySpend: 20,
          seats: 1,
          usageIntensity: "moderate",
        },
      ],
    });
  }

  function removeTool(index: number) {
    if (form.tools.length === 1) return;

    setForm({
      ...form,
      tools: form.tools.filter((_, i) => i !== index),
    });
  }

  async function submitAudit() {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Could not create audit");
      }

      localStorage.removeItem(STORAGE_KEY);
      router.push(`/audit/${data.publicId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle>Run your AI spend audit</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-5 md:grid-cols-4">
          <div>
            <Label className={fieldLabelClass}>Company stage</Label>
            <Select
              value={form.companyStage}
              onValueChange={(value) =>
                setForm({ ...form, companyStage: value as CompanyStage })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Solo</SelectItem>
                <SelectItem value="pre-seed">Pre-seed</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="series-a">Series A</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={fieldLabelClass}>Total team size</Label>
            <Input
              className="h-10"
              type="number"
              value={form.teamSize}
              onChange={(e) =>
                setForm({ ...form, teamSize: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <Label className={fieldLabelClass}>Engineering team size</Label>
            <Input
              className="h-10"
              type="number"
              value={form.engineeringTeamSize}
              onChange={(e) =>
                setForm({
                  ...form,
                  engineeringTeamSize: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <Label className={fieldLabelClass}>Primary use case</Label>
            <Select
              value={form.useCase}
              onValueChange={(value) =>
                setForm({ ...form, useCase: value as UseCase })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {form.tools.map((tool, index) => (
            <div
              key={tool.id}
              className="grid gap-5 rounded-2xl border bg-muted/20 p-4 md:grid-cols-6"
            >
              <div>
                <Label className={fieldLabelClass}>Tool</Label>
                <Select
                  value={tool.tool}
                  onValueChange={(value) =>
                    updateTool(index, "tool", value as ToolName)
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TOOL_PRICING).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={fieldLabelClass}>Plan</Label>
                <Select
                  value={tool.plan}
                  onValueChange={(value) => updateTool(index, "plan", value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TOOL_PRICING[tool.tool].plans.map((plan) => (
                      <SelectItem key={plan.name} value={plan.name}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={fieldLabelClass}>Monthly spend</Label>
                <Input
                  className="h-10"
                  type="number"
                  value={tool.monthlySpend}
                  onChange={(e) =>
                    updateTool(index, "monthlySpend", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label className={fieldLabelClass}>Seats</Label>
                <Input
                  className="h-10"
                  type="number"
                  value={tool.seats}
                  onChange={(e) =>
                    updateTool(index, "seats", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label className={fieldLabelClass}>Usage</Label>
                <Select
                  value={tool.usageIntensity}
                  onValueChange={(value) =>
                    updateTool(index, "usageIntensity", value)
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeTool(index)}
                  className="h-10 w-full"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={addTool}>
            Add another tool
          </Button>

          <Button
            type="button"
            onClick={submitAudit}
            disabled={isSubmitting}
            className="sm:ml-auto"
          >
            {isSubmitting ? "Generating audit..." : "Generate audit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}