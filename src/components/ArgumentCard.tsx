import { Argument } from "@/lib/types";
import Link from "next/link";

interface ArgumentCardProps {
  argument: Argument;
}

export default function ArgumentCard({ argument }: ArgumentCardProps) {
  const sideColor =
    argument.side === "YES"
      ? "border-[#22c55e]"
      : "border-[#ef4444]";
  const sideTextColor =
    argument.side === "YES"
      ? "text-[#22c55e]"
      : "text-[#ef4444]";
  const sideHoverColor =
    argument.side === "YES"
      ? "hover:bg-[#22c55e]/10"
      : "hover:bg-[#ef4444]/10";

  const timeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div
      className={`bg-white dark:bg-[#1a2133] rounded-xl p-5 border-l-4 ${sideColor} shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="size-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-lg bg-cover bg-center"
          style={
            argument.author.avatar && argument.author.avatar.startsWith("http")
              ? { backgroundImage: `url(${argument.author.avatar})` }
              : undefined
          }
        >
          {argument.author.avatar && !argument.author.avatar.startsWith("http") && (
            argument.author.avatar
          )}
          {!argument.author.avatar && "👤"}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#0d121b] dark:text-white">
              {argument.author.username}
            </span>
            {argument.upvotes > 200 && (
              <span className="bg-[#135bec]/10 text-[#135bec] text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                Top Contributor
              </span>
            )}
          </div>
          <span className="text-[#4c669a] dark:text-[#94a3b8] text-xs">
            {timeAgo(argument.createdAt)} • {argument.upvotes} votes
          </span>
        </div>
      </div>
      <p className="text-sm leading-relaxed mb-4 text-[#0d121b] dark:text-[#f8f9fc]">
        {argument.content}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-[#e7ebf3] dark:border-[#2d3748]">
        <div className="flex items-center gap-4">
          <button
            className={`flex items-center gap-1.5 ${sideTextColor} ${sideHoverColor} px-2 py-1 rounded transition-colors`}
          >
            <span className="material-symbols-outlined">
              {argument.side === "YES" ? "thumb_up" : "thumb_down"}
            </span>
            <span className="text-sm font-bold">{argument.upvotes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-[#4c669a] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="text-sm font-bold">0</span>
          </button>
        </div>
        <button className="text-[#4c669a] dark:text-[#94a3b8] hover:text-[#0d121b] dark:hover:text-white">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
    </div>
  );
}
