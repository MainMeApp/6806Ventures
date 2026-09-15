"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPreferredLocale } from "@/lib/actions/locale";

export function LocaleSwitcher({ current, label }: { current: "en" | "es"; label: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const next = current === "en" ? "es" : "en";

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await setPreferredLocale(next);
          router.refresh();
        })
      }
      className="text-sm text-slate-500 underline disabled:opacity-60"
    >
      {label}
    </button>
  );
}
