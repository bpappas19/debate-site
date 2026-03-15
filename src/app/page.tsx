"use client";

/**
 * Homepage: stock-focused at launch. Hero, ticker search, trending / bull / bear / most active.
 * Fetches a limited set of debates (ordered by created_at) for display and search.
 */
import Link from "next/link";
import { useMemo, useEffect } from "react";
import { useDebates } from "@/contexts/DebatesContext";
import DebateCard from "@/components/DebateCard";
import TickerSearch from "@/components/TickerSearch";
import StockMetaBar from "@/components/StockMetaBar";
import type { Debate } from "@/lib/types";
import type { StockMetadata } from "@/lib/types";

function useStockDebates() {
  const { getMergedDebates } = useDebates();
  return useMemo(() => {
    const all = getMergedDebates();
    return all.filter((d) => d.categoryType === "stocks");
  }, [getMergedDebates]);
}

function useTrending(stockDebates: Debate[]) {
  return useMemo(() => {
    return [...stockDebates]
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 6);
  }, [stockDebates]);
}

function useTopBull(stockDebates: Debate[]) {
  return useMemo(() => {
    return [...stockDebates]
      .filter((d) => d.totalVotes > 0)
      .sort((a, b) => (b.proVotes / b.totalVotes) - (a.proVotes / a.totalVotes))
      .slice(0, 3);
  }, [stockDebates]);
}

function useTopBear(stockDebates: Debate[]) {
  return useMemo(() => {
    return [...stockDebates]
      .filter((d) => d.totalVotes > 0)
      .sort((a, b) => (b.conVotes / b.totalVotes) - (a.conVotes / a.totalVotes))
      .slice(0, 3);
  }, [stockDebates]);
}

function useMostActive(
  stockDebates: Debate[],
  getMergedArguments: (debateId: string) => { length: number }
) {
  return useMemo(() => {
    return [...stockDebates]
      .map((d) => ({ debate: d, count: getMergedArguments(d.id).length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((x) => x.debate);
  }, [stockDebates, getMergedArguments]);
}

function StockDebateCard({ debate }: { debate: Debate }) {
  const meta = debate.categoryType === "stocks" && debate.metadata
    ? <StockMetaBar meta={debate.metadata as unknown as StockMetadata} className="mb-2" />
    : null;
  return (
    <DebateCard
      debate={debate}
      proLabel="Bull"
      conLabel="Bear"
      entityMeta={meta}
    />
  );
}

export default function HomePage() {
  const stockDebates = useStockDebates();
  const { getMergedArguments, fetchHomeDebates, debatesLoading, debatesError } = useDebates();

  useEffect(() => {
    fetchHomeDebates(50);
  }, [fetchHomeDebates]);

  const trending = useTrending(stockDebates);
  const topBull = useTopBull(stockDebates);
  const topBear = useTopBear(stockDebates);
  const mostActive = useMostActive(stockDebates, getMergedArguments);

  if (debatesLoading) {
    return (
      <main className="py-10">
        <div className="text-[#4c669a] dark:text-[#94a3b8] text-center">Loading debates…</div>
      </main>
    );
  }
  if (debatesError) {
    return (
      <main className="py-10">
        <div className="max-w-xl mx-auto p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
          {debatesError}
        </div>
        <p className="text-center mt-4">
          <Link href="/" className="text-[#135bec] font-bold hover:underline">Retry</Link>
        </p>
      </main>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="mb-12 md:mb-16">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-[#0d121b] dark:text-white tracking-tight mb-4">
            Debate Stocks. Test Conviction. See Both Sides.
          </h1>
          <p className="text-lg text-[#4c669a] dark:text-[#94a3b8] mb-2">
            The best place to test conviction on market ideas.
          </p>
          <p className="text-sm text-[#4c669a] dark:text-[#94a3b8]">
            Starting with stocks — more categories coming later.
          </p>
        </div>
        <div className="max-w-xl mx-auto">
          <TickerSearch placeholder="Search by ticker or company name..." />
        </div>
      </section>

      {/* Trending stock debates */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0d121b] dark:text-white">
            Trending Stock Debates
          </h2>
          <Link
            href="/category/stocks"
            className="text-sm font-bold text-[#135bec] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {trending.map((d) => (
            <StockDebateCard key={d.id} debate={d} />
          ))}
        </div>
      </section>

      {/* Top bull / Top bear */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <section>
          <h2 className="text-xl font-bold text-[#0d121b] dark:text-white mb-4">
            Top Bull Cases
          </h2>
          <div className="space-y-4">
            {topBull.map((d) => (
              <StockDebateCard key={d.id} debate={d} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#0d121b] dark:text-white mb-4">
            Top Bear Cases
          </h2>
          <div className="space-y-4">
            {topBear.map((d) => (
              <StockDebateCard key={d.id} debate={d} />
            ))}
          </div>
        </section>
      </div>

      {/* Most active debates */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#0d121b] dark:text-white mb-6">
          Most Active Debates
        </h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {mostActive.map((d) => (
            <StockDebateCard key={d.id} debate={d} />
          ))}
        </div>
      </section>
    </>
  );
}
