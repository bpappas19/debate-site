"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useUI } from "@/contexts/UIContext";
import { createClient } from "@/lib/supabaseClient";
import type { User as AuthUser } from "@supabase/supabase-js";

export default function NavBar() {
  const router = useRouter();
  const { toggleSidebar } = useUI();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    const getSession = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!cancelled) {
        setUser(u);
        setAuthLoading(false);
      }
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setUser(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1a2130] border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 h-14 flex items-center overflow-visible">
      <div className="w-full flex items-center justify-between gap-8">
        {/* Menu & Brand */}
        <div className="flex items-center gap-3 overflow-visible">
          <button
            onClick={toggleSidebar}
            className="h-10 w-10 rounded-xl hover:bg-slate-800/60 dark:hover:bg-slate-800/60 flex items-center justify-center transition-colors shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <Link
            href="/"
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#135bec] rounded-lg -my-3 md:-my-4 lg:-my-5"
            aria-label="DebateIt home"
          >
            <Image
              src="/images/Debate_Logo.png"
              alt="DebateIt"
              width={560}
              height={143}
              className="h-24 md:h-32 lg:h-40 w-auto"
              priority
            />
          </Link>
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
            {!authLoading && (
              user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold hidden lg:block text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                    {user.user_metadata?.username ?? user.email}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-sm font-medium text-[#4c669a] dark:text-[#94a3b8] hover:text-[#135bec] dark:hover:text-[#135bec] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="cursor-pointer p-2 pr-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Sign in
                </Link>
              )
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
