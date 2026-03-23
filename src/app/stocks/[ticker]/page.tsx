import type { Metadata } from "next";
import Link from "next/link";
import DebateCard from "@/components/DebateCard";
import StockMetaBar from "@/components/StockMetaBar";
import { fetchDebatesForCategory } from "@/lib/debatesDataLayer";
import { createClient } from "@/lib/supabaseServer";
import type { Debate, StockMetadata } from "@/lib/types";

function normalizeTicker(input: string): string {
  return (input ?? "").trim().toUpperCase();
}

function isDebateForTicker(debate: Debate, ticker: string): boolean {
  const meta = debate.metadata as StockMetadata | undefined;
  const metaTicker = normalizeTicker(meta?.ticker ?? "");
  const slugTicker = normalizeTicker(debate.symbolOrSlug ?? "");
  return metaTicker === ticker || slugTicker === ticker;
}

async function getStockDebates(tickerParam: string) {
  const normalizedTicker = normalizeTicker(tickerParam);
  const supabase = await createClient();
  const { data } = await fetchDebatesForCategory(supabase, "stocks");
  const debates = data.filter((d) => isDebateForTicker(d, normalizedTicker));
  const stockName = debates[0]?.entityName ?? normalizedTicker;
  return { normalizedTicker, stockName, debates };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const { normalizedTicker, stockName, debates } = await getStockDebates(ticker);
  const debateCount = debates.length;
  const title =
    debateCount > 0
      ? `${stockName} (${normalizedTicker}) Stock Debates`
      : `${normalizedTicker} Stock Debates`;
  const description =
    debateCount > 0
      ? `Read ${debateCount} debate${debateCount === 1 ? "" : "s"} on ${stockName} (${normalizedTicker}) and compare bull vs bear vote conviction.`
      : `No debates yet for ${normalizedTicker}. Visit this stock page for new bull vs bear discussions.`;

  return {
    title,
    description,
  };
}

export default async function StockTickerPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const { normalizedTicker, stockName, debates } = await getStockDebates(ticker);

  return (
    <main className="pt-2 pb-6 md:py-6 min-w-0 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {stockName} ({normalizedTicker})
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
            {debates.length} debate{debates.length !== 1 ? "s" : ""} for this stock
          </p>
        </div>
        <Link
          href="/category/stocks"
          className="text-xs md:text-sm font-medium text-[#135bec] hover:underline shrink-0 self-start sm:self-auto"
        >
          ← Stocks
        </Link>
      </div>

      {debates.length === 0 ? (
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 md:p-8 text-center">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
            No debates yet for {normalizedTicker}
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-5">
            Be the first to start a bull vs bear discussion for this stock.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center bg-[#135bec] hover:bg-[#135bec]/90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Create a Debate
          </Link>
        </section>
      ) : (
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-stretch min-w-0">
          {debates.map((debate) => {
            const meta = debate.metadata as StockMetadata | undefined;
            return (
              <DebateCard
                key={debate.id}
                debate={debate}
                proLabel="Bull"
                conLabel="Bear"
                entityMeta={
                  meta ? <StockMetaBar meta={meta} className="mb-2" /> : undefined
                }
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
