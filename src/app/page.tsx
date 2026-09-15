import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">SmartCare Compliance</h1>
      <p className="mt-3 max-w-md text-slate-600">
        Micro-learning, compliance tracking, and state-ready certification for child
        care staff — bilingual, mobile-first.
      </p>
      <Link
        href="/login"
        className="mt-8 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white"
      >
        Sign in
      </Link>
    </main>
  );
}
