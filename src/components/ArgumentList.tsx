/**
 * Generic argument list: groups arguments by side (PRO/CON/HOLD) and renders with ArgumentCard.
 * Optional sideLabels for category-specific display (e.g. Bull/Bear/Hold for stocks).
 */
import type { Argument } from "@/lib/types";
import ArgumentCard from "./ArgumentCard";

interface ArgumentListProps {
  arguments_: Argument[];
  sideLabels?: { PRO: string; CON: string; HOLD: string };
  emptyMessage?: { PRO: string; CON: string; HOLD: string };
}

const defaultEmpty = {
  PRO: "No arguments yet. Be the first to argue Pro!",
  CON: "No arguments yet. Be the first to argue Con!",
  HOLD: "No arguments yet. Be the first to argue Hold!",
};

export default function ArgumentList({
  arguments_,
  sideLabels = { PRO: "Pro", CON: "Con", HOLD: "Hold" },
  emptyMessage = defaultEmpty,
}: ArgumentListProps) {
  const proArgs = arguments_.filter((a) => a.side === "PRO");
  const conArgs = arguments_.filter((a) => a.side === "CON");
  const holdArgs = arguments_.filter((a) => a.side === "HOLD");

  const renderColumn = (
    side: "PRO" | "CON" | "HOLD",
    args: Argument[],
    label: string,
    barColor: string
  ) => (
    <div key={side} className="flex flex-col gap-6">
      <div className="lg:sticky lg:top-[80px] z-10 py-3 bg-[#f6f6f8] dark:bg-[#101622] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`size-3 rounded-full shadow-[0_0_8px_currentColor] ${barColor}`}
            style={{
              color:
                side === "PRO"
                  ? "rgb(34, 197, 94)"
                  : side === "CON"
                    ? "rgb(239, 68, 68)"
                    : "rgb(245, 158, 11)",
            }}
          />
          <h3
            className={`text-xl font-black uppercase tracking-tighter ${
              side === "PRO"
                ? "text-[#22c55e]"
                : side === "CON"
                  ? "text-[#ef4444]"
                  : "text-amber-500"
            }`}
          >
            Arguments for {label}
          </h3>
        </div>
        <span className="text-[#4c669a] dark:text-[#94a3b8] text-sm font-bold">
          {args.length} Argument{args.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-6">
        {args.length > 0 ? (
          args.map((arg) => (
            <ArgumentCard
              key={arg.id}
              argument={arg}
              sideLabels={sideLabels}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-[#1a2133] rounded-xl p-8 text-center text-[#4c669a] dark:text-[#94a3b8] border border-[#e7ebf3] dark:border-[#2d3748]">
            {emptyMessage[side]}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
      {renderColumn(
        "PRO",
        proArgs,
        sideLabels.PRO,
        "bg-[#22c55e]"
      )}
      {renderColumn(
        "CON",
        conArgs,
        sideLabels.CON,
        "bg-[#ef4444]"
      )}
      {holdArgs.length > 0 && (
        <div className="lg:col-span-2">
          {renderColumn(
            "HOLD",
            holdArgs,
            sideLabels.HOLD,
            "bg-amber-500"
          )}
        </div>
      )}
    </div>
  );
}
