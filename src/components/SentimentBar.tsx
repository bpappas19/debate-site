/**
 * Generic sentiment/vote bar. Accepts pro/con counts and optional labels.
 * Stocks use proLabel="Bull" / conLabel="Bear"; other categories can use "For"/"Against", "Yes"/"No", etc.
 */
interface SentimentBarProps {
  proVotes: number;
  conVotes: number;
  totalVotes: number;
  proLabel?: string;
  conLabel?: string;
}

export default function SentimentBar({
  proVotes,
  conVotes,
  totalVotes,
  proLabel = "Pro",
  conLabel = "Con",
}: SentimentBarProps) {
  const proPercentage = totalVotes > 0 ? (proVotes / totalVotes) * 100 : 0;
  const conPercentage = totalVotes > 0 ? (conVotes / totalVotes) * 100 : 0;

  const proConfidence =
    proPercentage >= 60
      ? "Confidence High"
      : proPercentage >= 40
        ? "Moderate Support"
        : "Low Confidence";
  const conConfidence =
    conPercentage >= 60
      ? "Skeptics Rising"
      : conPercentage >= 40
        ? "Moderate Skepticism"
        : "Low Skepticism";

  return (
    <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm">
      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col">
          <span className="text-[#22c55e] font-black text-3xl">
            {proPercentage.toFixed(0)}% {proLabel}
          </span>
          <span className="text-[#4c669a] dark:text-[#94a3b8] text-xs font-bold uppercase">
            {proConfidence}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#ef4444] font-black text-3xl">
            {conPercentage.toFixed(0)}% {conLabel}
          </span>
          <span className="text-[#4c669a] dark:text-[#94a3b8] text-xs font-bold uppercase">
            {conConfidence}
          </span>
        </div>
      </div>
      <div className="relative h-6 w-full rounded-full bg-[#cfd7e7] dark:bg-[#2d3748] overflow-hidden flex">
        <div
          className="h-full bg-[#22c55e] transition-all"
          style={{ width: `${proPercentage}%` }}
        />
        <div
          className="h-full bg-[#ef4444] transition-all"
          style={{ width: `${conPercentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-8 bg-white dark:bg-[#101622] shadow-sm" />
        </div>
      </div>
      <div className="flex justify-between mt-3 text-[#4c669a] dark:text-[#94a3b8] text-xs font-semibold">
        <span>
          {proVotes.toLocaleString()} VOTES {proLabel.toUpperCase()}
        </span>
        <span>
          {conVotes.toLocaleString()} VOTES {conLabel.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
