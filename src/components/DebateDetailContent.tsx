"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { useDebates } from "@/contexts/DebatesContext";
import { getCategoryByType } from "@/lib/categories";
import EntityHeader from "@/components/EntityHeader";
import SentimentBar from "@/components/SentimentBar";
import ArgumentList from "@/components/ArgumentList";
import StockMetaBar from "@/components/StockMetaBar";
import Tag from "@/components/Tag";
import MobileArgumentSideToggle from "@/components/MobileArgumentSideToggle";
import type { ArgumentSide, StockMetadata } from "@/lib/types";

export default function DebateDetailContent() {
  const params = useParams();
  const categoryType = (params?.categoryType as string) ?? "";
  const entitySlug = (params?.entitySlug as string) ?? "";

  const {
    getMergedDebate,
    getMergedDebates,
    getMergedArguments,
    getVotedArgumentIds,
    fetchHomeDebates,
    fetchDebate,
    loadArgumentsForDebate,
    addArgument,
    updateArgument,
    deleteArgument,
    voteArgument,
    unvoteArgument,
    debateLoading,
    debateError,
    homeLoading,
    argumentsLoading,
    argumentsError,
  } = useDebates();

  // Resolve debate: cache first, then home list (handles single-fetch missing or slow)
  const debate =
    getMergedDebate(categoryType, entitySlug) ??
    getMergedDebates().find(
      (d) =>
        d.categoryType.toLowerCase() === (categoryType || "").toLowerCase() &&
        d.symbolOrSlug.toLowerCase() === (entitySlug || "").toLowerCase()
    );

  useEffect(() => {
    if (!categoryType || !entitySlug) return;
    fetchHomeDebates(50).then(() => fetchDebate(categoryType, entitySlug));
  }, [categoryType, entitySlug, fetchHomeDebates, fetchDebate]);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [mobileFocusedSide, setMobileFocusedSide] = useState<ArgumentSide>("PRO");
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled) setCurrentUserId(user?.id ?? null);
    });
    return () => { cancelled = true; };
  }, []);

  const isAuthor =
    !!debate &&
    !!currentUserId &&
    debate.authorId != null &&
    debate.authorId === currentUserId;

  useEffect(() => {
    if (debate?.id) loadArgumentsForDebate(debate.id);
  }, [debate?.id, loadArgumentsForDebate]);

  if ((debateLoading || homeLoading) && !debate) {
    return (
      <main className="py-6">
        <div className="text-[#4c669a] dark:text-[#94a3b8]">Loading debate…</div>
      </main>
    );
  }
  if (debateError) {
    return (
      <main className="py-6">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 mb-4">
          {debateError}
        </div>
      </main>
    );
  }
  if (!debate) notFound();

  const arguments_ = getMergedArguments(debate.id);
  const categoryLabel = getCategoryByType(debate.categoryType)?.label ?? debate.categoryType;

  // Sentiment bar reflects argument counts (pro vs con takes), so it updates as people post
  const proCount = arguments_.filter((a) => a.side === "PRO").length;
  const conCount = arguments_.filter((a) => a.side === "CON").length;
  const totalFromArguments = proCount + conCount;

  const { topProCount, topConCount } = useMemo(() => {
    const top = arguments_.filter((a) => !a.parentId);
    return {
      topProCount: top.filter((a) => a.side === "PRO").length,
      topConCount: top.filter((a) => a.side === "CON").length,
    };
  }, [arguments_]);

  useEffect(() => {
    setMobileFocusedSide("PRO");
  }, [debate?.id]);

  const proLabel = debate.categoryType === "stocks" ? "Bull" : "Pro";
  const conLabel = debate.categoryType === "stocks" ? "Bear" : "Con";
  const sideLabels =
    debate.categoryType === "stocks"
      ? { PRO: "Bull", CON: "Bear" }
      : { PRO: "Pro", CON: "Con" };
  const emptyMessage =
    debate.categoryType === "stocks"
      ? {
          PRO: "No arguments yet. Be the first to make the bull case!",
          CON: "No arguments yet. Be the first to make the bear case!",
        }
      : undefined;

  return (
    <main className="py-6">
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/"
          className="text-[#4c669a] dark:text-[#94a3b8] text-sm font-medium hover:underline"
        >
          Home
        </Link>
        <span className="text-[#4c669a] text-sm">/</span>
        <Link
          href={`/category/${debate.categoryType}`}
          className="text-[#4c669a] dark:text-[#94a3b8] text-sm font-medium hover:underline"
        >
          {categoryLabel}
        </Link>
        <span className="text-[#4c669a] text-sm">/</span>
        <span className="text-[#0d121b] dark:text-white text-sm font-medium">
          {debate.symbolOrSlug.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
        <div className="max-w-3xl">
          <EntityHeader debate={debate}>
            {debate.categoryType === "stocks" && debate.metadata && (
              <div className="mt-2">
                <StockMetaBar meta={debate.metadata as unknown as StockMetadata} />
              </div>
            )}
          </EntityHeader>
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <p className="text-[#4c669a] dark:text-[#94a3b8] text-sm font-medium">
              Volume: {totalFromArguments.toLocaleString()} votes
            </p>
            {debate.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {debate.tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {isAuthor && (
            <Link
              href={`/debate/${debate.categoryType}/${debate.symbolOrSlug}/edit`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#cfd7e7] dark:border-slate-600 text-[#0d121b] dark:text-white text-sm font-bold hover:bg-[#f8f9fc] dark:hover:bg-slate-800 transition-colors"
            >
              Edit Debate
            </Link>
          )}
          <Link
            href={`/debate/${debate.categoryType}/${debate.symbolOrSlug}/post`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#135bec] text-white text-sm font-bold hover:bg-[#135bec]/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>
            Post Your Take
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <SentimentBar
          proVotes={proCount}
          conVotes={conCount}
          totalVotes={totalFromArguments}
          proLabel={proLabel}
          conLabel={conLabel}
        />
      </div>

      {/* Mobile: Bull/Bear (or Pro/Con) segmented control; desktop: DEBATE tab */}
      <div className="md:hidden sticky top-14 z-30 -mx-1 px-1 pt-1 pb-4 mb-2 bg-[#f6f6f8]/92 dark:bg-[#101622]/92 backdrop-blur-md supports-[backdrop-filter]:bg-[#f6f6f8]/80 dark:supports-[backdrop-filter]:bg-[#101622]/85">
        <MobileArgumentSideToggle
          proLabel={proLabel}
          conLabel={conLabel}
          proCount={topProCount}
          conCount={topConCount}
          value={mobileFocusedSide}
          onChange={setMobileFocusedSide}
        />
      </div>

      <div className="hidden md:flex border-b border-[#cfd7e7] dark:border-[#2d3748] gap-8 mb-6">
        <span className="flex flex-col items-center justify-center border-b-[3px] border-[#135bec] text-[#135bec] pb-[13px] pt-2">
          <p className="text-sm font-bold tracking-wide">DEBATE</p>
        </span>
      </div>

      {argumentsError && (
        <p className="py-4 text-red-600 dark:text-red-400 text-sm">{argumentsError}</p>
      )}
      {argumentsLoading ? (
        <p className="text-[#4c669a] dark:text-[#94a3b8] py-4">Loading arguments…</p>
      ) : (
        <ArgumentList
          arguments_={arguments_}
          sideLabels={sideLabels}
          emptyMessage={emptyMessage}
          currentUserId={currentUserId}
          debateId={debate.id}
          votedArgumentIds={getVotedArgumentIds(debate.id)}
          mobileFocusedSide={mobileFocusedSide}
          onEditArgument={(argumentId, newContent) =>
            updateArgument(debate.id, argumentId, newContent)
          }
          onDeleteArgument={(argumentId) => deleteArgument(debate.id, argumentId)}
          onToggleVote={(argumentId) => {
            const voted = getVotedArgumentIds(debate.id).includes(argumentId);
            return voted ? unvoteArgument(debate.id, argumentId) : voteArgument(debate.id, argumentId);
          }}
          onReply={(parent, content) =>
            addArgument(debate.id, content, parent.side, { parentId: parent.id })
          }
        />
      )}

      <footer className="mt-20 py-10 border-t border-[#e7ebf3] dark:border-[#2d3748] text-center">
        <p className="text-[#4c669a] dark:text-[#94a3b8] text-sm">
          The best place to test conviction on market ideas. Starting with stocks.
        </p>
      </footer>
    </main>
  );
}
