"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitLessonProgress } from "@/lib/actions/learning";

interface Quiz {
  passThreshold: number;
  questions: { id: string; prompt: string; choices: string[] }[];
}

export function LessonPlayer({
  enrollmentId,
  lessonId,
  courseId,
  durationSeconds,
  quiz,
}: {
  enrollmentId: string;
  lessonId: string;
  courseId: string;
  durationSeconds: number;
  quiz: Quiz | null;
}) {
  const [watched, setWatched] = useState(false);
  const [answers, setAnswers] = useState<number[]>(quiz ? Array(quiz.questions.length).fill(-1) : []);
  const [result, setResult] = useState<{ passed: boolean; quizScore: number | null } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const canSubmit = watched && (!quiz || answers.every((a) => a >= 0));

  function submit() {
    startTransition(async () => {
      const res = await submitLessonProgress({
        enrollmentId,
        lessonId,
        watchedSeconds: durationSeconds,
        quizAnswers: quiz ? answers : undefined,
      });
      setResult(res);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {!watched && (
        <button
          onClick={() => setWatched(true)}
          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white"
        >
          Mark video as watched
        </button>
      )}

      {watched && quiz && (
        <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium">
            Quiz — pass with {quiz.passThreshold}% or higher
          </p>
          {quiz.questions.map((q, qi) => (
            <div key={q.id}>
              <p className="mb-2 text-sm">{q.prompt}</p>
              <div className="space-y-1">
                {q.choices.map((choice, ci) => (
                  <label key={ci} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[qi] === ci}
                      onChange={() =>
                        setAnswers((prev) => prev.map((a, i) => (i === qi ? ci : a)))
                      }
                    />
                    {choice}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {result && (
        <p className={`text-sm font-medium ${result.passed ? "text-green-700" : "text-red-600"}`}>
          {result.passed
            ? "Lesson complete."
            : `Score: ${result.quizScore}%. You need ${quiz?.passThreshold}% to pass — try again.`}
        </p>
      )}

      {watched && (
        <button
          disabled={!canSubmit || pending}
          onClick={submit}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Submitting..." : "Submit"}
        </button>
      )}

      {result?.passed && (
        <a href={`/learn/${courseId}`} className="block text-sm text-blue-600 underline">
          Back to course
        </a>
      )}
    </div>
  );
}
