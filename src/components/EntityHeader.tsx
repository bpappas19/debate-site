/**
 * Generic entity header for a debate (entity name, symbol/slug, category).
 * Use children for category-specific metadata (e.g. StockMetaBar).
 */
import type { Debate } from "@/lib/types";
import { getCategoryByType } from "@/lib/categories";

interface EntityHeaderProps {
  debate: Debate;
  children?: React.ReactNode;
}

export default function EntityHeader({ debate, children }: EntityHeaderProps) {
  const categoryConfig = getCategoryByType(debate.categoryType);
  const categoryLabel = categoryConfig?.label ?? debate.categoryType;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[#4c669a] dark:text-[#94a3b8] text-sm font-medium">
          {categoryLabel}
        </span>
        {debate.symbolOrSlug && (
          <>
            <span className="text-[#4c669a] text-sm">/</span>
            <span className="font-mono font-bold text-[#135bec] text-sm">
              {debate.symbolOrSlug.toUpperCase()}
            </span>
          </>
        )}
      </div>
      <h1 className="text-[#0d121b] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
        {debate.entityName}
      </h1>
      <p className="text-lg text-[#4c669a] dark:text-[#94a3b8]">
        {debate.debateQuestion}
      </p>
      {children}
    </div>
  );
}
