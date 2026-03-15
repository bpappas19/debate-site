/**
 * Generic argument list: groups arguments by side (PRO/CON/HOLD), shows top-level with nested replies.
 * Top-level = full ArgumentCard. Replies = compact ReplyItem in a lightweight thread (no card, no heavy box).
 */
import { useState, useMemo } from "react";
import type { Argument } from "@/lib/types";
import ArgumentCard from "./ArgumentCard";
import ReplyItem from "./ReplyItem";

interface ArgumentListProps {
  arguments_: Argument[];
  sideLabels?: { PRO: string; CON: string; HOLD: string };
  emptyMessage?: { PRO: string; CON: string; HOLD: string };
  currentUserId?: string | null;
  debateId?: string;
  /** Argument IDs the current user has liked (for thumb state). */
  votedArgumentIds?: string[];
  onEditArgument?: (argumentId: string, newContent: string) => void | Promise<void>;
  onDeleteArgument?: (argumentId: string) => void | Promise<void>;
  onToggleVote?: (argumentId: string) => void | Promise<void>;
  /** Post a reply to a comment. */
  onReply?: (parentArgument: Argument, content: string) => void | Promise<void>;
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
  currentUserId = null,
  debateId,
  votedArgumentIds = [],
  onEditArgument,
  onDeleteArgument,
  onToggleVote,
  onReply,
}: ArgumentListProps) {
  const topLevel = arguments_.filter((a) => !a.parentId);
  const repliesByParentId = useMemo(
    () =>
      arguments_.reduce<Record<string, Argument[]>>((acc, a) => {
        if (a.parentId) {
          if (!acc[a.parentId]) acc[a.parentId] = [];
          acc[a.parentId].push(a);
        }
        return acc;
      }, {}),
    [arguments_]
  );

  const proArgs = topLevel.filter((a) => a.side === "PRO");
  const conArgs = topLevel.filter((a) => a.side === "CON");
  const holdArgs = topLevel.filter((a) => a.side === "HOLD");

  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const toggleReplies = (parentId: string) => {
    setExpandedReplies((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  const renderTopLevelBlock = (arg: Argument) => {
    const replies = repliesByParentId[arg.id] ?? [];
    const isExpanded = expandedReplies[arg.id] ?? replies.length === 1;
    const isReplyFormOpen = openReplyId === arg.id;

    return (
      <div key={arg.id} className="space-y-0">
        <ArgumentCard
          argument={arg}
          sideLabels={sideLabels}
          isAuthor={!!(currentUserId && arg.author.id && currentUserId === arg.author.id)}
          onEdit={
            debateId && onEditArgument
              ? (content) => onEditArgument(arg.id, content)
              : undefined
          }
          onDelete={
            debateId && onDeleteArgument ? () => onDeleteArgument(arg.id) : undefined
          }
          userHasUpvoted={votedArgumentIds.includes(arg.id)}
          onToggleVote={debateId && onToggleVote ? () => onToggleVote(arg.id) : undefined}
          replyCount={replies.length}
        />

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mt-2">
          {debateId && onReply && currentUserId && (
            <>
              <button
                type="button"
                onClick={() => setOpenReplyId(isReplyFormOpen ? null : arg.id)}
                className="font-medium text-[#135bec] hover:underline"
              >
                Reply
              </button>
              {replies.length > 0 && <span className="text-slate-400 dark:text-slate-500">·</span>}
            </>
          )}
          {replies.length > 0 && (
            <button
              type="button"
              onClick={() => toggleReplies(arg.id)}
              className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#135bec] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isExpanded ? "expand_less" : "expand_more"}
              </span>
              {isExpanded ? "Hide replies" : `View ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
            </button>
          )}
        </div>

        {replies.length > 0 && isExpanded && (
          <div className="mt-3 ml-8 pl-6 border-l border-slate-200 dark:border-slate-600/80 space-y-4">
            {replies.map((r) => (
              <ReplyItem
                key={r.id}
                argument={r}
                replyToUsername={arg.author.username}
                sideLabels={sideLabels}
                isAuthor={!!(currentUserId && r.author.id && currentUserId === r.author.id)}
                userHasUpvoted={votedArgumentIds.includes(r.id)}
                onEdit={
                  debateId && onEditArgument
                    ? (content) => onEditArgument(r.id, content)
                    : undefined
                }
                onDelete={debateId && onDeleteArgument ? () => onDeleteArgument(r.id) : undefined}
                onToggleVote={debateId && onToggleVote ? () => onToggleVote(r.id) : undefined}
              />
            ))}
          </div>
        )}

        {debateId && onReply && currentUserId && isReplyFormOpen && (
          <div className="mt-3 py-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full min-h-[72px] py-2 px-3 rounded-md border-0 bg-slate-100/80 dark:bg-slate-800/40 text-sm text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-1 focus:ring-[#135bec] resize-y"
              disabled={submittingReply}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={async () => {
                  if (!replyContent.trim() || submittingReply) return;
                  setSubmittingReply(true);
                  try {
                    await onReply(arg, replyContent.trim());
                    setReplyContent("");
                    setOpenReplyId(null);
                  } finally {
                    setSubmittingReply(false);
                  }
                }}
                disabled={!replyContent.trim() || submittingReply}
                className="px-3 py-1.5 rounded-md bg-[#135bec] text-white text-sm font-medium hover:bg-[#135bec]/90 disabled:opacity-50"
              >
                {submittingReply ? "Posting…" : "Post Reply"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenReplyId(null);
                  setReplyContent("");
                }}
                disabled={submittingReply}
                className="px-3 py-1.5 rounded-md text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

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
          args.map((arg) => renderTopLevelBlock(arg))
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
