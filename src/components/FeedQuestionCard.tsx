import Link from "next/link";
import { Question } from "@/lib/types";

interface FeedQuestionCardProps {
  question: Question;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Technology: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
  },
  Economics: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  Science: {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
  },
  Philosophy: {
    bg: "bg-purple-50 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
  },
  Society: {
    bg: "bg-sky-50 dark:bg-sky-900/30",
    text: "text-sky-600 dark:text-sky-400",
  },
  Politics: {
    bg: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
  },
};

export default function FeedQuestionCard({
  question,
}: FeedQuestionCardProps) {
  const yesPercentage =
    question.totalVotes > 0
      ? (question.yesVotes / question.totalVotes) * 100
      : 0;
  const noPercentage =
    question.totalVotes > 0 ? (question.noVotes / question.totalVotes) * 100 : 0;

  const categoryColor = categoryColors[question.category] || {
    bg: "bg-gray-50 dark:bg-gray-900/30",
    text: "text-gray-600 dark:text-gray-400",
  };

  return (
    <Link href={`/q/${question.slug}`} className="h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all flex flex-col group cursor-pointer h-full w-full">
        <div className="flex items-start justify-between mb-4">
          <span
            className={`px-2.5 py-1 ${categoryColor.bg} ${categoryColor.text} text-[10px] font-bold uppercase tracking-wider rounded`}
          >
            {question.category}
          </span>
        </div>

        {/* Debate topic image */}
        {question.image ? (
          <div 
            className="w-full aspect-video rounded-lg mb-4 bg-cover bg-center shrink-0"
            style={{ backgroundImage: `url(${question.image})` }}
          />
        ) : (
          <div className="w-full aspect-video rounded-lg mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-4xl text-gray-400">
              question_mark
            </span>
          </div>
        )}

        <h3 className="text-lg font-bold leading-tight mb-3 group-hover:text-[#135bec] transition-colors line-clamp-2">
          {question.title}
        </h3>

        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-green-600">{yesPercentage.toFixed(0)}% YES</span>
              <span className="text-red-600">{noPercentage.toFixed(0)}% NO</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex">
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${yesPercentage}%` }}
              />
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${noPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-300 flex items-center justify-center text-xs">
                👤
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-400 flex items-center justify-center text-xs">
                👤
              </div>
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-[8px] font-bold">
                +{Math.floor(question.totalVotes / 100)}k
              </div>
            </div>
            <button
              className="bg-[#135bec] hover:bg-[#135bec]/90 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
            >
              View Debate
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
