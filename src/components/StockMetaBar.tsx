/**
 * Stock-specific metadata bar (ticker + sector only). MVP: no price/P/E/growth (would need API).
 */
import type { StockMetadata } from "@/lib/types";

interface StockMetaBarProps {
  meta: StockMetadata;
  className?: string;
}

export default function StockMetaBar({ meta, className = "" }: StockMetaBarProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-400 ${className}`}
    >
      {meta.ticker && (
        <span className="font-mono font-bold text-[#135bec]">{meta.ticker}</span>
      )}
      {meta.sector && (
        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
          {meta.sector}
        </span>
      )}
    </div>
  );
}
