"use client";

/**
 * Homepage: stock-focused at launch. Single eligible debate pool; sections derived from that pool.
 * Data: real merged debate data from fetchHomeDebates (Supabase). Same inclusion logic as category.
 */
import Link from "next/link";
import { useMemo, useEffect } from "react";
import { useDebates } from "@/contexts/DebatesContext";
import DebateCard from "@/components/DebateCard";
import TickerSearch from "@/components/TickerSearch";
import StockMetaBar from "@/components/StockMetaBar";
import { isEligibleForHomepage } from "@/lib/homePageEligibility";
import type { Debate } from "@/lib/types";
import type { StockMetadata } from "@/lib/types";

const LIMITS = {
  mostRecent: 6,
  highConviction: 3,
  lowConviction: 3,
  mostActive: 3,
} as const;

/** Eligible homepage pool: stocks only, valid/published (see homePageEligibility). */
function useEligibleHomeDebates() {
  const { getMergedDebates } = useDebates();
  return useMemo(() => {
    const all = getMergedDebates();
    return all.filter(
      (d) => d.categoryType === "stocks" && isEligibleForHomepage(d)
    );
  }, [getMergedDebates]);
}

/** Section lists derived from the same eligible pool. Most Active = most posts (argument count). */
function useHomeSections(
  pool: Debate[],
  getMergedArguments: (debateId: string) => Array<{ side: string }>
) {
  return useMemo(() => {
    const mostRecent = [...pool]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, LIMITS.mostRecent);

    const withVotes = pool.filter((d) => (d.totalVotes ?? 0) > 0);
    const highConviction = [...withVotes]
      .sort(
        (a, b) =>
          (b.proVotes / (b.totalVotes ?? 1)) - (a.proVotes / (a.totalVotes ?? 1))
      )
      .slice(0, LIMITS.highConviction);

    const lowConviction = [...withVotes]
      .sort(
        (a, b) =>
          (b.conVotes / (b.totalVotes ?? 1)) - (a.conVotes / (a.totalVotes ?? 1))
      )
      .slice(0, LIMITS.lowConviction);

    const mostActive = [...pool]
      .map((d) => ({ debate: d, count: getMergedArguments(d.id).length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, LIMITS.mostActive)
      .map((x) => x.debate);

    return {
      mostRecent,
      highConviction,
      lowConviction,
      mostActive,
    };
  }, [pool, getMergedArguments]);
}

function StockDebateCard({
  debate,
  argumentCount,
  proCountFromArgs,
  conCountFromArgs,
}: {
  debate: Debate;
  argumentCount?: number;
  proCountFromArgs?: number;
  conCountFromArgs?: number;
}) {
  const meta =
    debate.categoryType === "stocks" && debate.metadata ? (
      <StockMetaBar meta={debate.metadata as unknown as StockMetadata} className="mb-2" />
    ) : null;
  return (
    <DebateCard
      debate={debate}
      proLabel="Bull"
      conLabel="Bear"
      entityMeta={meta}
      argumentCount={argumentCount}
      proCountFromArgs={proCountFromArgs}
      conCountFromArgs={conCountFromArgs}
    />
  );
}

function Section({
  title,
  debates,
  getMergedArguments,
  viewAllHref,
}: {
  title: string;
  debates: Debate[];
  getMergedArguments: (id: string) => Array<{ side: string }>;
  viewAllHref?: string;
}) {
  if (debates.length === 0) return null;
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0d121b] dark:text-white">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm font-bold text-[#135bec] hover:underline"
          >
            View all →
          </Link>
        )}
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {debates.map((d) => {
          const args = getMergedArguments(d.id);
          const proCountFromArgs = args.filter((a) => a.side === "PRO").length;
          const conCountFromArgs = args.filter((a) => a.side === "CON").length;
          return (
            <StockDebateCard
              key={d.id}
              debate={d}
              argumentCount={args.length}
              proCountFromArgs={proCountFromArgs}
              conCountFromArgs={conCountFromArgs}
            />
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  const pool = useEligibleHomeDebates();
  const {
    getMergedArguments,
    fetchHomeDebates,
    loadArgumentsForDebate,
    debatesLoading,
    debatesError,
  } = useDebates();
  const { mostRecent, highConviction, lowConviction, mostActive } =
    useHomeSections(pool, getMergedArguments);

  useEffect(() => {
    fetchHomeDebates(50);
  }, [fetchHomeDebates]);

  // Load arguments for all pool debates so cards show same bull/bear % as detail page
  useEffect(() => {
    pool.forEach((d) => loadArgumentsForDebate(d.id));
  }, [pool, loadArgumentsForDebate]);

  if (debatesLoading) {
    return (
      <main className="py-10">
        <div className="text-[#4c669a] dark:text-[#94a3b8] text-center">
          Loading debates…
        </div>
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
          <Link href="/" className="text-[#135bec] font-bold hover:underline">
            Retry
          </Link>
        </p>
      </main>
    );
  }

  return (
    <>
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

      <Section
        title="Most Recent"
        debates={mostRecent}
        getMergedArguments={getMergedArguments}
        viewAllHref="/category/stocks"
      />
      <Section
        title="High Conviction"
        debates={highConviction}
        getMergedArguments={getMergedArguments}
      />
      <Section
        title="Low Conviction"
        debates={lowConviction}
        getMergedArguments={getMergedArguments}
      />
      <Section
        title="Most Active"
        debates={mostActive}
        getMergedArguments={getMergedArguments}
        viewAllHref="/category/stocks"
      />
    </>
  );
}
