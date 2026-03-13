"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useDebates } from "@/contexts/DebatesContext";
import type { ArgumentSide } from "@/lib/types";
import type { Debate } from "@/lib/types";

export default function PostTakePage() {
  const router = useRouter();
  const params = useParams();
  const categoryType = (params?.categoryType as string) ?? "";
  const entitySlug = (params?.entitySlug as string) ?? "";
  const { getMergedDebate, addArgument } = useDebates();

  const [side, setSide] = useState<ArgumentSide | "">("");
  const [argument, setArgument] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [debate, setDebate] = useState<Debate | undefined>(undefined);

  useEffect(() => {
    const d = getMergedDebate(categoryType, entitySlug);
    setDebate(d);
  }, [categoryType, entitySlug, getMergedDebate]);

  if (!debate) {
    return (
      <div className="fixed inset-0 top-[57px] z-40 bg-[#0d121b]/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1a2133] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#0d121b] dark:text-white">
            Debate Not Found
          </h2>
          <Link href="/" className="text-[#135bec] hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const proLabel = debate.categoryType === "stocks" ? "Bull" : "Pro";
  const conLabel = debate.categoryType === "stocks" ? "Bear" : "Con";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!side || !argument.trim()) {
      alert("Please select a side and write your argument.");
      return;
    }
    if (debate.id.startsWith("user-")) {
      addArgument(debate.id, argument.trim(), side);
    } else {
      console.log("Posting take (mock debate):", {
        debateId: debate.id,
        side,
        content: argument,
        sourceUrl: sourceUrl || undefined,
      });
    }
    router.push(`/debate/${debate.categoryType}/${debate.symbolOrSlug}`);
  };

  const argumentLength = argument.length;
  const minLength = 100;

  return (
    <div className="fixed inset-0 top-[57px] z-40 bg-[#0d121b]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a2133] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-[#e7ebf3] dark:border-[#2d3748] flex justify-between items-start">
          <div className="pr-8">
            <span className="text-xs font-bold text-[#135bec] uppercase tracking-[0.2em] mb-2 block">
              Post Your Take
            </span>
            <h1 className="text-[#0d121b] dark:text-white text-2xl md:text-3xl font-black leading-tight tracking-tight">
              {debate.entityName} — {debate.debateQuestion}
            </h1>
          </div>
          <Link
            href={`/debate/${debate.categoryType}/${debate.symbolOrSlug}`}
            className="text-[#4c669a] hover:text-[#0d121b] dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold text-[#4c669a] uppercase tracking-wider">
                Which side are you on?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    className="hidden"
                    id="side-pro"
                    name="side"
                    type="radio"
                    checked={side === "PRO"}
                    onChange={() => setSide("PRO")}
                  />
                  <label
                    htmlFor="side-pro"
                    className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 cursor-pointer transition-all ${
                      side === "PRO"
                        ? "ring-4 ring-[#22c55e]/30 border-[#22c55e] bg-[#22c55e] text-white"
                        : "border-[#e7ebf3] dark:border-[#2d3748] hover:border-[#22c55e]/50"
                    }`}
                  >
                    <span className="material-symbols-outlined font-bold">trending_up</span>
                    <span className="text-lg font-black tracking-tight uppercase">
                      {proLabel}
                    </span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    className="hidden"
                    id="side-con"
                    name="side"
                    type="radio"
                    checked={side === "CON"}
                    onChange={() => setSide("CON")}
                  />
                  <label
                    htmlFor="side-con"
                    className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 cursor-pointer transition-all ${
                      side === "CON"
                        ? "ring-4 ring-[#ef4444]/30 border-[#ef4444] bg-[#ef4444] text-white"
                        : "border-[#e7ebf3] dark:border-[#2d3748] hover:border-[#ef4444]/50"
                    }`}
                  >
                    <span className="material-symbols-outlined font-bold">trending_down</span>
                    <span className="text-lg font-black tracking-tight uppercase">
                      {conLabel}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <label
                  className="text-sm font-bold text-[#4c669a] uppercase tracking-wider"
                  htmlFor="argument"
                >
                  Your Argument
                </label>
                <span className="text-xs text-[#4c669a]">
                  {argumentLength >= minLength
                    ? "✓ High-quality"
                    : `Minimum ${minLength} characters for high-quality badge`}
                </span>
              </div>
              <textarea
                className="w-full bg-[#f6f6f8] dark:bg-[#101622] border-none rounded-xl p-5 text-base focus:ring-2 focus:ring-[#135bec]/20 placeholder:text-[#4c669a]/50 resize-none transition-all text-[#0d121b] dark:text-white"
                id="argument"
                placeholder="Build your case. Mention key points, evidence, or reasoning to persuade others..."
                rows={6}
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold text-[#4c669a] uppercase tracking-wider">
                Add Sources (Optional)
              </label>
              <div className="flex items-stretch gap-2">
                <div className="flex-1 flex items-center bg-[#f6f6f8] dark:bg-[#101622] rounded-xl px-4 h-12">
                  <span className="material-symbols-outlined text-[#4c669a] mr-2">link</span>
                  <input
                    className="bg-transparent border-none w-full p-0 text-sm focus:ring-0 placeholder:text-[#4c669a]/50 text-[#0d121b] dark:text-white"
                    placeholder="Paste URL to news article, tweet, or data sheet"
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="bg-[#e7ebf3] dark:bg-[#2d3748] text-[#0d121b] dark:text-white px-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => sourceUrl.trim() && (console.log("Adding source:", sourceUrl), setSourceUrl(""))}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#e7ebf3] dark:border-[#2d3748] flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-sm text-[#4c669a]">
                Posting as <span className="font-bold text-[#0d121b] dark:text-white">Guest</span>
              </p>
              <button
                className={`w-full md:w-auto min-w-[240px] h-14 text-white rounded-full text-lg font-black tracking-tight shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${
                  side === "PRO"
                    ? "bg-[#22c55e] hover:bg-[#22c55e]/90 shadow-[#22c55e]/20"
                    : side === "CON"
                      ? "bg-[#ef4444] hover:bg-[#ef4444]/90 shadow-[#ef4444]/20"
                      : "bg-[#135bec] hover:bg-[#135bec]/90 shadow-[#135bec]/20"
                }`}
                type="submit"
                disabled={!side || !argument.trim()}
              >
                Post My Take
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
