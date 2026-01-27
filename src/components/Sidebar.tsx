"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useUI } from "@/contexts/UIContext";
import { Category } from "@/lib/types";
import { FEATURES } from "@/lib/features";

const categories: Category[] = ["Technology", "Economics", "Science", "Philosophy", "Society", "Politics"];

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const selectedCategory = searchParams.get("category") as Category | null;

  // Close sidebar on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } ${
          sidebarOpen ? "lg:block" : "lg:hidden"
        } fixed lg:sticky top-[57px] h-[calc(100vh-57px)] w-[280px] overflow-y-auto rounded-2xl border border-slate-800/60 dark:border-slate-800/60 bg-slate-950/40 dark:bg-slate-950/40 p-4 transition-all duration-200 z-50 lg:z-auto`}
      >
        <div className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Discovery
            </p>
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                pathname === "/"
                  ? "text-[#135bec] bg-[#135bec]/10"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="material-symbols-outlined">explore</span>
              <span>Feed</span>
            </Link>
            {FEATURES.leaderboard && (
              <Link
                href="/leaderboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/leaderboard"
                    ? "text-[#135bec] bg-[#135bec]/10"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="material-symbols-outlined">emoji_events</span>
                <span>Leaderboard</span>
              </Link>
            )}
            <Link
              href="/create"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                pathname === "/create"
                  ? "text-[#135bec] bg-[#135bec]/10"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="material-symbols-outlined">schedule</span>
              <span>Create</span>
            </Link>
          </div>

          {/* Categories */}
          <div className="space-y-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Categories
            </p>
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              const icons: Record<Category, string> = {
                Technology: "memory",
                Economics: "show_chart",
                Science: "science",
                Philosophy: "psychology",
                Society: "groups",
                Politics: "how_to_vote",
              };
              return (
                <Link
                  key={category}
                  href={`/?category=${category}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "text-[#135bec] bg-[#135bec]/10"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="material-symbols-outlined">{icons[category]}</span>
                  <span>{category}</span>
                </Link>
              );
            })}
          </div>

          {/* Footer Sidebar */}
          {FEATURES.points && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <p className="text-xs font-medium text-gray-500 mb-2">My Points</p>
                <p className="text-lg font-bold">1,250</p>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <span className="material-symbols-outlined !text-sm">trending_up</span>
                  <span>+4.2% today</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUI();

  return (
    <Suspense fallback={null}>
      <SidebarContent />
    </Suspense>
  );
}
