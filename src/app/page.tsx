"use client";

import { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { mockQuestions } from "@/lib/mock";
import FeedQuestionCard from "@/components/FeedQuestionCard";
import Link from "next/link";
import { Category } from "@/lib/types";

const categories: Category[] = ["Technology", "Economics", "Science", "Philosophy", "Society", "Politics"];

function FeedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category") as Category | null;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredQuestions = useMemo(() => {
    if (!selectedCategory) {
      return mockQuestions;
    }
    return mockQuestions.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    // Use setTimeout to avoid immediate close on button click
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    document.addEventListener("keydown", handleEscape);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (category: Category | null) => {
    setIsOpen(false);
    if (category) {
      router.push(`/?category=${category}`);
    } else {
      router.push("/");
    }
  };

  return (
    <>
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
        <div className="flex items-center gap-2 pb-2 md:pb-0">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:border-[#135bec] transition-all"
            >
              <span>{selectedCategory || "All Categories"}</span>
              <span className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleSelect(null)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    !selectedCategory
                      ? "text-[#135bec] bg-[#135bec]/10"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleSelect(category)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedCategory === category
                        ? "text-[#135bec] bg-[#135bec]/10"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
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
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-stretch">
        {filteredQuestions.map((question) => (
          <FeedQuestionCard key={question.id} question={question} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full py-4 text-sm font-bold text-gray-500 hover:text-[#135bec] transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          Load More Debates
        </button>
      </div>
    </>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))] items-stretch">
        {mockQuestions.map((question) => (
          <FeedQuestionCard key={question.id} question={question} />
        ))}
      </div>
    }>
      <FeedContent />
    </Suspense>
  );
}
