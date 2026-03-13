"use client";

export default function FollowDebateButton() {
  return (
    <button
      type="button"
      onClick={() => alert("Coming soon")}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#1a2133] border border-[#e7ebf3] dark:border-[#2d3748] text-[#0d121b] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <span className="material-symbols-outlined">bookmark</span>
      Follow Debate
    </button>
  );
}
