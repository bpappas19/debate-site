"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useDebates } from "@/contexts/DebatesContext";
import { getCategoryByType } from "@/lib/categories";
import EntityHeader from "@/components/EntityHeader";
import SentimentBar from "@/components/SentimentBar";
import ArgumentList from "@/components/ArgumentList";
import StockMetaBar from "@/components/StockMetaBar";
import Tag from "@/components/Tag";
import FollowDebateButton from "@/components/FollowDebateButton";
import type { StockMetadata } from "@/lib/types";

export default function DebateDetailContent() {
  const params = useParams();
  const categoryType = (params?.categoryType as string) ?? "";
  const entitySlug = (params?.entitySlug as string) ?? "";

  const { getMergedDebate, getMergedArguments } = useDebates();
  const debate = getMergedDebate(categoryType, entitySlug);

  if (!debate) notFound();

  const arguments_ = getMergedArguments(debate.id);
  const categoryLabel = getCategoryByType(debate.categoryType)?.label ?? debate.categoryType;

  const proLabel = debate.categoryType === "stocks" ? "Bull" : "Pro";
  const conLabel = debate.categoryType === "stocks" ? "Bear" : "Con";
  const sideLabels =
    debate.categoryType === "stocks"
      ? { PRO: "Bull", CON: "Bear", HOLD: "Hold" }
      : { PRO: "Pro", CON: "Con", HOLD: "Hold" };
  const emptyMessage =
    debate.categoryType === "stocks"
      ? {
          PRO: "No arguments yet. Be the first to make the bull case!",
          CON: "No arguments yet. Be the first to make the bear case!",
          HOLD: "No arguments yet. Be the first to argue Hold!",
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
              Volume: {debate.totalVotes.toLocaleString()} votes
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
          <FollowDebateButton />
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
          proVotes={debate.proVotes}
          conVotes={debate.conVotes}
          totalVotes={debate.totalVotes}
          proLabel={proLabel}
          conLabel={conLabel}
        />
      </div>

      <div className="flex border-b border-[#cfd7e7] dark:border-[#2d3748] gap-8 mb-6">
        <span className="flex flex-col items-center justify-center border-b-[3px] border-[#135bec] text-[#135bec] pb-[13px] pt-2">
          <p className="text-sm font-bold tracking-wide">DEBATE</p>
        </span>
      </div>

      <ArgumentList
        arguments_={arguments_}
        sideLabels={sideLabels}
        emptyMessage={emptyMessage}
      />

      <footer className="mt-20 py-10 border-t border-[#e7ebf3] dark:border-[#2d3748] text-center">
        <p className="text-[#4c669a] dark:text-[#94a3b8] text-sm">
          The best place to test conviction on market ideas. Starting with stocks.
        </p>
      </footer>
    </main>
  );
}
