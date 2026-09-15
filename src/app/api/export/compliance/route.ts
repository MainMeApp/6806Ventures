import { auth } from "@/auth";
import { computeCenterCompliance } from "@/lib/compliance-engine";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const centerId = req.nextUrl.searchParams.get("centerId");
  if (!centerId) return NextResponse.json({ error: "centerId is required" }, { status: 400 });

  const result = await computeCenterCompliance(centerId);

  const rows = [["Staff Name", "Role", "Compliant", "Requirement", "Category", "Hours Completed", "Hours Required"]];
  for (const staff of result.staff) {
    for (const req of staff.requirements) {
      rows.push([
        staff.name,
        staff.role,
        staff.compliant ? "Yes" : "No",
        req.description,
        req.categoryCode ?? "",
        req.hoursCompleted.toFixed(2),
        req.minHours.toFixed(2),
      ]);
    }
  }

  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="compliance-${centerId}-${result.periodStart.getUTCFullYear()}.csv"`,
    },
  });
}

function csvEscape(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
