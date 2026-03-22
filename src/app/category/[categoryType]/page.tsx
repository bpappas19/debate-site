"use client";

/**
 * Category page: list debates for a category. Same inclusion as homepage (eligible only).
 */
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { getCategoryByType } from "@/lib/categories";
import { useDebates } from "@/contexts/DebatesContext";
import DebateCard from "@/components/DebateCard";
import StockMetaBar from "@/components/StockMetaBar";
import { isEligibleForHomepage } from "@/lib/homePageEligibility";
import type { Debate } from "@/lib/types";
import type { StockMetadata } from "@/lib/types";

export default function CategoryPage() {
  const params = useParams();
  const categoryType = (params?.categoryType as string) ?? "";
  const {
    getCategoryDebates,
    fetchCategoryDebates,
    getMergedArguments,
    loadArgumentsForDebate,
    categoryLoading,
    categoryError,
  } = useDebates();

  useEffect(() => {
    if (categoryType) fetchCategoryDebates(categoryType);
  }, [categoryType, fetchCategoryDebates]);

  const config = getCategoryByType(categoryType.toLowerCase());
  const rawDebates = getCategoryDebates(categoryType);
  const debates = useMemo(
    () => rawDebates.filter((d) => isEligibleForHomepage(d)),
    [rawDebates]
  );

  // Load arguments for each debate so cards show same bull/bear % as home and detail page
  useEffect(() => {
    rawDebates.forEach((d) => loadArgumentsForDebate(d.id));
  }, [categoryType, rawDebates, loadArgumentsForDebate]);

  if (categoryLoading) {
    return (
      <main className="py-10">
        <div className="text-[#4c669a] dark:text-[#94a3b8]">Loading debates…</div>
      </main>
    );
  }
  if (categoryError) {
    return (
      <main className="py-10">
        <div className="mb-8 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
          {categoryError}
        </div>
        <Link href="/" className="text-[#135bec] font-bold hover:underline">← Back to Home</Link>
      </main>
    );
  }
  if (!config) {
    return (
      <main className="py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0d121b] dark:text-white mb-2">
            Not found
          </h1>
          <Link href="/" className="text-[#135bec] font-bold hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  if (!config.active && debates.length === 0) {
    return (
      <main className="py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0d121b] dark:text-white mb-2">
            {config.label}
          </h1>
          <p className="text-[#4c669a] dark:text-[#94a3b8]">
            Coming soon. We’re starting with stocks — more categories later.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-[#135bec] font-bold hover:underline"
          >
            ← Back to Stock Debates
          </Link>
        </div>
      </main>
    );
  }

  const proLabel = categoryType === "stocks" ? "Bull" : "Pro";
  const conLabel = categoryType === "stocks" ? "Bear" : "Con";

  const renderEntityMeta = (debate: Debate) => {
    if (debate.categoryType === "stocks" && debate.metadata) {
      return (
        <StockMetaBar
          meta={debate.metadata as unknown as StockMetadata}
          className="mb-2"
        />
      );
    }
    return null;
  };

  return (
    <main className="pt-2 pb-6 md:py-6 min-w-0 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {config.label} Debates
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
            {debates.length} debate{debates.length !== 1 ? "s" : ""} in this category
          </p>
        </div>
        <Link
          href="/"
          className="text-xs md:text-sm font-medium text-[#135bec] hover:underline shrink-0 self-start sm:self-auto"
        >
          ← Home
        </Link>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-stretch min-w-0">
        {debates.map((debate) => {
          const args = getMergedArguments(debate.id);
          const proCountFromArgs = args.filter((a) => a.side === "PRO").length;
          const conCountFromArgs = args.filter((a) => a.side === "CON").length;
          return (
            <DebateCard
              key={debate.id}
              debate={debate}
              proLabel={proLabel}
              conLabel={conLabel}
              entityMeta={renderEntityMeta(debate)}
              argumentCount={args.length}
              proCountFromArgs={proCountFromArgs}
              conCountFromArgs={conCountFromArgs}
            />
          );
        })}
      </div>
    </main>
  );
}
