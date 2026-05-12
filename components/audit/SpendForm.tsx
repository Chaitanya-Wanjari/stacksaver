"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { runAudit } from "@/lib/audit/engine";
import { AuditInput, AuditResult, ToolName, UseCase } from "@/lib/audit/types";
import { PRICING, TOOL_LABELS } from "@/lib/audit/pricing";
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

const defaultInput: AuditInput = {
  teamSize: 5,
  useCase: "coding",
  tools: [
    {
      id: nanoid(),
      tool: "cursor",
      plan: "Pro",
      monthlySpend: 100,
      seats: 5,
    },
  ],
};

interface SpendFormProps {
  onResult: (result: AuditResult) => void;
}

export function SpendForm({ onResult }: SpendFormProps) {
  const [form, setForm] = useState<AuditInput>(defaultInput);

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
    const nextTools = [...form.tools];
    nextTools[index] = {
      ...nextTools[index],
      [key]: value,
    };

    if (key === "tool") {
      const tool = value as ToolName;
      nextTools[index].plan = PRICING[tool][0].plan;
    }

    setForm({ ...form, tools: nextTools });
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

  function submit() {
    const result = runAudit(form);
    localStorage.setItem(`stacksaver-result-${result.id}`, JSON.stringify(result));
    onResult(result);
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Run your AI spend audit</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Team size</Label>
            <Input
              type="number"
              value={form.teamSize}
              onChange={(e) =>
                setForm({ ...form, teamSize: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <Label>Primary use case</Label>
            <Select
              value={form.useCase}
              onValueChange={(value) =>
                setForm({ ...form, useCase: value as UseCase })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {form.tools.map((tool, index) => (
            <div
              key={tool.id}
              className="grid gap-3 rounded-xl border p-4 md:grid-cols-5"
            >
              <div>
                <Label>Tool</Label>
                <Select
                  value={tool.tool}
                  onValueChange={(value) =>
                    updateTool(index, "tool", value as ToolName)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TOOL_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Plan</Label>
                <Select
                  value={tool.plan}
                  onValueChange={(value) => updateTool(index, "plan", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICING[tool.tool].map((p) => (
                      <SelectItem key={p.plan} value={p.plan}>
                        {p.plan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Monthly spend</Label>
                <Input
                  type="number"
                  value={tool.monthlySpend}
                  onChange={(e) =>
                    updateTool(index, "monthlySpend", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Seats</Label>
                <Input
                  type="number"
                  value={tool.seats}
                  onChange={(e) =>
                    updateTool(index, "seats", Number(e.target.value))
                  }
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeTool(index)}
                  className="w-full"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={addTool}>
            Add another tool
          </Button>

          <Button type="button" onClick={submit} className="sm:ml-auto">
            Generate audit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}