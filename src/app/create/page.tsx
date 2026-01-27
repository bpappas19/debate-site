"use client";

import { useState } from "react";
import { Category, Side } from "@/lib/types";

const categories: Category[] = [
  "Technology",
  "Politics",
  "Science",
  "Philosophy",
  "Society",
  "Economics",
];

export default function CreatePage() {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [context, setContext] = useState("");
  const [firstArgument, setFirstArgument] = useState("");
  const [firstArgumentSide, setFirstArgumentSide] = useState<Side | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      question,
      category,
      context: context || undefined,
      firstArgument: firstArgument
        ? {
            content: firstArgument,
            side: firstArgumentSide,
          }
        : undefined,
    };
    console.log("Publishing debate:", payload);
    alert("Debate published! (Mock - no backend yet)");
  };

  const handleSaveDraft = () => {
    const payload = {
      question,
      category,
      context: context || undefined,
      firstArgument: firstArgument
        ? {
            content: firstArgument,
            side: firstArgumentSide,
          }
        : undefined,
    };
    console.log("Saving draft:", payload);
    alert("Draft saved! (Mock - no backend yet)");
  };

  return (
    <main className="py-10">
      <div className="mx-auto max-w-3xl">
        {/* Page Heading */}
        <div className="mb-10">
          <h1 className="text-[#0d121b] dark:text-white text-4xl font-black leading-tight tracking-tight">
            Create New Debate
          </h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg font-normal mt-2">
            Start a new debate and invite others to share their perspectives.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-[#e7ebf3] dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Debate Question - Required */}
            <div className="flex flex-col gap-2">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Debate Question <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-[#4c669a] dark:text-slate-400 mb-1">
                Ask a question that can be answered with "Yes" or "No".
              </p>
              <input
                className="w-full rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                placeholder="e.g., Should AI development be heavily regulated?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            {/* Category - Required */}
            <div className="flex flex-col gap-2">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Category <span className="text-red-500">*</span>
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

            {/* Context - Optional */}
            <div className="flex flex-col gap-2">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Context <span className="text-[#4c669a] dark:text-slate-400 text-sm font-normal">(Optional)</span>
              </label>
              <p className="text-sm text-[#4c669a] dark:text-slate-400 mb-1">
                Provide additional context or background information for the debate.
              </p>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                placeholder="Add context or background information..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            {/* First Argument - Optional Extra */}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#e7ebf3] dark:border-slate-800">
              <label className="text-[#0d121b] dark:text-white text-base font-semibold">
                Add First Argument <span className="text-[#4c669a] dark:text-slate-400 text-sm font-normal">(Optional)</span>
              </label>
              <p className="text-sm text-[#4c669a] dark:text-slate-400 mb-1">
                Start the debate by adding your first argument.
              </p>
              
              <div className="flex gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setFirstArgumentSide("YES")}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                    firstArgumentSide === "YES"
                      ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                      : "border-[#cfd7e7] dark:border-slate-700 text-[#0d121b] dark:text-white hover:border-green-500"
                  }`}
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={() => setFirstArgumentSide("NO")}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                    firstArgumentSide === "NO"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                      : "border-[#cfd7e7] dark:border-slate-700 text-[#0d121b] dark:text-white hover:border-red-500"
                  }`}
                >
                  NO
                </button>
              </div>

              <textarea
                className="w-full min-h-[120px] rounded-lg border border-[#cfd7e7] dark:border-slate-700 bg-transparent p-4 text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] placeholder:text-[#4c669a] dark:placeholder:text-slate-600 transition-all"
                placeholder="Write your argument here..."
                value={firstArgument}
                onChange={(e) => setFirstArgument(e.target.value)}
                disabled={!firstArgumentSide}
              />
              {!firstArgumentSide && (
                <p className="text-xs text-[#4c669a] dark:text-slate-400">
                  Please select YES or NO above to add an argument.
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 lg:flex-none lg:min-w-[200px] h-14 bg-[#135bec] text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-[#135bec]/20"
              >
                Publish Debate
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 lg:flex-none lg:min-w-[140px] h-14 border border-[#cfd7e7] dark:border-slate-700 text-[#0d121b] dark:text-white font-semibold rounded-lg hover:bg-[#f8f9fc] dark:hover:bg-slate-800 transition-all"
              >
                Save Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
