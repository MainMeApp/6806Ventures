import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeCenterCompliance } from "@/lib/compliance-engine";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { ComplianceRing } from "@/components/compliance-ring";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let centerIds: string[] = [];

  if (session.user.platformRole === "OWNER" && session.user.organizationId) {
    const centers = await prisma.center.findMany({
      where: { organizationId: session.user.organizationId },
      select: { id: true },
    });
    centerIds = centers.map((c) => c.id);
  } else {
    const memberships = await prisma.centerStaff.findMany({
      where: { userId: session.user.id, role: "DIRECTOR", endedAt: null },
      select: { centerId: true },
    });
    centerIds = memberships.map((m) => m.centerId);
  }

  const centers = await prisma.center.findMany({ where: { id: { in: centerIds } } });
  const results = await Promise.all(centerIds.map((id) => computeCenterCompliance(id)));

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Compliance Dashboard</h1>
        <SignOutButton />
      </div>

      {centers.length === 0 && (
        <p className="text-sm text-slate-500">No centers assigned to this account.</p>
      )}

      {centers.map((center) => {
        const result = results.find((r) => r.centerId === center.id)!;
        return (
          <section key={center.id} className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-medium">{center.name}</h2>
                <p className="text-xs text-slate-400">{center.stateCode} · License {center.licenseNumber}</p>
              </div>
              <a
                href={`/api/export/compliance?centerId=${center.id}`}
                className="text-sm text-blue-600 underline"
              >
                Export CSV
              </a>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <ComplianceRing score={result.score} />
              <div className="flex-1">
                <p className="mb-2 text-sm text-slate-600">
                  {result.staffCompliant} of {result.staffTotal} staff fully compliant for{" "}
                  {result.periodStart.getUTCFullYear()}
                </p>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                      <th className="py-1">Staff</th>
                      <th className="py-1">Role</th>
                      <th className="py-1">Status</th>
                      <th className="py-1">Gaps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.staff.map((s) => {
                      const gaps = s.requirements.filter((r) => !r.met);
                      return (
                        <tr key={s.userId} className="border-b border-slate-100">
                          <td className="py-1.5">{s.name}</td>
                          <td className="py-1.5">{s.role}</td>
                          <td className="py-1.5">
                            {s.compliant ? (
                              <span className="text-green-700">Compliant</span>
                            ) : (
                              <span className="text-amber-600">Action needed</span>
                            )}
                          </td>
                          <td className="py-1.5 text-slate-500">
                            {gaps.length === 0
                              ? "—"
                              : gaps
                                  .map((g) => `${g.description} (${g.hoursCompleted}/${g.minHours}h)`)
                                  .join("; ")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
