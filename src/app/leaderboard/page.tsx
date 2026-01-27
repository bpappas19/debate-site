"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockLeaderboardUsers, LeaderboardUser } from "@/lib/mock";
import { mockQuestions } from "@/lib/mock";
import { Category } from "@/lib/types";
import { FEATURES } from "@/lib/features";

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<"7days" | "30days" | "alltime">("30days");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");

  // Get upvotes based on time filter
  const getUpvotes = (user: LeaderboardUser) => {
    switch (timeFilter) {
      case "7days":
        return user.upvotes7d;
      case "30days":
        return user.upvotes30d;
      case "alltime":
        return user.upvotesAllTime;
    }
  };

  // Sort and filter leaderboard data
  const leaderboardData = useMemo(() => {
    let data = [...mockLeaderboardUsers].sort((a, b) => getUpvotes(b) - getUpvotes(a));
    
    // Filter by category if needed (optional - can be based on top take category)
    if (selectedCategory !== "all") {
      // For now, just return all data since we don't have category on users
      // In a real app, you'd filter by the category of their top take or most active category
    }
    
    return data;
  }, [timeFilter, selectedCategory]);

  // Top 3 for podium
  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);

  // Get top takes (most upvoted arguments)
  const topTakes = useMemo(() => {
    const allTakes: Array<{
      snippet: string;
      side: "YES" | "NO";
      slug: string;
      upvotes: number;
      questionTitle: string;
    }> = [];

    mockLeaderboardUsers.forEach((user) => {
      if (user.topTakeSnippet && user.topTakeSlug && user.topTakeUpvotes) {
        const question = mockQuestions.find((q) => q.slug === user.topTakeSlug);
        if (question) {
          allTakes.push({
            snippet: user.topTakeSnippet,
            side: user.topTakeSide || "YES",
            slug: user.topTakeSlug,
            upvotes: user.topTakeUpvotes,
            questionTitle: question.title,
          });
        }
      }
    });

    return allTakes.sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);
  }, []);

  const formatUpvotes = (upvotes: number) => {
    if (upvotes >= 1000) {
      return `${(upvotes / 1000).toFixed(1)}k`;
    }
    return upvotes.toLocaleString();
  };

  if (!FEATURES.leaderboard) {
    return (
      <main className="py-16 flex flex-col items-center justify-center text-center px-4">
        <div className="relative max-w-xl w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#135bec] via-[#6366f1] to-[#22c55e] opacity-40 blur-3xl rounded-[32px]" />
          <div className="relative bg-white/90 dark:bg-[#020617]/90 border border-slate-200/80 dark:border-slate-800/80 rounded-[28px] px-8 py-10 shadow-2xl backdrop-blur">
            <div className="inline-flex items-center justify-center rounded-2xl bg-[#135bec]/10 text-[#135bec] mb-4 px-3 py-1 text-xs font-bold tracking-wide uppercase">
              <span className="material-symbols-outlined text-base mr-1">emoji_events</span>
              Coming Soon
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#020617] dark:text-white mb-3 tracking-tight">
              Global Debater Leaderboard
            </h1>
            <p className="text-sm md:text-base text-[#4c669a] dark:text-[#94a3b8] max-w-md mx-auto mb-6">
              {/* Hidden for MVP — enable by flipping feature flag */}
            We&apos;re polishing the ranking system that highlights the sharpest minds in the community.
              Track streaks, upvotes, and impact across every debate.
            </p>
            <div className="flex items-center justify-center gap-3 mb-8 text-xs text-[#4c669a] dark:text-slate-400">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined !text-base text-amber-400">workspace_premium</span>
                <span>Seasonal rankings</span>
              </div>
              <span className="text-slate-400">•</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined !text-base text-emerald-400">bolt</span>
                <span>Skill-based tiers</span>
              </div>
              <span className="text-slate-400">•</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined !text-base text-sky-400">insights</span>
                <span>Deep stats</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#135bec] text-white text-sm font-bold shadow-lg shadow-[#135bec]/30 hover:bg-[#135bec]/90 transition-colors"
              >
                Back to Active Debates
                <span className="material-symbols-outlined text-base ml-1">trending_flat</span>
              </Link>
              <div className="text-[11px] text-[#4c669a] dark:text-[#94a3b8]">
                Watch this space — leaderboard launches after MVP.
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-10">
      {/* Page Heading */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-[#0d121b] dark:text-white">
          Debater Leaderboard
        </h1>
        <p className="text-[#4c669a] dark:text-[#94a3b8] text-lg max-w-2xl mx-auto">
          Top debaters by community votes.
        </p>
      </div>

      {/* Podium Section */}
      <div className="flex justify-center items-end gap-6 mb-16 px-4 flex-wrap">
        {/* Rank 2 */}
        {topThree[1] && (
          <div className="flex flex-col items-center group cursor-pointer">
            <div
              className="size-24 rounded-full border-4 border-slate-200 mb-4 bg-cover bg-center overflow-hidden transition-transform group-hover:scale-105"
              style={
                topThree[1].avatar && topThree[1].avatar.startsWith("http")
                  ? { backgroundImage: `url(${topThree[1].avatar})` }
                  : undefined
              }
            >
              {topThree[1].avatar && !topThree[1].avatar.startsWith("http") && (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {topThree[1].avatar}
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl w-48 text-center shadow-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-bold text-sm mb-1 block uppercase tracking-widest">
                #2 Rank
              </span>
              <p className="font-bold text-lg mb-1 truncate">{topThree[1].username}</p>
              <p className="text-[#135bec] font-extrabold text-xl">
                {formatUpvotes(getUpvotes(topThree[1]))}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                Upvotes
              </p>
            </div>
          </div>
        )}

        {/* Rank 1 */}
        {topThree[0] && (
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="relative mb-6">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400">
                <span className="material-symbols-outlined text-5xl">
                  workspace_premium
                </span>
              </div>
              <div
                className="size-32 rounded-full border-4 border-[#135bec] mb-4 bg-cover bg-center overflow-hidden transition-transform group-hover:scale-105 shadow-[0_10px_25px_-5px_rgba(19,91,236,0.1),0_8px_10px_-6px_rgba(19,91,236,0.1)]"
                style={
                  topThree[0].avatar && topThree[0].avatar.startsWith("http")
                    ? { backgroundImage: `url(${topThree[0].avatar})` }
                    : undefined
                }
              >
                {topThree[0].avatar && !topThree[0].avatar.startsWith("http") && (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    {topThree[0].avatar}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#135bec] p-8 rounded-2xl w-56 text-center shadow-2xl transform -translate-y-4">
              <span className="text-white/70 font-bold text-sm mb-1 block uppercase tracking-widest">
                🏆 #1 Rank
              </span>
              <p className="text-white font-black text-2xl mb-1 truncate">
                {topThree[0].username}
              </p>
              <p className="text-white font-black text-3xl">
                {formatUpvotes(getUpvotes(topThree[0]))}
              </p>
              <p className="text-[10px] text-white/60 font-bold uppercase mt-2">
                Upvotes
              </p>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {topThree[2] && (
          <div className="flex flex-col items-center group cursor-pointer">
            <div
              className="size-24 rounded-full border-4 border-[#cd7f32]/30 mb-4 bg-cover bg-center overflow-hidden transition-transform group-hover:scale-105"
              style={
                topThree[2].avatar && topThree[2].avatar.startsWith("http")
                  ? { backgroundImage: `url(${topThree[2].avatar})` }
                  : undefined
              }
            >
              {topThree[2].avatar && !topThree[2].avatar.startsWith("http") && (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {topThree[2].avatar}
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl w-48 text-center shadow-lg border border-slate-100 dark:border-slate-800">
              <span className="text-[#cd7f32] font-bold text-sm mb-1 block uppercase tracking-widest">
                #3 Rank
              </span>
              <p className="font-bold text-lg mb-1 truncate">{topThree[2].username}</p>
              <p className="text-[#135bec] font-extrabold text-xl">
                {formatUpvotes(getUpvotes(topThree[2]))}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                Upvotes
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white dark:bg-[#1a2133] rounded-xl shadow-sm border border-[#e7ebf3] dark:border-[#2d3748] mb-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 border-b border-[#e7ebf3] dark:border-[#2d3748]">
          <div className="flex gap-8">
            <button
              onClick={() => setTimeFilter("7days")}
              className={`py-5 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                timeFilter === "7days"
                  ? "border-[#135bec] text-[#135bec]"
                  : "border-transparent text-[#4c669a] dark:text-[#94a3b8] hover:text-[#135bec]"
              }`}
            >
              7 DAYS
            </button>
            <button
              onClick={() => setTimeFilter("30days")}
              className={`py-5 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                timeFilter === "30days"
                  ? "border-[#135bec] text-[#135bec]"
                  : "border-transparent text-[#4c669a] dark:text-[#94a3b8] hover:text-[#135bec]"
              }`}
            >
              30 DAYS
            </button>
            <button
              onClick={() => setTimeFilter("alltime")}
              className={`py-5 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                timeFilter === "alltime"
                  ? "border-[#135bec] text-[#135bec]"
                  : "border-transparent text-[#4c669a] dark:text-[#94a3b8] hover:text-[#135bec]"
              }`}
            >
              ALL-TIME
            </button>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category | "all")}
              className="px-3 py-1.5 rounded-lg border border-[#e7ebf3] dark:border-[#2d3748] text-sm font-medium bg-white dark:bg-[#1a2133] text-[#0d121b] dark:text-white cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Economics">Economics</option>
              <option value="Science">Science</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Society">Society</option>
              <option value="Politics">Politics</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#161d2b] text-[#4c669a] dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-8 py-4">Rank</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Upvotes</th>
                <th className="px-6 py-4">Top Argument</th>
                <th className="px-6 py-4">Debates</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7ebf3] dark:divide-[#2d3748]">
              {restOfUsers.map((user, index) => {
                const rank = index + 4;
                return (
                  <tr
                    key={user.id}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-8 py-5 text-sm font-bold text-slate-500">
                      #{rank}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-8 rounded-full bg-cover bg-center"
                          style={
                            user.avatar && user.avatar.startsWith("http")
                              ? { backgroundImage: `url(${user.avatar})` }
                              : undefined
                          }
                        >
                          {user.avatar && !user.avatar.startsWith("http") && (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              {user.avatar}
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-sm">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <span className="font-black text-[#059669]">
                        {formatUpvotes(getUpvotes(user))}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-[#4c669a] dark:text-[#94a3b8] max-w-xs">
                      {user.topTakeSnippet ? (
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mr-2 ${
                              user.topTakeSide === "YES"
                                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {user.topTakeSide}
                          </span>
                          <span className="line-clamp-1">{user.topTakeSnippet}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-sm text-[#4c669a] dark:text-[#94a3b8]">
                      {user.debatesCount}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-[#135bec] font-bold text-xs hover:underline">
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 flex items-center justify-between border-t border-[#e7ebf3] dark:border-[#2d3748]">
          <p className="text-xs text-[#4c669a] dark:text-[#94a3b8] font-medium">
            Showing 1 to {leaderboardData.length} of {leaderboardData.length} debaters
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-[#e7ebf3] dark:border-[#2d3748] text-xs font-bold text-[#4c669a] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-not-allowed opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-[#135bec] text-xs font-bold text-[#135bec] hover:bg-[#135bec]/10 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Top Takes Section */}
      {topTakes.length > 0 && (
        <div className="bg-white dark:bg-[#1a2133] rounded-xl shadow-sm border border-[#e7ebf3] dark:border-[#2d3748] p-8 mb-8">
          <h2 className="text-2xl font-black mb-6 text-[#0d121b] dark:text-white">
            Top Takes
          </h2>
          <div className="space-y-4">
            {topTakes.map((take, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-[#e7ebf3] dark:border-[#2d3748] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          take.side === "YES"
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {take.side}
                      </span>
                      <span className="text-xs text-[#4c669a] dark:text-slate-400">
                        {take.upvotes.toLocaleString()} upvotes
                      </span>
                    </div>
                    <p className="text-sm text-[#0d121b] dark:text-white mb-2 line-clamp-2">
                      {take.snippet}
                    </p>
                    <Link
                      href={`/q/${take.slug}`}
                      className="text-sm text-[#135bec] hover:underline font-medium"
                    >
                      {take.questionTitle}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm">
          <p className="text-[10px] font-black uppercase text-[#4c669a] dark:text-[#94a3b8] tracking-widest mb-1">
            Total Upvotes
          </p>
          <p className="text-2xl font-black text-[#0d121b] dark:text-white">
            {mockLeaderboardUsers
              .reduce((sum, user) => sum + user.upvotesAllTime, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm">
          <p className="text-[10px] font-black uppercase text-[#4c669a] dark:text-[#94a3b8] tracking-widest mb-1">
            Active Debaters
          </p>
          <p className="text-2xl font-black text-[#0d121b] dark:text-white">
            {mockLeaderboardUsers.length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm">
          <p className="text-[10px] font-black uppercase text-[#4c669a] dark:text-[#94a3b8] tracking-widest mb-1">
            Total Debates
          </p>
          <p className="text-2xl font-black text-[#135bec]">
            {mockLeaderboardUsers.reduce((sum, user) => sum + user.debatesCount, 0)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-[#e7ebf3] dark:border-[#2d3748]">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[11px] text-[#4c669a] dark:text-[#94a3b8] font-medium tracking-wide">
              © 2024 Debate Platform. Engage thoughtfully.
            </p>
          </div>
      </footer>
    </main>
  );
}
