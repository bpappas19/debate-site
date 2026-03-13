"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useUI } from "@/contexts/UIContext";

export default function NavBar() {
  const { sidebarOpen, toggleSidebar } = useUI();

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1a2130] border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 py-3">
      <div className="w-full flex items-center justify-between gap-8">
        {/* Menu & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="h-10 w-10 rounded-xl hover:bg-slate-800/60 dark:hover:bg-slate-800/60 flex items-center justify-center transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Spacer to keep layout balanced (search lives in hero) */}
        <div className="flex-1" />

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
              href="/create"
              className="hover:text-[#135bec] transition-colors"
            >
              Create
            </Link>
          </div>
          <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-6">
            <button
              type="button"
              onClick={() => alert("Notifications coming soon")}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative"
            >
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
