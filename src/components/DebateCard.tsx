/**
 * Generic debate card. Links to /debate/[categoryType]/[entitySlug].
 * Pass optional children (e.g. StockMetaBar) for category-specific metadata.
 */
import Link from "next/link";
import type { Debate } from "@/lib/types";
import { getCategoryByType } from "@/lib/categories";

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
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all flex flex-col group cursor-pointer h-full w-full">
        <div className="flex items-start justify-between mb-4 gap-2">
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded">
            {categoryLabel}
          </span>
          {debate.symbolOrSlug && (
            <span className="text-xs font-mono font-bold text-[#135bec]">
              {debate.symbolOrSlug.toUpperCase()}
            </span>
          )}
        </div>

        {entityMeta && <div className="mb-3">{entityMeta}</div>}

        {/* Visual header: image if present, otherwise a consistent ticker block */}
        {debate.image ? (
          <div
            className="w-full aspect-video rounded-lg mb-4 bg-cover bg-center shrink-0"
            style={{ backgroundImage: `url(${debate.image})` }}
          />
        ) : (
          <div className="w-full aspect-video rounded-lg mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shrink-0">
            <span className="font-mono font-black text-3xl md:text-4xl tracking-widest text-[#135bec]">
              {debate.symbolOrSlug.toUpperCase()}
            </span>
          </div>
        )}

        <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-[#135bec] transition-colors line-clamp-2">
          {debate.debateQuestion}
        </h3>
        {debate.entityName && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {debate.entityName}
          </p>
        )}

        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-green-600">
                {bullPercent}% {proLabel}
              </span>
              <span className="text-red-600">
                {bearPercent}% {conLabel}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex">
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${bullPercent}%` }}
              />
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${bearPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              {argumentCount !== undefined && (
                <span>{argumentCount} take{argumentCount !== 1 ? "s" : ""}</span>
              )}
              <span>{totalVotes.toLocaleString()} votes</span>
            </div>
            <span className="bg-[#135bec] hover:bg-[#135bec]/90 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
              View Debate
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
