import { Side } from "@/lib/types";

interface SentimentBarProps {
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  side?: Side;
}

export default function SentimentBar({
  yesVotes,
  noVotes,
  totalVotes,
  side,
}: SentimentBarProps) {
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;

  const yesConfidence =
    yesPercentage >= 60
      ? "Confidence High"
      : yesPercentage >= 40
      ? "Moderate Support"
      : "Low Confidence";
  const noConfidence =
    noPercentage >= 60
      ? "Skeptics Rising"
      : noPercentage >= 40
      ? "Moderate Skepticism"
      : "Low Skepticism";

  return (
    <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm">
      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col">
          <span className="text-[#22c55e] font-black text-3xl">
            {yesPercentage.toFixed(0)}% YES
          </span>
          <span className="text-[#4c669a] dark:text-[#94a3b8] text-xs font-bold uppercase">
            {yesConfidence}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#ef4444] font-black text-3xl">
            {noPercentage.toFixed(0)}% NO
          </span>
          <span className="text-[#4c669a] dark:text-[#94a3b8] text-xs font-bold uppercase">
            {noConfidence}
          </span>
        </div>
      </div>
      <div className="relative h-6 w-full rounded-full bg-[#cfd7e7] dark:bg-[#2d3748] overflow-hidden flex">
        <div
          className="h-full bg-[#22c55e] transition-all"
          style={{ width: `${yesPercentage}%` }}
        />
        <div
          className="h-full bg-[#ef4444] transition-all"
          style={{ width: `${noPercentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-8 bg-white dark:bg-[#101622] shadow-sm"></div>
        </div>
      </div>
      <div className="flex justify-between mt-3 text-[#4c669a] dark:text-[#94a3b8] text-xs font-semibold">
        <span>{yesVotes.toLocaleString()} VOTES YES</span>
        <span>{noVotes.toLocaleString()} VOTES NO</span>
      </div>
    </div>
  );
}
