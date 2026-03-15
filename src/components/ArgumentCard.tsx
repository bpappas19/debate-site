"use client";

/**
 * Generic argument card. Accepts PRO/CON/HOLD and optional display labels
 * (e.g. Bull/Bear/Hold for stocks, For/Against for other categories).
 * When isAuthor, shows Edit and Delete actions.
 */
import { useState } from "react";
import type { Argument } from "@/lib/types";

interface ArgumentCardProps {
  argument: Argument;
  /** Optional side labels, e.g. { PRO: "Bull", CON: "Bear", HOLD: "Hold" } */
  sideLabels?: { PRO: string; CON: string; HOLD: string };
  /** When true, show Edit and Delete buttons (author only). */
  isAuthor?: boolean;
  onEdit?: (newContent: string) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  /** Whether the current user has liked this comment. */
  userHasUpvoted?: boolean;
  /** Toggle like (vote/unvote). Called when user clicks the like button. */
  onToggleVote?: () => void | Promise<void>;
  /** Number of replies (for display). */
  replyCount?: number;
  /** When "nested", use compact styling for reply cards (smaller padding, subdued bg, smaller badge). */
  variant?: "default" | "nested";
  /** When nested, show "Replying to {username}" above the author. */
  replyToUsername?: string;
}

const defaultSideLabels = { PRO: "Pro", CON: "Con", HOLD: "Hold" };

export default function ArgumentCard({
  argument,
  sideLabels = defaultSideLabels,
  isAuthor = false,
  onEdit,
  onDelete,
  userHasUpvoted = false,
  onToggleVote,
  replyCount = 0,
  variant = "default",
  replyToUsername,
}: ArgumentCardProps) {
  const isNested = variant === "nested";
  const [isEditing, setIsEditing] = useState(false);
  const [voting, setVoting] = useState(false);
  const [editContent, setEditContent] = useState(argument.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const label = sideLabels[argument.side];
  const isPro = argument.side === "PRO";
  const isCon = argument.side === "CON";
  const isHold = argument.side === "HOLD";

  const sideColor = isPro
    ? "border-[#22c55e]"
    : isCon
      ? "border-[#ef4444]"
      : "border-amber-500";
  const sideTextColor = isPro
    ? "text-[#22c55e]"
    : isCon
      ? "text-[#ef4444]"
      : "text-amber-600 dark:text-amber-400";
  const sideHoverColor = isPro
    ? "hover:bg-[#22c55e]/10"
    : isCon
      ? "hover:bg-[#ef4444]/10"
      : "hover:bg-amber-500/10";

  const timeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days !== 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  };

  const handleSaveEdit = async () => {
    if (editContent.trim() === argument.content || !onEdit) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onEdit(editContent.trim());
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(argument.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDelete || !confirm("Delete this comment? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await onDelete();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not delete comment.";
      alert(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`group/card rounded-xl border-l-4 ${sideColor} transition-shadow ${
        isNested
          ? "bg-gray-50/80 dark:bg-[#0f1620] border border-gray-100 dark:border-gray-800/80 p-3 shadow-none hover:shadow-sm"
          : "bg-white dark:bg-[#1a2133] p-5 shadow-sm hover:shadow-md"
      }`}
    >
      <div className={`flex items-center gap-3 ${isNested ? "mb-2" : "mb-4"}`}>
        <div className="min-w-0 flex-1">
          {isNested && replyToUsername && (
            <p className="text-[10px] text-[#4c669a] dark:text-[#94a3b8] mb-0.5">
              Replying to <span className="font-medium text-[#0d121b] dark:text-gray-300">{replyToUsername}</span>
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-[#0d121b] dark:text-white ${isNested ? "text-xs" : "text-sm"}`}>
              {argument.author.username}
            </span>
            {argument.isAnonymous && (
              <span className="text-[9px] font-medium px-1 py-0.5 rounded bg-gray-200/80 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400">
                Anonymous
              </span>
            )}
            <span
              className={`rounded uppercase ${
                isPro
                  ? "bg-[#22c55e]/10 text-[#22c55e]"
                  : isCon
                    ? "bg-[#ef4444]/10 text-[#ef4444]"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              } ${isNested ? "text-[9px] font-bold px-1 py-0.5" : "text-[10px] font-black px-1.5 py-0.5"}`}
            >
              {label}
            </span>
            {!isNested && argument.upvotes > 200 && (
              <span className="bg-[#135bec]/10 text-[#135bec] text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                Top Contributor
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 w-full">
            <span className={`text-[#4c669a] dark:text-[#94a3b8] ${isNested ? "text-[10px]" : "text-xs"}`}>
              {timeAgo(argument.createdAt)} • {argument.upvotes} votes
            </span>
            {isAuthor && !isEditing && (
              <div className="flex items-center gap-0.5 shrink-0 opacity-50 group-hover/card:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                  className="p-1 rounded text-[#4c669a]/70 dark:text-[#94a3b8]/70 hover:text-[#135bec] hover:bg-[#135bec]/5 dark:hover:bg-[#135bec]/10 transition-colors"
                  title="Edit"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); handleDelete(); }}
                  disabled={deleting}
                  className="p-1 rounded text-[#4c669a]/70 dark:text-[#94a3b8]/70 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isEditing ? (
        <div className="mb-4 space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[100px] p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#101622] text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-[#135bec] resize-y"
            disabled={saving}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={saving || editContent.trim() === argument.content || editContent.trim().length === 0}
              className="px-4 py-2 rounded-lg bg-[#135bec] text-white text-sm font-bold hover:bg-[#135bec]/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className={`leading-relaxed text-[#0d121b] dark:text-[#f8f9fc] ${isNested ? "text-xs mb-2" : "text-sm mb-4"}`}>
          {argument.content}
        </p>
      )}
      <div className={`flex items-center justify-between border-t border-[#e7ebf3] dark:border-[#2d3748] ${isNested ? "pt-2" : "pt-4"}`}>
        <div className={`flex items-center gap-4 ${isNested ? "gap-2" : ""}`}>
          <button
            type="button"
            onClick={async () => {
              if (onToggleVote && !voting) {
                setVoting(true);
                try {
                  await onToggleVote();
                } finally {
                  setVoting(false);
                }
              }
            }}
            disabled={!onToggleVote || voting}
            className={`flex items-center gap-1.5 ${sideTextColor} ${sideHoverColor} px-2 py-1 rounded transition-colors disabled:opacity-60 ${userHasUpvoted ? "opacity-100" : ""}`}
            title={userHasUpvoted ? "Unlike" : "Like"}
          >
            <span className={`material-symbols-outlined ${userHasUpvoted ? "fill" : ""}`}>
              {isPro || isCon ? "thumb_up" : "remove"}
            </span>
            <span className={isNested ? "text-xs font-bold" : "text-sm font-bold"}>{argument.upvotes}</span>
          </button>
          {!isNested && (
            <span className="flex items-center gap-1.5 text-[#4c669a] dark:text-[#94a3b8] text-sm font-bold">
              <span className="material-symbols-outlined text-lg">chat_bubble</span>
              {replyCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
