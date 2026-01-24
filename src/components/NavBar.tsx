"use client";

import Link from "next/link";
import { useState } from "react";
import { useUI } from "@/contexts/UIContext";

export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { sidebarOpen, toggleSidebar } = useUI();

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1a2130] border-b border-gray-200 dark:border-gray-800 px-6 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined">view_sidebar</span>
          </button>
          <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-[#135bec] text-white p-1.5 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined !text-2xl">query_stats</span>
          </div>
            <h2 className="text-xl font-bold tracking-tight text-[#0d121b] dark:text-white">
              SideQuest
            </h2>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#135bec] transition-colors">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              placeholder="Search debates, markets, or stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-[#135bec] text-sm placeholder-gray-500 transition-all"
            />
          </div>
        </div>

        {/* Nav Actions */}
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link
              href="/"
              className="hover:text-[#135bec] transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/leaderboard"
              className="hover:text-[#135bec] transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/create"
              className="hover:text-[#135bec] transition-colors"
            >
              Create
            </Link>
          </div>
          <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-6">
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2130]"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#135bec]/20 flex items-center justify-center text-sm">
                👤
              </div>
              <span className="text-sm font-semibold hidden lg:block">Guest</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
