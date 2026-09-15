import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { EnrollButton } from "./enroll-button";

export default async function CourseOverview({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
      translations: true,
    },
  });
  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    include: { lessonProgress: true, certificate: true },
  });

  const translation = course.translations.find((t) => t.locale === session.user.preferredLocale);
  const completedLessonIds = new Set(
    enrollment?.lessonProgress.filter((p) => p.completed).map((p) => p.lessonId) ?? []
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/learn" className="text-sm text-slate-500 underline">
        &larr; Back to courses
      </Link>
      <h1 className="mt-2 text-xl font-semibold">{translation?.title ?? course.title}</h1>
      <p className="mt-1 text-sm text-slate-600">{translation?.description ?? course.description}</p>

      {!enrollment && (
        <div className="mt-4">
          <EnrollButton courseId={course.id} />
        </div>
      )}

      {enrollment?.certificate && (
        <a
          href={enrollment.certificate.pdfPath ?? "#"}
          target="_blank"
          className="mt-4 inline-block rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white"
        >
          Download your certificate
        </a>
      )}

      <div className="mt-6 space-y-4">
        {course.modules.map((module) => (
          <div key={module.id}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {module.title}
            </h2>
            <ul className="space-y-2">
              {module.lessons.map((lesson) => {
                const done = completedLessonIds.has(lesson.id);
                return (
                  <li
                    key={lesson.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <span className="text-sm">
                      {done ? "✅" : "▶️"} {lesson.title}
                    </span>
                    {enrollment ? (
                      <Link
                        href={`/learn/${course.id}/lesson/${lesson.id}`}
                        className="text-sm font-medium text-blue-600 underline"
                      >
                        {done ? "Review" : "Start"}
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400">Enroll to start</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
