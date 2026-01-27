import { notFound } from "next/navigation";
import Link from "next/link";
import { mockQuestions, mockArgumentsBySlug } from "@/lib/mock";
import ArgumentCard from "@/components/ArgumentCard";
import SentimentBar from "@/components/SentimentBar";
import Tag from "@/components/Tag";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  // In Next.js 16, params can be a Promise - handle both cases
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams.slug;

  const q = mockQuestions.find((x) => x.slug === slug);

  if (!q) {
    notFound();
  }

  const arguments_ = mockArgumentsBySlug[slug] || [];
  const yesArguments = arguments_.filter((arg) => arg.side === "YES");
  const noArguments = arguments_.filter((arg) => arg.side === "NO");

  return (
    <main className="py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/"
          className="text-[#4c669a] dark:text-[#94a3b8] text-sm font-medium hover:underline"
        >
          {q.category}
        </Link>
        <span className="text-[#4c669a] text-sm">/</span>
        <span className="text-[#0d121b] dark:text-white text-sm font-medium">
          Debate
        </span>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-[#0d121b] dark:text-white text-4xl font-black leading-tight tracking-tight mb-2">
            {q.title}
          </h1>
          <div className="flex items-center gap-4">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                q.resolved
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  : "bg-[#22c55e]/10 text-[#22c55e]"
              }`}
            >
              {q.resolved ? "Resolved" : "Open"}
            </span>
            <p className="text-[#4c669a] dark:text-[#94a3b8] text-sm font-medium">
              Volume: {q.totalVotes.toLocaleString()} votes
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#1a2133] border border-[#e7ebf3] dark:border-[#2d3748] text-[#0d121b] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">bookmark</span>
            Follow Debate
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#1a2133] border border-[#e7ebf3] dark:border-[#2d3748] text-[#0d121b] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>

      {/* Sentiment Bar Section */}
      <div className="mb-8">
        <SentimentBar
          yesVotes={q.yesVotes}
          noVotes={q.noVotes}
          totalVotes={q.totalVotes}
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#cfd7e7] dark:border-[#2d3748] gap-8 mb-6">
        <a
          className="flex flex-col items-center justify-center border-b-[3px] border-[#135bec] text-[#135bec] pb-[13px] pt-2"
          href="#"
        >
          <p className="text-sm font-bold tracking-wide">DEBATE</p>
        </a>
        <a
          className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-[#4c669a] dark:text-[#94a3b8] hover:text-[#0d121b] dark:hover:text-white pb-[13px] pt-2 transition-colors"
          href="#"
        >
          <p className="text-sm font-bold tracking-wide">MARKET STATS</p>
        </a>
        <a
          className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-[#4c669a] dark:text-[#94a3b8] hover:text-[#0d121b] dark:hover:text-white pb-[13px] pt-2 transition-colors"
          href="#"
        >
          <p className="text-sm font-bold tracking-wide">TRADES</p>
        </a>
      </div>

      {/* Two Column Debate Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* YES Column */}
        <div className="flex flex-col gap-6">
          <div className="lg:sticky lg:top-[80px] z-10 py-3 bg-[#f6f6f8] dark:bg-[#101622] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-3 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <h3 className="text-[#22c55e] text-xl font-black uppercase tracking-tighter">
                Arguments for YES
              </h3>
            </div>
            <span className="text-[#4c669a] dark:text-[#94a3b8] text-sm font-bold">
              {yesArguments.length} Argument{yesArguments.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-6">
            {yesArguments.length > 0 ? (
              yesArguments.map((argument) => (
                <ArgumentCard key={argument.id} argument={argument} />
              ))
            ) : (
              <div className="bg-white dark:bg-[#1a2133] rounded-xl p-8 text-center text-[#4c669a] dark:text-[#94a3b8] border border-[#e7ebf3] dark:border-[#2d3748]">
                No arguments yet. Be the first to argue YES!
              </div>
            )}
          </div>
        </div>

        {/* NO Column */}
        <div className="flex flex-col gap-6">
          <div className="lg:sticky lg:top-[80px] z-10 py-3 bg-[#f6f6f8] dark:bg-[#101622] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-3 rounded-full bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
              <h3 className="text-[#ef4444] text-xl font-black uppercase tracking-tighter">
                Arguments for NO
              </h3>
            </div>
            <span className="text-[#4c669a] dark:text-[#94a3b8] text-sm font-bold">
              {noArguments.length} Argument{noArguments.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-6">
            {noArguments.length > 0 ? (
              noArguments.map((argument) => (
                <ArgumentCard key={argument.id} argument={argument} />
              ))
            ) : (
              <div className="bg-white dark:bg-[#1a2133] rounded-xl p-8 text-center text-[#4c669a] dark:text-[#94a3b8] border border-[#e7ebf3] dark:border-[#2d3748]">
                No arguments yet. Be the first to argue NO!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Floating CTA */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Link
          href={`/q/${slug}/post`}
          className="flex items-center gap-3 bg-[#135bec] text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform active:scale-95 group"
        >
          <span className="material-symbols-outlined bg-white/20 p-1 rounded-full text-white">
            add
          </span>
          <span className="text-lg">Post Your Take</span>
        </Link>
      </div>

      {/* Footer Space */}
      <footer className="mt-20 py-10 border-t border-[#e7ebf3] dark:border-[#2d3748] text-center">
        <p className="text-[#4c669a] dark:text-[#94a3b8] text-sm">
          © 2024 Debate Platform. Engage thoughtfully.
        </p>
      </footer>
    </main>
  );
}
