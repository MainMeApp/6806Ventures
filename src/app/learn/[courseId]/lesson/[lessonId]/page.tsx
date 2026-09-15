import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { LessonPlayer } from "./lesson-player";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { courseId, lessonId } = await params;

  const [enrollment, lesson] = await Promise.all([
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    }),
    prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { quiz: { include: { questions: { orderBy: { order: "asc" } } } } },
    }),
  ]);

  if (!enrollment || !lesson) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href={`/learn/${courseId}`} className="text-sm text-slate-500 underline">
        &larr; Back to course
      </Link>
      <h1 className="mt-2 mb-4 text-xl font-semibold">{lesson.title}</h1>

      {/* Video provider stub — swap for a Cloudflare Stream / Mux embed using lesson.videoAssetId */}
      <div className="mb-4 flex aspect-video items-center justify-center rounded-lg bg-slate-900 text-sm text-slate-300">
        Video player ({lesson.videoProvider ?? "none"}: {lesson.videoAssetId ?? "n/a"}) ·{" "}
        {lesson.durationSeconds ? `${Math.round(lesson.durationSeconds / 60)} min` : ""}
      </div>

      {lesson.bodyMarkdown && <p className="mb-6 text-sm text-slate-600">{lesson.bodyMarkdown}</p>}

      <LessonPlayer
        enrollmentId={enrollment.id}
        lessonId={lesson.id}
        courseId={courseId}
        durationSeconds={lesson.durationSeconds ?? 0}
        quiz={
          lesson.quiz
            ? {
                passThreshold: lesson.quiz.passThreshold,
                questions: lesson.quiz.questions.map((q) => ({
                  id: q.id,
                  prompt: q.prompt,
                  choices: q.choices as string[],
                })),
              }
            : null
        }
      />
    </main>
  );
}
