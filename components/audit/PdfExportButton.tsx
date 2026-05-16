"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import { AuditResult } from "@/lib/audit/types";
import { Button } from "@/components/ui/button";

export function PdfExportButton({ result }: { result: AuditResult }) {
  function exportPdf() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("StackSaver AI Spend Audit", 14, 20);

    doc.setFontSize(11);
    doc.text(`Public ID: ${result.publicId}`, 14, 32);
    doc.text(`Current spend: $${result.totalCurrentSpend}/month`, 14, 42);
    doc.text(`Recommended spend: $${result.totalRecommendedSpend}/month`, 14, 52);
    doc.text(`Monthly savings: $${result.totalMonthlySavings}/month`, 14, 62);
    doc.text(`Annual savings: $${result.totalAnnualSavings}/year`, 14, 72);
    doc.text(`Efficiency score: ${result.efficiencyScore}/100`, 14, 82);

    doc.setFontSize(14);
    doc.text("Summary", 14, 98);

    doc.setFontSize(10);
    const summary = result.personalizedSummary || result.summary;
    const summaryLines = doc.splitTextToSize(summary, 180);
    doc.text(summaryLines, 14, 108);

    let y = 128 + summaryLines.length * 5;

    doc.setFontSize(14);
    doc.text("Recommendations", 14, y);
    y += 10;

    doc.setFontSize(10);

    result.recommendations.forEach((rec, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(`${index + 1}. ${rec.toolLabel}`, 14, y);
      y += 6;
      doc.text(`Action: ${rec.action}`, 18, y);
      y += 6;
      doc.text(`Savings: $${rec.monthlySavings}/month`, 18, y);
      y += 6;

      const reasonLines = doc.splitTextToSize(`Reason: ${rec.reason}`, 170);
      doc.text(reasonLines, 18, y);
      y += reasonLines.length * 5 + 6;
    });

    doc.save(`stacksaver-audit-${result.publicId}.pdf`);
  }

  return (
    <Button variant="outline" onClick={exportPdf}>
      <Download className="mr-2 size-4" />
      Export PDF
    </Button>
  );
}