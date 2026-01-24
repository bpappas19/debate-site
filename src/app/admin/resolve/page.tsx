"use client";

import { useState } from "react";
import { mockQuestions } from "@/lib/mock";
import { Side } from "@/lib/types";
import Tag from "@/components/Tag";
import SentimentBar from "@/components/SentimentBar";
import Link from "next/link";

export default function AdminResolvePage() {
  const [resolvedQuestions, setResolvedQuestions] = useState<Set<string>>(
    new Set()
  );

  const unresolvedQuestions = mockQuestions.filter(
    (q) => !q.resolved && !resolvedQuestions.has(q.id)
  );

  const handleResolve = (questionId: string, side: Side) => {
    setResolvedQuestions((prev) => new Set(prev).add(questionId));
    // TODO: Implement actual resolution logic
    console.log(`Resolved question ${questionId} as ${side}`);
    alert(`Question resolved as ${side}! (Mock - no backend yet)`);
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resolve Debates
        </h1>
        <p className="text-gray-600">
          Admin panel to mark debates as resolved with outcomes
        </p>
      </div>

      {unresolvedQuestions.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">All debates have been resolved.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {unresolvedQuestions.map((question) => (
            <div
              key={question.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag category={question.category} />
                  </div>
                  <Link
                    href={`/q/${question.slug}`}
                    className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    {question.title}
                  </Link>
                  {question.description && (
                    <p className="text-gray-600 text-sm mt-2">
                      {question.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <SentimentBar
                  yesVotes={question.yesVotes}
                  noVotes={question.noVotes}
                  totalVotes={question.totalVotes}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleResolve(question.id, "YES")}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  Resolve as YES
                </button>
                <button
                  onClick={() => handleResolve(question.id, "NO")}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Resolve as NO
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
