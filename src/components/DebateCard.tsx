/**
 * Generic debate card. Links to /debate/[categoryType]/[entitySlug].
 * Pass optional children (e.g. StockMetaBar) for category-specific metadata.
 */
import Link from "next/link";
import type { Debate } from "@/lib/types";
import { getCategoryByType } from "@/lib/categories";
import RelativeTime from "@/components/RelativeTime";

interface DebateCardProps {
  debate: Debate;
  /** Optional: pro/con label override (e.g. "Bull"/"Bear" for stocks). */
  proLabel?: string;
  conLabel?: string;
  /** Optional: slot for category-specific meta (e.g. StockMetaBar). */
  entityMeta?: React.ReactNode;
  /** Optional: number of arguments/takes (e.g. for Most Active). */
  argumentCount?: number;
  /** Optional: use these for bull/bear % so cards match detail page (argument-based). */
  proCountFromArgs?: number;
  conCountFromArgs?: number;
}

export default function DebateCard({
  debate,
  proLabel = "Pro",
  conLabel = "Con",
  entityMeta,
  argumentCount,
  proCountFromArgs,
  conCountFromArgs,
}: DebateCardProps) {
  const fromArgs =
    proCountFromArgs !== undefined && conCountFromArgs !== undefined;
  const totalFromArgs = fromArgs ? proCountFromArgs + conCountFromArgs : 0;
  const totalVotes = fromArgs && totalFromArgs > 0
    ? totalFromArgs
    : (debate.totalVotes ?? 0);
  const proVotes = fromArgs && totalFromArgs > 0
    ? proCountFromArgs
    : (debate.proVotes ?? 0);
  const conVotes = fromArgs && totalFromArgs > 0
    ? conCountFromArgs
    : (debate.conVotes ?? 0);
  const bullPercent =
    totalVotes > 0 ? Math.round((proVotes / totalVotes) * 100) : 0;
  const bearPercent =
    totalVotes > 0 ? Math.round((conVotes / totalVotes) * 100) : 0;
  const categoryConfig = getCategoryByType(debate.categoryType);
  const categoryLabel = categoryConfig?.label ?? debate.categoryType;

  return (
    <Link
      href={`/debate/${debate.categoryType}/${debate.symbolOrSlug}`}
      className="h-full flex flex-col"
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5 hover:shadow-lg transition-all flex flex-col group cursor-pointer h-full w-full min-w-0 max-w-full">
        <div className="flex items-start justify-between gap-2 min-w-0 mb-2 md:mb-3">
          <span className="px-2 py-0.5 md:px-2.5 md:py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded shrink-0">
            {categoryLabel}
          </span>
          <RelativeTime
            date={debate.createdAt}
            className="text-[10px] md:text-[11px] text-gray-400 dark:text-gray-500 font-medium text-right min-w-[3rem]"
          />
        </div>

        {entityMeta ? (
          <div className="mb-2 md:mb-3 min-w-0">{entityMeta}</div>
        ) : (
          debate.symbolOrSlug && (
            <div className="mb-2 md:mb-3 min-w-0">
              <span className="text-[11px] md:text-xs font-mono font-bold text-[#135bec]">
                {debate.symbolOrSlug.toUpperCase()}
              </span>
            </div>
          )
        )}

        {/* Visual header: image if present; otherwise neutral placeholder (ticker lives in meta row above) */}
        {debate.image ? (
          <div
            className="w-full h-32 sm:h-36 md:h-auto md:aspect-video rounded-lg mb-3 md:mb-4 bg-cover bg-center shrink-0"
            style={{ backgroundImage: `url(${debate.image})` }}
          />
        ) : (
          <div className="w-full h-32 sm:h-36 md:h-auto md:aspect-video rounded-lg mb-3 md:mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shrink-0 shadow-inner">
            <span
              className="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-[#135bec]/30 dark:text-[#135bec]/40 select-none"
              aria-hidden
            >
              show_chart
            </span>
          </div>
        )}

        <h3 className="text-base md:text-lg font-bold leading-snug md:leading-tight mb-1.5 md:mb-2 group-hover:text-[#135bec] transition-colors line-clamp-2">
          {debate.debateQuestion}
        </h3>
        {debate.entityName && (
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-3 line-clamp-2">
            {debate.entityName}
          </p>
        )}

        <div className="mt-auto space-y-3 md:space-y-4">
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex justify-between gap-2 text-[11px] md:text-xs font-bold tabular-nums">
              <span className="text-green-600 truncate">
                {bullPercent}% {proLabel}
              </span>
              <span className="text-red-600 truncate text-right">
                {bearPercent}% {conLabel}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex min-w-0">
              <div
                className="bg-green-500 transition-all min-w-0"
                style={{ width: `${bullPercent}%` }}
              />
              <div
                className="bg-red-500 transition-all min-w-0"
                style={{ width: `${bearPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 md:pt-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] md:text-xs text-gray-500 dark:text-gray-400 min-w-0">
              {argumentCount !== undefined && (
                <span>{argumentCount} take{argumentCount !== 1 ? "s" : ""}</span>
              )}
              <span>{totalVotes.toLocaleString()} votes</span>
            </div>
            <span className="inline-flex self-start md:self-auto bg-[#135bec] hover:bg-[#135bec]/90 text-white text-xs md:text-sm font-semibold md:font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors shrink-0">
              View Debate
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
