"use client";

import type { ArgumentSide } from "@/lib/types";

interface MobileArgumentSideToggleProps {
  proLabel: string;
  conLabel: string;
  proCount: number;
  conCount: number;
  value: ArgumentSide;
  onChange: (side: ArgumentSide) => void;
}

/**
 * Mobile-only (hide with md:hidden from parent) Bull/Bear or Pro/Con segmented control.
 */
export default function MobileArgumentSideToggle({
  proLabel,
  conLabel,
  proCount,
  conCount,
  value,
  onChange,
}: MobileArgumentSideToggleProps) {
  return (
    <div
      className="w-full min-w-0 rounded-full border border-slate-200/80 dark:border-slate-700/90 bg-slate-100/90 dark:bg-[#0c1220] p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]"
      role="tablist"
      aria-label="Argument side"
    >
      <div className="flex gap-1 min-w-0">
        <button
          type="button"
          role="tab"
          aria-selected={value === "PRO"}
          id="mobile-arg-tab-pro"
          onClick={() => onChange("PRO")}
          className={`min-w-0 flex-1 rounded-full py-2.5 px-2 text-center text-sm font-bold tracking-tight transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#135bec] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#101622] ${
            value === "PRO"
              ? "bg-emerald-500/18 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-emerald-500/25"
              : "text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <span className="truncate block">
            {proLabel}{" "}
            <span className={value === "PRO" ? "opacity-90" : "opacity-70"}>({proCount})</span>
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value === "CON"}
          id="mobile-arg-tab-con"
          onClick={() => onChange("CON")}
          className={`min-w-0 flex-1 rounded-full py-2.5 px-2 text-center text-sm font-bold tracking-tight transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#135bec] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#101622] ${
            value === "CON"
              ? "bg-red-500/15 dark:bg-red-500/18 text-red-700 dark:text-red-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-red-500/25"
              : "text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <span className="truncate block">
            {conLabel}{" "}
            <span className={value === "CON" ? "opacity-90" : "opacity-70"}>({conCount})</span>
          </span>
        </button>
      </div>
    </div>
  );
}
