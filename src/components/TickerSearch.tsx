"use client";

/**
 * Stock-specific search. Groups results into:
 * - Stocks (by ticker/company)
 * - Debates (by debate question)
 * - Categories (simple: Stocks)
 *
 * Uses merged debates so user-created stocks appear in search.
 */
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDebates } from "@/contexts/DebatesContext";
import type { StockMetadata } from "@/lib/types";

export default function TickerSearch({
  placeholder = "Search by ticker or company...",
  className = "",
}: {
  placeholder?: string;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const { getMergedDebates } = useDebates();
  const stockDebates = useMemo(
    () => getMergedDebates().filter((d) => d.categoryType === "stocks"),
    [getMergedDebates]
  );

  const trimmedQuery = query.trim().toLowerCase();

  const { stockMatches, debateMatches } = useMemo(() => {
    if (!trimmedQuery) {
      // Empty state: trending tickers + debates
      const trendingTickers = ["nvda", "tsla", "pltr", "meta", "sofi"];
      const stocks = trendingTickers
        .map((sym) =>
          stockDebates.find((d) => d.symbolOrSlug.toLowerCase() === sym)
        )
        .filter(Boolean) as typeof stockDebates;
      const debates = stockDebates.slice(0, 5);
      return { stockMatches: stocks, debateMatches: debates };
    }

    const scored = [...stockDebates].map((d) => {
      const meta = d.metadata as unknown as StockMetadata | undefined;
      const ticker = (meta?.ticker || d.symbolOrSlug).toLowerCase();
      const name = d.entityName.toLowerCase();
      const question = d.debateQuestion.toLowerCase();

      let score = 0;
      if (ticker === trimmedQuery) score += 100;
      else if (ticker.startsWith(trimmedQuery)) score += 80;
      else if (ticker.includes(trimmedQuery)) score += 60;

      if (name.includes(trimmedQuery)) score += 40;
      if (question.includes(trimmedQuery)) score += 20;

      return { debate: d, score };
    });

    const sorted = scored
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.debate);

    const stockMatches = sorted.slice(0, 5);
    const debateMatches = sorted
      .filter(
        (d) =>
          !stockMatches.some(
            (s) => s.id === d.id
          )
      )
      .slice(0, 5);

    return { stockMatches, debateMatches };
  }, [stockDebates, trimmedQuery]);

  const handleSelectStock = (symbolOrSlug: string) => {
    setQuery("");
    setFocused(false);
    router.push(`/stocks/${symbolOrSlug}`);
  };

  const handleSelectDebate = (symbolOrSlug: string) => {
    setQuery("");
    setFocused(false);
    router.push(`/debate/stocks/${symbolOrSlug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockMatches[0]) handleSelectStock(stockMatches[0].symbolOrSlug);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 md:pl-3 flex items-center pointer-events-none text-gray-400">
            <span className="material-symbols-outlined !text-[18px] md:!text-[20px]">search</span>
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            className="block w-full min-w-0 pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#135bec] text-sm placeholder-gray-500 transition-all"
          />
        </div>
      </form>
      {focused && (stockMatches.length > 0 || debateMatches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
          {/* Stocks group */}
          {stockMatches.length > 0 && (
            <div className="border-b border-gray-100 dark:border-gray-700">
              <div className="px-4 pt-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Stocks
              </div>
              {stockMatches.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onMouseDown={() => handleSelectStock(d.symbolOrSlug)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-mono font-bold text-[#135bec]">
                      {(
                        (d.metadata as unknown as StockMetadata | undefined)
                          ?.ticker || d.symbolOrSlug
                      ).toUpperCase()}
                    </span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">
                      {d.entityName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">View stock page</span>
                </button>
              ))}
            </div>
          )}

          {/* Debates group */}
          {debateMatches.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Debates
              </div>
              {debateMatches.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onMouseDown={() => handleSelectDebate(d.symbolOrSlug)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between gap-2"
                >
                  <div className="text-left">
                    <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                      {d.debateQuestion}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {d.entityName}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">Open debate</span>
                </button>
              ))}
            </div>
          )}

          {/* Categories group (simple for now) */}
          <div className="border-t border-gray-100 dark:border-gray-700">
            <div className="px-4 pt-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Categories
            </div>
            <button
              type="button"
              onMouseDown={() => {
                setQuery("");
                setFocused(false);
                router.push("/category/stocks");
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between gap-2"
            >
              <span className="text-sm text-gray-900 dark:text-gray-100">
                Stocks
              </span>
              <span className="text-xs text-gray-400">View category</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
