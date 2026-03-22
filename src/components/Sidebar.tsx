"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useUI } from "@/contexts/UIContext";
import { CATEGORIES } from "@/lib/categories";
import { FEATURES } from "@/lib/features";

const navLinkBase =
  "flex items-center gap-2.5 rounded-lg font-medium transition-colors text-sm md:text-[15px] md:gap-3 md:px-3 md:py-2 px-2.5 py-1.5";
const navLinkInactive =
  "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800";
const navLinkActive = "text-[#135bec] bg-[#135bec]/10";

function SidebarContent() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUI();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sidebarOpen) return;
    const isMobileDrawer = () => window.matchMedia("(max-width: 767px)").matches;
    const lock = () => {
      if (isMobileDrawer()) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    };
    lock();
    const mq = window.matchMedia("(max-width: 767px)");
    mq.addEventListener("change", lock);
    return () => {
      mq.removeEventListener("change", lock);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const id = requestAnimationFrame(() => setSidebarOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname, setSidebarOpen]);

  const categoryIcons: Record<string, string> = {
    stocks: "show_chart",
    crypto: "currency_bitcoin",
    sports: "sports",
    politics: "how_to_vote",
    products: "shopping_bag",
    culture: "palette",
  };

  const linkClass = (active: boolean) =>
    `${navLinkBase} ${active ? navLinkActive : navLinkInactive}`;

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="md:hidden fixed inset-x-0 top-14 bottom-0 z-[55] bg-black/60 backdrop-blur-[1px] transition-opacity duration-300 ease-out"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          "flex flex-col border border-slate-800/60 bg-slate-950/95 md:bg-slate-950/40",
          "max-md:fixed max-md:left-0 max-md:top-14 max-md:bottom-0 max-md:z-[60]",
          "max-md:w-[min(80vw,320px)] max-md:max-w-[320px] max-md:rounded-r-2xl max-md:border-l-0 max-md:shadow-2xl",
          "max-md:transition-transform max-md:duration-300 max-md:ease-out",
          sidebarOpen ? "max-md:translate-x-0" : "max-md:pointer-events-none max-md:-translate-x-full",
          "md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-[280px] md:shrink-0 md:overflow-y-auto md:rounded-2xl md:p-4 md:shadow-none",
          "md:transition-all md:duration-200",
          sidebarOpen ? "md:block" : "md:hidden",
          "max-md:p-3 max-md:overflow-y-auto max-md:overflow-x-hidden",
        ].join(" ")}
        aria-hidden={!sidebarOpen ? true : undefined}
      >
        <div className="md:hidden flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80 shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-800/80 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-1 md:space-y-6 min-w-0">
          <div className="space-y-0.5 md:space-y-2">
            <p className="hidden md:block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 md:mb-3 px-3">
              Discovery
            </p>
            <Link href="/" className={linkClass(pathname === "/")}>
              <span className="material-symbols-outlined shrink-0 !text-[20px] md:!text-[22px] leading-none w-5 md:w-6 flex justify-center">
                explore
              </span>
              <span className="truncate">Feed</span>
            </Link>
            {FEATURES.leaderboard && (
              <Link
                href="/leaderboard"
                className={`${linkClass(pathname === "/leaderboard")} max-md:hidden`}
              >
                <span className="material-symbols-outlined shrink-0 !text-[22px] leading-none w-6 flex justify-center">
                  emoji_events
                </span>
                <span>Leaderboard</span>
              </Link>
            )}
            <Link href="/create" className={linkClass(pathname === "/create")}>
              <span className="material-symbols-outlined shrink-0 !text-[20px] md:!text-[22px] leading-none w-5 md:w-6 flex justify-center">
                schedule
              </span>
              <span className="truncate">Create</span>
            </Link>
          </div>

          <div className="space-y-0.5 md:space-y-2 mt-3 pt-3 md:mt-6 md:pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-3 px-2 md:px-3">
              Categories
            </p>
            <div className="flex flex-col gap-0.5 md:gap-1">
              {CATEGORIES.map((category) => {
                const isActive = pathname === `/category/${category.id}`;
                const href = category.active ? `/category/${category.id}` : "#";
                return (
                  <Link
                    key={category.id}
                    href={href}
                    className={`${linkClass(isActive)} ${
                      !category.active ? "opacity-70 cursor-default" : ""
                    }`}
                  >
                    <span className="material-symbols-outlined shrink-0 !text-[20px] md:!text-[22px] leading-none w-5 md:w-6 flex justify-center">
                      {categoryIcons[category.id] ?? "folder"}
                    </span>
                    <span className="truncate min-w-0 flex-1">{category.label}</span>
                    {!category.active && (
                      <span className="text-[9px] md:text-[10px] uppercase tracking-wide text-gray-500/80 dark:text-gray-500/70 shrink-0 ml-1">
                        soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {FEATURES.points && (
            <div className="mt-4 pt-4 md:mt-6 md:pt-6 border-t border-gray-200 dark:border-gray-800 max-md:hidden">
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
  return (
    <Suspense fallback={null}>
      <SidebarContent />
    </Suspense>
  );
}
