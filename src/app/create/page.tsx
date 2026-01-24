"use client";

import { useState } from "react";
import Link from "next/link";
import { Category } from "@/lib/types";

const categories: Category[] = [
  "Technology",
  "Politics",
  "Science",
  "Philosophy",
  "Society",
  "Economics",
];

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [closingDate, setClosingDate] = useState("");
  const [rules, setRules] = useState("");

  const titleLength = title.length;
  const maxTitleLength = 120;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submission logic
    console.log({ title, category, closingDate, rules });
    alert("Question created! (Mock - no backend yet)");
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft logic
    console.log("Saving draft...", { title, category, closingDate, rules });
    alert("Draft saved! (Mock - no backend yet)");
  };

  return (
    <main className="max-w-[1200px] mx-auto py-10 px-6 lg:px-10">
      {/* Page Heading */}
      <div className="mb-10">
        <h1 className="text-[#0d121b] dark:text-white text-4xl font-black leading-tight tracking-tight">
          Create New Question
        </h1>
        <p className="text-[#4c669a] dark:text-slate-400 text-lg font-normal mt-2">
          Launch a new binary market for sports, stocks, or global events.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main Form Section */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-[#e7ebf3] dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Question Title
              </label>
              <p className="text-sm text-[#4c669a] dark:text-slate-400 mb-1">
                Make sure the question can be answered with "Yes" or "No".
              </p>
              <input
                className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                placeholder="e.g., Will the Lakers win their next game?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={maxTitleLength}
                required
              />
              <div className="flex justify-end">
                <span className="text-xs text-[#4c669a] dark:text-slate-500">
                  {titleLength} / {maxTitleLength} characters
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Select */}
              <div className="flex flex-col gap-2">
                <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                  Category
                </label>
                <select
                  className="w-full h-14 rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent px-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] appearance-none cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  required
                >
                  <option disabled value="">
                    Select a category...
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date/Time Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                  Market Closing Date
                </label>
                <input
                  className="w-full h-14 rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent px-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] cursor-pointer"
                  type="datetime-local"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Context / Rules Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Rules & Context
              </label>
              <p className="text-sm text-[#4c669a] dark:text-slate-400 mb-1">
                Define the resolution source and specific conditions for this
                market.
              </p>
              <textarea
                className="w-full min-h-[180px] rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                placeholder="Example: This market resolves to 'Yes' if the Los Angeles Lakers are officially declared winners of their game against the Warriors on Dec 15th per ESPN.com stats..."
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 lg:flex-none lg:min-w-[200px] h-14 bg-[#135bec] text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-[#135bec]/20"
              >
                Publish Question
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 lg:flex-none lg:min-w-[140px] h-14 border border-[#cfd7e7] dark:border-slate-700 text-[#0d121b] dark:text-white font-semibold rounded-lg hover:bg-[#f8f9fc] dark:hover:bg-slate-800 transition-all"
              >
                Save Draft
              </button>
              <button
                type="button"
                className="hidden sm:flex items-center gap-2 text-[#4c669a] dark:text-slate-400 font-medium px-4 h-14 hover:text-[#135bec] transition-colors"
              >
                <span className="material-symbols-outlined">visibility</span>
                Preview
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          {/* Guidelines Card */}
          <div className="bg-[#135bec]/5 dark:bg-[#135bec]/10 rounded-xl p-6 border border-[#135bec]/10">
            <div className="flex items-center gap-2 mb-4 text-[#135bec]">
              <span className="material-symbols-outlined font-bold">lightbulb</span>
              <h3 className="font-bold text-lg">Posting Guidelines</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-[#135bec] text-xl">
                  check_circle
                </span>
                <p className="text-sm text-[#4c669a] dark:text-slate-300 leading-relaxed">
                  <strong className="text-[#0d121b] dark:text-white">
                    Be Clear:
                  </strong>{" "}
                  Avoid ambiguous wording. The outcome should be indisputable.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-[#135bec] text-xl">
                  check_circle
                </span>
                <p className="text-sm text-[#4c669a] dark:text-slate-300 leading-relaxed">
                  <strong className="text-[#0d121b] dark:text-white">
                    Cite Sources:
                  </strong>{" "}
                  Specify which website or authority will be used for final
                  results.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-[#135bec] text-xl">
                  check_circle
                </span>
                <p className="text-sm text-[#4c669a] dark:text-slate-300 leading-relaxed">
                  <strong className="text-[#0d121b] dark:text-white">
                    Neutrality:
                  </strong>{" "}
                  Frame questions objectively without bias toward 'Yes' or 'No'.
                </p>
              </li>
            </ul>
          </div>

          {/* Examples Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7ebf3] dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-[#0d121b] dark:text-white">
              Good Examples
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-[#f6f6f8] dark:bg-slate-800 rounded-lg">
                <p className="text-xs font-semibold text-[#135bec] uppercase mb-1">
                  CRYPTO
                </p>
                <p className="text-sm text-[#0d121b] dark:text-white font-medium">
                  Will Bitcoin hit $100k before Jan 1st, 2025?
                </p>
              </div>
              <div className="p-3 bg-[#f6f6f8] dark:bg-slate-800 rounded-lg">
                <p className="text-xs font-semibold text-[#135bec] uppercase mb-1">
                  FINANCE
                </p>
                <p className="text-sm text-[#0d121b] dark:text-white font-medium">
                  Will the S&P 500 close green on Friday?
                </p>
              </div>
            </div>
            <button className="w-full mt-6 text-[#135bec] text-sm font-semibold hover:underline">
              View all examples
            </button>
          </div>

          {/* Navigation Links for Creator Tools */}
          <div className="flex flex-col gap-1 px-2">
            <Link
              href="#"
              className="flex items-center gap-3 py-2 text-[#4c669a] dark:text-slate-400 hover:text-[#135bec] transition-colors"
            >
              <span className="material-symbols-outlined">description</span>
              <span className="text-sm font-medium">Manage Drafts</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 py-2 text-[#4c669a] dark:text-slate-400 hover:text-[#135bec] transition-colors"
            >
              <span className="material-symbols-outlined">analytics</span>
              <span className="text-sm font-medium">Market Performance</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 py-2 text-[#4c669a] dark:text-slate-400 hover:text-[#135bec] transition-colors"
            >
              <span className="material-symbols-outlined">help_outline</span>
              <span className="text-sm font-medium">Help Center</span>
            </Link>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#e7ebf3] dark:border-slate-800 py-10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[#135bec] opacity-50 grayscale">
            <div className="size-6">
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
                <path
                  clipRule="evenodd"
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#0d121b] dark:text-white text-sm font-bold">
              SideQuest
            </h2>
          </div>
          <div className="flex gap-8 text-[#4c669a] dark:text-slate-500 text-sm">
            <Link href="#" className="hover:text-[#135bec]">
              Terms
            </Link>
            <Link href="#" className="hover:text-[#135bec]">
              Privacy
            </Link>
            <Link href="#" className="hover:text-[#135bec]">
              Rules
            </Link>
            <Link href="#" className="hover:text-[#135bec]">
              Support
            </Link>
          </div>
          <p className="text-[#4c669a] dark:text-slate-500 text-sm">
            © 2024 SideQuest Prediction Markets
          </p>
        </div>
      </footer>
    </main>
  );
}
