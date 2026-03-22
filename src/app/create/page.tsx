"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { CATEGORIES } from "@/lib/categories";
import { useDebates } from "@/contexts/DebatesContext";
import { STOCK_SECTORS } from "@/lib/stockSectors";
import type { CategoryType } from "@/lib/types";
import type { ArgumentSide } from "@/lib/types";
import type { CreateDebatePayload } from "@/lib/types";
import type { StockMetadata } from "@/lib/types";

const activeCategories = CATEGORIES.filter((c) => c.active);

/** Parse comma-separated tags into trimmed non-empty array. */
function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildPayload(
  categoryType: CategoryType,
  question: string,
  context: string,
  firstArgument: string,
  firstArgumentSide: ArgumentSide | "",
  stockFields: {
    companyName: string;
    ticker: string;
    sector: string;
    subcategories: string;
  },
  imageUrl: string
): CreateDebatePayload {
  const entityName =
    categoryType === "stocks" ? stockFields.companyName.trim() : question.slice(0, 80);
  const symbolOrSlug =
    categoryType === "stocks"
      ? stockFields.ticker.trim().toLowerCase().replace(/\s+/g, "-")
      : question
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

  const tags =
    categoryType === "stocks"
      ? parseTags(stockFields.subcategories)
      : [];

  const metadata: CreateDebatePayload["metadata"] =
    categoryType === "stocks" && stockFields.ticker.trim()
      ? ({
          ticker: stockFields.ticker.trim().toUpperCase(),
          sector: stockFields.sector || undefined,
        } satisfies StockMetadata)
      : undefined;

  const payload: CreateDebatePayload = {
    categoryType,
    debateQuestion: question,
    description: context || undefined,
    entityName,
    symbolOrSlug,
    tags,
    metadata,
    image_url: imageUrl.trim() || undefined,
    firstArgument:
      firstArgument.trim() && firstArgumentSide
        ? { content: firstArgument.trim(), side: firstArgumentSide }
        : undefined,
  };

  return payload;
}

export default function CreatePage() {
  const router = useRouter();
  const { addDebate } = useDebates();
  const [authChecking, setAuthChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [question, setQuestion] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType | "">("");
  const [context, setContext] = useState("");
  const [firstArgument, setFirstArgument] = useState("");
  const [firstArgumentSide, setFirstArgumentSide] = useState<ArgumentSide | "">("");

  const [companyName, setCompanyName] = useState("");
  const [ticker, setTicker] = useState("");
  const [sector, setSector] = useState("");
  const [subcategories, setSubcategories] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setAuthChecking(false);
      router.replace("/login?redirect=/create");
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthChecking(false);
      if (user) setAuthenticated(true);
      else router.replace("/login?redirect=/create");
    });
  }, [router]);

  const isStocks = categoryType === "stocks";

  const doSubmit = async (payload: CreateDebatePayload) => {
    setSubmitting(true);
    setError(null);
    try {
      const debate = await addDebate(payload);
      router.push(`/debate/${debate.categoryType}/${debate.symbolOrSlug}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create debate.";
      setError(msg);
      if (msg.toLowerCase().includes("signed in")) {
        router.push("/login?redirect=/create");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStocks && (!companyName.trim() || !ticker.trim())) {
      alert("Company name and ticker are required for stock debates.");
      return;
    }
    const payload = buildPayload(
      categoryType as CategoryType,
      question,
      context,
      firstArgument,
      firstArgumentSide,
      { companyName, ticker, sector, subcategories },
      imageUrl
    );
    doSubmit(payload);
  };

  const handleSaveDraft = () => {
    const payload = buildPayload(
      categoryType as CategoryType,
      question,
      context,
      firstArgument,
      firstArgumentSide,
      { companyName, ticker, sector, subcategories },
      imageUrl
    );
    doSubmit(payload);
  };

  const sideLabels = isStocks
    ? { PRO: "Bull", CON: "Bear" }
    : { PRO: "Pro", CON: "Con" };

  if (authChecking || !authenticated) {
    return (
      <main className="py-10">
        <div className="mx-auto max-w-3xl text-center text-[#4c669a] dark:text-slate-400">
          Loading…
        </div>
      </main>
    );
  }

  return (
    <main className="py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <h1 className="text-[#0d121b] dark:text-white text-4xl font-black leading-tight tracking-tight">
            Create New Debate
          </h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg font-normal mt-2">
            Start a new debate and invite others to share their perspectives.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-[#e7ebf3] dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col gap-2">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full h-14 rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent px-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] appearance-none cursor-pointer"
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value as CategoryType)}
                required
              >
                <option disabled value="">
                  Select a category...
                </option>
                {activeCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {isStocks && (
              <div className="space-y-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-bold text-[#4c669a] dark:text-slate-400 uppercase tracking-wider">
                  Stock details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                      Company name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                      placeholder="e.g., NVIDIA Corporation"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                      Ticker <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all font-mono uppercase"
                      placeholder="e.g., NVDA"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                    Sector <span className="text-[#4c669a] dark:text-slate-400 text-sm font-normal">(Optional)</span>
                  </label>
                  <select
                    className="w-full h-12 rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent px-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] appearance-none cursor-pointer"
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
                    Subcategories / tags <span className="text-[#4c669a] dark:text-slate-400 text-sm font-normal">(Optional)</span>
                  </label>
                  <input
                    className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                    placeholder="e.g., AI, semiconductors, data-center"
                    value={subcategories}
                    onChange={(e) => setSubcategories(e.target.value)}
                  />
                  <p className="text-xs text-[#4c669a] dark:text-slate-400">
                    Comma-separated. Used for filtering and discovery.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Debate Question <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-[#4c669a] dark:text-slate-400 mb-1">
                Ask a question that has two sides (e.g. Bull vs Bear for stocks).
              </p>
              <input
                className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                placeholder="e.g., Is NVIDIA fairly valued at current levels?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Image URL <span className="text-[#4c669a] dark:text-slate-400 text-sm font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Context <span className="text-[#4c669a] dark:text-slate-400 text-sm font-normal">(Optional)</span>
              </label>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                placeholder="Add context or background information..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-[#e7ebf3] dark:border-slate-800">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Add First Argument <span className="text-[#4c669a] dark:text-slate-400 text-sm font-normal">(Optional)</span>
              </label>
              <div className="flex gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setFirstArgumentSide("PRO")}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                    firstArgumentSide === "PRO"
                      ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                      : "border-[#cfd7e7] dark:border-slate-700 text-[#0d121b] dark:text-white hover:border-green-500"
                  }`}
                >
                  {sideLabels.PRO}
                </button>
                <button
                  type="button"
                  onClick={() => setFirstArgumentSide("CON")}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                    firstArgumentSide === "CON"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                      : "border-[#cfd7e7] dark:border-slate-700 text-[#0d121b] dark:text-white hover:border-red-500"
                  }`}
                >
                  {sideLabels.CON}
                </button>
              </div>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                placeholder="Write your argument here..."
                value={firstArgument}
                onChange={(e) => setFirstArgument(e.target.value)}
                disabled={!firstArgumentSide}
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 lg:flex-none lg:min-w-[200px] h-14 bg-[#135bec] text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-[#135bec]/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Publishing…" : "Publish Debate"}
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={submitting}
                className="flex-1 lg:flex-none lg:min-w-[140px] h-14 border border-[#cfd7e7] dark:border-slate-700 text-[#0d121b] dark:text-white font-semibold rounded-lg hover:bg-[#f8f9fc] dark:hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Save Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
