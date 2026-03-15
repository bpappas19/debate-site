"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      if (!supabase) {
        setError("Supabase not configured.");
        setLoading(false);
        return;
      }
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-10">
          <h1 className="text-[#0d121b] dark:text-white text-4xl font-black leading-tight tracking-tight">
            Sign in
          </h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg font-normal mt-2">
            Sign in to create debates and post arguments.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-[#e7ebf3] dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[#0d121b] dark:text-white text-base font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full h-12 rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent px-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[#0d121b] dark:text-white text-base font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full h-12 rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent px-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#135bec] text-white font-bold rounded-lg hover:bg-[#135bec]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#135bec]/20"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#4c669a] dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href={redirectTo !== "/" ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup"} className="text-[#135bec] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6">
          <Link href="/" className="text-sm text-[#4c669a] dark:text-slate-400 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="py-10">
          <div className="mx-auto max-w-md text-center text-[#4c669a] dark:text-slate-400">
            Loading…
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
