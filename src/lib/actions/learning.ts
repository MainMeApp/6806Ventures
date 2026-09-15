"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { issueCertificateForEnrollment } from "@/lib/certificate";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");
  return session.user;
}

async function getUserCenterId(userId: string) {
  const membership = await prisma.centerStaff.findFirst({
    where: { userId, endedAt: null },
  });
  if (!membership) throw new Error("User is not assigned to a center.");
  return membership.centerId;
}

export async function enrollInCourse(courseId: string) {
  const user = await requireUser();
  const centerId = await getUserCenterId(user.id);

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId } },
    update: {},
    create: {
      userId: user.id,
      courseId,
      centerId,
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });

  revalidatePath("/learn");
  return enrollment;
}

export async function submitLessonProgress(input: {
  enrollmentId: string;
  lessonId: string;
  watchedSeconds: number;
  quizAnswers?: number[]; // index of the chosen choice per question, in order
}) {
  const user = await requireUser();

  const enrollment = await prisma.enrollment.findUniqueOrThrow({
    where: { id: input.enrollmentId },
  });
  if (enrollment.userId !== user.id) throw new Error("Not your enrollment.");

  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: input.lessonId },
    include: { quiz: { include: { questions: true } } },
  });

  let quizScore: number | null = null;
  if (lesson.quiz) {
    const questions = lesson.quiz.questions.sort((a, b) => a.order - b.order);
    const answers = input.quizAnswers ?? [];
    const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    quizScore = questions.length === 0 ? 100 : Math.round((correct / questions.length) * 100);
  }

  const passed = lesson.quiz ? (quizScore ?? 0) >= lesson.quiz.passThreshold : true;

  await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: input.enrollmentId, lessonId: input.lessonId } },
    update: {
      watchedSeconds: input.watchedSeconds,
      completed: passed,
      quizScore,
      completedAt: passed ? new Date() : null,
    },
    create: {
      enrollmentId: input.enrollmentId,
      lessonId: input.lessonId,
      watchedSeconds: input.watchedSeconds,
      completed: passed,
      quizScore,
      completedAt: passed ? new Date() : null,
    },
  });

  if (passed) {
    await maybeCompleteCourse(input.enrollmentId);
  }

  revalidatePath(`/learn`);
  return { passed, quizScore };
}

/** Marks the enrollment COMPLETED and issues a certificate once every lesson is done. */
async function maybeCompleteCourse(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUniqueOrThrow({
    where: { id: enrollmentId },
    include: {
      course: { include: { modules: { include: { lessons: true } } } },
      lessonProgress: true,
    },
  });

  const allLessonIds = enrollment.course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const completedLessonIds = new Set(
    enrollment.lessonProgress.filter((p) => p.completed).map((p) => p.lessonId)
  );
  const allDone = allLessonIds.every((id) => completedLessonIds.has(id));
  if (!allDone) return;

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await issueCertificateForEnrollment(enrollmentId);
}
