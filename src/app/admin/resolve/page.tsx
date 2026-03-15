"use client";

import { useState } from "react";
import { mockDebates } from "@/lib/mock";
import type { ArgumentSide } from "@/lib/types";
import Tag from "@/components/Tag";
import SentimentBar from "@/components/SentimentBar";
import Link from "next/link";
import { getCategoryByType } from "@/lib/categories";

export default function AdminResolvePage() {
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const unresolved = mockDebates.filter(
    (d) => !d.resolved && !resolvedIds.has(d.id)
  );

  const handleResolve = (debateId: string, side: ArgumentSide) => {
    setResolvedIds((prev) => new Set(prev).add(debateId));
    alert(`Debate resolved as ${side}! (Mock - no backend yet)`);
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Resolve Debates
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Admin panel to mark debates as resolved with outcomes.
        </p>
      </div>

      {unresolved.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">All debates have been resolved.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {unresolved.map((debate) => {
            const config = getCategoryByType(debate.categoryType);
            const categoryLabel = config?.label ?? debate.categoryType;
            return (
              <div
                key={debate.id}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2133] p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Tag label={categoryLabel} />
                      {debate.symbolOrSlug && (
                        <span className="font-mono text-sm font-bold text-[#135bec]">
                          {debate.symbolOrSlug.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/debate/${debate.categoryType}/${debate.symbolOrSlug}`}
                      className="text-xl font-semibold text-gray-900 dark:text-white hover:text-[#135bec] transition-colors"
                    >
                      {debate.entityName} — {debate.debateQuestion}
                    </Link>
                    {debate.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                        {debate.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <SentimentBar
                    proVotes={debate.proVotes}
                    conVotes={debate.conVotes}
                    totalVotes={debate.totalVotes}
                    proLabel={debate.categoryType === "stocks" ? "Bull" : "Pro"}
                    conLabel={debate.categoryType === "stocks" ? "Bear" : "Con"}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleResolve(debate.id, "PRO")}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    Resolve as {debate.categoryType === "stocks" ? "Bull" : "Pro"}
                  </button>
                  <button
                    onClick={() => handleResolve(debate.id, "CON")}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    Resolve as {debate.categoryType === "stocks" ? "Bear" : "Con"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
