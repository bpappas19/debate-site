"use client";

import { mockQuestions } from "@/lib/mock";
import FeedQuestionCard from "@/components/FeedQuestionCard";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useUI } from "@/contexts/UIContext";

export default function FeedPage() {
  const { sidebarOpen } = useUI();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div
        className={`grid gap-8 items-start ${
          sidebarOpen ? "lg:grid-cols-[280px_1fr]" : "lg:grid-cols-1"
        }`}
      >
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Feed */}
        <main className="min-w-0">
          {/* Page Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Active Debates
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Predict the outcome and earn rewards.
              </p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:border-[#135bec] transition-all">
                <span>Latest</span>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:border-[#135bec] transition-all">
                <span>All Volume</span>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
              <Link
                href="/create"
                className="flex items-center gap-2 px-4 py-2 bg-[#135bec] text-white rounded-lg shadow-sm hover:bg-[#135bec]/90 text-sm font-bold transition-all"
              >
                <span className="material-symbols-outlined">add</span>
                <span>Create Debate</span>
              </Link>
            </div>
          </div>

          {/* Question Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {mockQuestions.map((question) => (
              <FeedQuestionCard key={question.id} question={question} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <button className="w-full py-4 text-sm font-bold text-gray-500 hover:text-[#135bec] transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              Load More Debates
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
