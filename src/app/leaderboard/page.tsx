"use client";

import { useState } from "react";
import { mockLeaderboardUsers } from "@/lib/mock";
import { Category } from "@/lib/types";

// Extended user data for leaderboard display
interface LeaderboardUser {
  id: string;
  username: string;
  avatar?: string;
  points: number;
  winRate: number;
  resolvedTakes: number;
  bestCategory: Category;
}

// Mock extended data - in real app this would come from backend
const getLeaderboardData = (): LeaderboardUser[] => {
  const categories: Category[] = [
    "Technology",
    "Politics",
    "Science",
    "Philosophy",
    "Society",
    "Economics",
  ];
  
  return mockLeaderboardUsers.map((user, index) => ({
    ...user,
    winRate: 90 - index * 2.5 + Math.random() * 5, // Mock win rate
    resolvedTakes: Math.floor(500 + index * 200 + Math.random() * 1000),
    bestCategory: categories[index % categories.length],
  }));
};

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<"30days" | "alltime" | "category">("30days");
  const leaderboardData = getLeaderboardData();
  
  // Top 3 for podium
  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);

  const getCategoryColor = (category: Category) => {
    const colors: Record<Category, { bg: string; text: string }> = {
      Technology: { bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-600 dark:text-indigo-400" },
      Politics: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" },
      Science: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" },
      Philosophy: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400" },
      Society: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400" },
      Economics: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400" },
    };
    return colors[category] || colors.Technology;
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-10">
      {/* Page Heading */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-[#0d121b] dark:text-white">
          Debater Leaderboard
        </h1>
        <p className="text-[#4c669a] dark:text-[#94a3b8] text-lg max-w-2xl mx-auto">
          Analyze the top performers in global betting, stock predictions, and
          high-stakes market debates.
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
                {topThree[1].winRate.toFixed(1)}%
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                Win Rate
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
                {topThree[0].winRate.toFixed(1)}%
              </p>
              <p className="text-[10px] text-white/60 font-bold uppercase mt-2">
                Win Rate
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
                {topThree[2].winRate.toFixed(1)}%
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                Win Rate
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
            <button
              onClick={() => setTimeFilter("category")}
              className={`py-5 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                timeFilter === "category"
                  ? "border-[#135bec] text-[#135bec]"
                  : "border-transparent text-[#4c669a] dark:text-[#94a3b8] hover:text-[#135bec]"
              }`}
            >
              BY CATEGORY
            </button>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e7ebf3] dark:border-[#2d3748] text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#161d2b] text-[#4c669a] dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-8 py-4">Rank</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Win Rate</th>
                <th className="px-6 py-4">Resolved Takes</th>
                <th className="px-6 py-4">Best Category</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7ebf3] dark:divide-[#2d3748]">
              {restOfUsers.map((user, index) => {
                const rank = index + 4;
                const categoryColor = getCategoryColor(user.bestCategory);
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
                        {user.winRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-[#4c669a] dark:text-[#94a3b8]">
                      {user.resolvedTakes.toLocaleString()} Takes
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`${categoryColor.bg} ${categoryColor.text} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase`}
                      >
                        {user.bestCategory}
                      </span>
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

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm">
          <p className="text-[10px] font-black uppercase text-[#4c669a] dark:text-[#94a3b8] tracking-widest mb-1">
            Platform Avg Win Rate
          </p>
          <p className="text-2xl font-black text-[#0d121b] dark:text-white">52.4%</p>
        </div>
        <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm">
          <p className="text-[10px] font-black uppercase text-[#4c669a] dark:text-[#94a3b8] tracking-widest mb-1">
            Total Takes Resolved
          </p>
          <p className="text-2xl font-black text-[#0d121b] dark:text-white">842,910</p>
        </div>
        <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm">
          <p className="text-[10px] font-black uppercase text-[#4c669a] dark:text-[#94a3b8] tracking-widest mb-1">
            Top Category Growth
          </p>
          <p className="text-2xl font-black text-[#135bec]">
            +12.4% <span className="text-xs font-medium text-slate-400 ml-1">in Stocks</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-[#e7ebf3] dark:border-[#2d3748]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <div className="size-6 text-slate-800 dark:text-white">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tighter text-[#0d121b] dark:text-white">
              SideQuest
            </span>
          </div>
          <p className="text-[11px] text-[#4c669a] dark:text-[#94a3b8] font-medium tracking-wide">
            © 2024 SideQuest Analytics. All betting involves risk. Trade responsibly.
          </p>
        </div>
      </footer>
    </main>
  );
}
