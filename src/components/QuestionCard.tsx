import Link from "next/link";
import { Question } from "@/lib/types";
import Tag from "./Tag";
import SentimentBar from "./SentimentBar";

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Link href={`/q/${question.slug}`}>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-gray-300 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {question.title}
            </h2>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {question.description}
              </p>
            )}
          </div>
          {question.resolved && (
            <span
              className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${
                question.resolvedSide === "YES"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              RESOLVED
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Tag category={question.category} />
          <span className="text-sm text-gray-500">
            {question.totalVotes.toLocaleString()} votes
          </span>
        </div>
        <SentimentBar
          yesVotes={question.yesVotes}
          noVotes={question.noVotes}
          totalVotes={question.totalVotes}
        />
      </div>
    </Link>
  );
}
