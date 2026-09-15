import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeUserCompliance } from "@/lib/compliance-engine";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function LearnHome() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [membership, currentUser] = await Promise.all([
    prisma.centerStaff.findFirst({
      where: { userId: session.user.id, endedAt: null },
      include: { center: true },
    }),
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
  ]);
  const locale = currentUser.preferredLocale === "es" ? "es" : "en";
  const t = getDictionary(locale);

  if (!membership) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <p>Your account isn&apos;t assigned to a center yet. Contact your director.</p>
      </main>
    );
  }

  const [compliance, courses, enrollments] = await Promise.all([
    computeUserCompliance(session.user.id, membership.centerId),
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      include: { translations: true, categories: { include: { stateCategory: true } } },
    }),
    prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: { certificate: true },
    }),
  ]);

  const enrollmentByCourse = new Map(enrollments.map((e) => [e.courseId, e]));
  const gaps = compliance.requirements.filter((r) => !r.met);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Hi, {compliance.name.split(" ")[0]}</h1>
          <p className="text-sm text-slate-500">{membership.center.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <LocaleSwitcher current={locale} label={t.switchLanguage} />
          <SignOutButton label={t.signOut} />
        </div>
      </div>

      <section className="mb-8 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-2 font-medium">
          {compliance.compliant ? `${t.upToDate} ✅` : t.recommended}
        </h2>
        {compliance.compliant ? (
          <p className="text-sm text-slate-500">{t.upToDateBody}</p>
        ) : (
          <ul className="space-y-1 text-sm text-slate-600">
            {gaps.map((g) => (
              <li key={g.requirementId}>
                {g.description} — {g.hoursCompleted.toFixed(1)} / {g.minHours.toFixed(1)} hrs
                {g.categoryCode ? ` (${g.categoryCode})` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <h2 className="mb-3 font-medium">{t.courses}</h2>
      <ul className="space-y-3">
        {courses.map((course) => {
          const translation = course.translations.find((tr) => tr.locale === locale);
          const enrollment = enrollmentByCourse.get(course.id);
          const categoryCodes = course.categories.map((c) => c.stateCategory.code).join(", ");
          return (
            <li key={course.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{translation?.title ?? course.title}</p>
                  <p className="text-sm text-slate-500">
                    {translation?.description ?? course.description}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                    {categoryCodes} · {Number(course.clockHours).toFixed(1)} {t.clockHours}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {enrollment?.certificate ? (
                    <a
                      href={enrollment.certificate.pdfPath ?? "#"}
                      target="_blank"
                      className="text-sm font-medium text-green-700 underline"
                    >
                      {t.certificate}
                    </a>
                  ) : (
                    <Link
                      href={`/learn/${course.id}`}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
                    >
                      {enrollment ? t.continue : t.start}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
