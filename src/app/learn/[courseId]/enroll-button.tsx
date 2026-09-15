"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollInCourse } from "@/lib/actions/learning";

export function EnrollButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await enrollInCourse(courseId);
          router.refresh();
        })
      }
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
    >
      {pending ? "Enrolling..." : "Enroll in this course"}
    </button>
  );
}
