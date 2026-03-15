"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { useDebates } from "@/contexts/DebatesContext";
import { STOCK_SECTORS } from "@/lib/stockSectors";
import type { UpdateDebatePayload } from "@/lib/types";
import type { StockMetadata } from "@/lib/types";

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function EditDebatePage() {
  const params = useParams();
  const router = useRouter();
  const categoryType = (params?.categoryType as string) ?? "";
  const entitySlug = (params?.entitySlug as string) ?? "";

  const {
    getMergedDebate,
    getMergedDebates,
    fetchHomeDebates,
    fetchDebate,
    updateDebate,
    getMergedArguments,
    debateLoading,
  } = useDebates();

  const debate =
    getMergedDebate(categoryType, entitySlug) ??
    getMergedDebates().find(
      (d) =>
        d.categoryType.toLowerCase() === (categoryType || "").toLowerCase() &&
        d.symbolOrSlug.toLowerCase() === (entitySlug || "").toLowerCase()
    );

  const [authChecking, setAuthChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ticker, setTicker] = useState("");
  const [sector, setSector] = useState("");
  const [subcategories, setSubcategories] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formInitialized = useRef(false);

  useEffect(() => {
    if (!categoryType || !entitySlug) return;
    fetchHomeDebates(50).then(() => fetchDebate(categoryType, entitySlug));
  }, [categoryType, entitySlug, fetchHomeDebates, fetchDebate]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setAuthChecking(false);
      router.replace(`/login?redirect=${encodeURIComponent(`/debate/${categoryType}/${entitySlug}/edit`)}`);
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthChecking(false);
      if (!user) {
        router.replace(`/login?redirect=${encodeURIComponent(`/debate/${categoryType}/${entitySlug}/edit`)}`);
        return;
      }
      const d = getMergedDebate(categoryType, entitySlug) ?? getMergedDebates().find(
        (x) =>
          x.categoryType.toLowerCase() === (categoryType || "").toLowerCase() &&
          x.symbolOrSlug.toLowerCase() === (entitySlug || "").toLowerCase()
      );
      if (!d) return;
      if (d.authorId != null && d.authorId !== user.id) {
        router.replace(`/debate/${categoryType}/${entitySlug}`);
        return;
      }
      setAuthorized(true);
    });
  }, [router, categoryType, entitySlug, getMergedDebate, getMergedDebates]);

  useEffect(() => {
    if (!authorized || !debate || formInitialized.current) return;
    formInitialized.current = true;
    setQuestion(debate.debateQuestion);
    setContext(debate.description ?? "");
    setImageUrl(debate.image ?? "");
    setCompanyName(debate.entityName ?? "");
    const meta = debate.metadata as StockMetadata | undefined;
    setTicker(meta?.ticker ?? debate.symbolOrSlug?.toUpperCase() ?? "");
    setSector(meta?.sector ?? "");
    setSubcategories((debate.tags ?? []).join(", "));
  }, [authorized, debate]);

  const debateForForm = debate;
  const hasExistingActivity =
    debateForForm &&
    (getMergedArguments(debateForForm.id).length > 0 ||
      ((debateForForm.totalVotes ?? 0) > 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!debateForForm) return;
    setSubmitting(true);
    setError(null);
    try {
      const metadata: StockMetadata | undefined =
        debateForForm.categoryType === "stocks" && ticker.trim()
          ? {
              ticker: ticker.trim().toUpperCase(),
              sector: sector.trim() || undefined,
            }
          : undefined;
      const payload: UpdateDebatePayload = {
        debateQuestion: question.trim(),
        description: context.trim() || undefined,
        image_url: imageUrl.trim() || null,
        entityName: companyName.trim() || question.trim().slice(0, 80),
        tags: parseTags(subcategories),
        metadata,
      };
      await updateDebate(debateForForm.id, payload);
      router.push(`/debate/${debateForForm.categoryType}/${debateForForm.symbolOrSlug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update debate.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authChecking || !authorized || (authorized && !debateForForm && debateLoading)) {
    return (
      <main className="py-10">
        <div className="mx-auto max-w-3xl text-center text-[#4c669a] dark:text-slate-400">
          Loading…
        </div>
      </main>
    );
  }

  if (authorized && !debateForForm) {
    return (
      <main className="py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[#4c669a] dark:text-slate-400 mb-4">Debate not found.</p>
          <Link href="/" className="text-[#135bec] font-bold hover:underline">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const isStocks = debateForForm.categoryType === "stocks";

  return (
    <main className="py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <Link
            href={`/debate/${categoryType}/${entitySlug}`}
            className="text-sm text-[#135bec] hover:underline mb-4 inline-block"
          >
            ← Back to debate
          </Link>
          <h1 className="text-[#0d121b] dark:text-white text-4xl font-black leading-tight tracking-tight">
            Edit Debate
          </h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg mt-2">
            Update the debate details. Only you (the author) can edit.
          </p>
        </div>

        {hasExistingActivity && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm">
            This debate has existing takes or votes. Editing the question or description may confuse readers.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-[#e7ebf3] dark:border-slate-800">
          {isStocks && (
            <div className="space-y-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-bold text-[#4c669a] dark:text-slate-400 uppercase tracking-wider">
                Stock details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                    Company name
                  </label>
                  <input
                    className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
                    placeholder="e.g., NVIDIA Corporation"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                    Ticker
                  </label>
                  <input
                    className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] font-mono uppercase"
                    placeholder="e.g., NVDA"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                  Sector (Optional)
                </label>
                <select
                  className="w-full h-12 rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent px-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option value="">Select sector...</option>
                  {STOCK_SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                  Subcategories / tags (Optional)
                </label>
                <input
                  className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
                  placeholder="e.g., AI, semiconductors"
                  value={subcategories}
                  onChange={(e) => setSubcategories(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[#0d121b] dark:text-white text-base font-semibold">
              Debate Question <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
              placeholder="e.g., Is NVIDIA fairly valued at current levels?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#0d121b] dark:text-white text-base font-semibold">
              Image URL (Optional)
            </label>
            <input
              type="url"
              className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#0d121b] dark:text-white text-base font-semibold">
              Context (Optional)
            </label>
            <textarea
              className="w-full min-h-[120px] rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
              placeholder="Add context or background..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 lg:flex-none lg:min-w-[200px] h-14 bg-[#135bec] text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving…" : "Save Changes"}
            </button>
            <Link
              href={`/debate/${categoryType}/${entitySlug}`}
              className="flex-1 lg:flex-none lg:min-w-[140px] h-14 border border-[#cfd7e7] dark:border-slate-700 text-[#0d121b] dark:text-white font-semibold rounded-lg hover:bg-[#f8f9fc] dark:hover:bg-slate-800 transition-all flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
