"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ label = "Sign out" }: { label?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-slate-500 underline"
    >
      {label}
    </button>
  );
}
