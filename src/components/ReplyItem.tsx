"use client";

/**
 * Compact reply item for nested thread. No card, no border box — lightweight and secondary to parent.
 */
import { useState } from "react";
import type { Argument } from "@/lib/types";

interface ReplyItemProps {
  argument: Argument;
  replyToUsername: string;
  sideLabels?: { PRO: string; CON: string; HOLD: string };
  isAuthor?: boolean;
  userHasUpvoted?: boolean;
  onEdit?: (newContent: string) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onToggleVote?: () => void | Promise<void>;
}

const defaultSideLabels = { PRO: "Pro", CON: "Con", HOLD: "Hold" };

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}m`;
}

export default function ReplyItem({
  argument,
  replyToUsername,
  sideLabels = defaultSideLabels,
  isAuthor = false,
  userHasUpvoted = false,
  onEdit,
  onDelete,
  onToggleVote,
}: ReplyItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(argument.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [voting, setVoting] = useState(false);
  const label = sideLabels[argument.side];
  const isPro = argument.side === "PRO";
  const isCon = argument.side === "CON";

  const sidePillClass = isPro
    ? "bg-emerald-500/10 text-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-400"
    : isCon
      ? "bg-red-500/10 text-red-400 dark:bg-red-500/10 dark:text-red-400"
      : "bg-amber-500/10 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400";

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

  return (
    <div className="py-2 pl-2">
      <p className="text-[11px] text-slate-500 dark:text-slate-500 mb-1">
        Replying to <span className="text-slate-400 dark:text-slate-400">{replyToUsername}</span>
      </p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm font-semibold text-[#0d121b] dark:text-white truncate">
            {argument.author.username}
          </span>
          {argument.isAnonymous && (
            <span className="text-[9px] text-slate-500 dark:text-slate-500 shrink-0">Anonymous</span>
          )}
          <span
            className={`text-[10px] px-2 py-0.5 rounded-md shrink-0 ${sidePillClass}`}
          >
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {timeAgo(argument.createdAt)}
          </span>
          {isAuthor && onEdit && onDelete && !isEditing && (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 rounded text-slate-400 hover:text-[#135bec] hover:bg-[#135bec]/5 text-[18px] leading-none"
                title="Edit"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!onDelete || !confirm("Delete this reply?")) return;
                  setDeleting(true);
                  try {
                    await onDelete();
                  } catch (err) {
                    const message = err instanceof Error ? err.message : "Could not delete reply.";
                    alert(message);
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
                className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/5 text-[18px] leading-none disabled:opacity-50"
                title="Delete"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="mt-2 space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[60px] py-2 px-3 rounded-md border border-slate-600 dark:border-slate-600 bg-transparent dark:bg-slate-800/30 text-sm text-[#0d121b] dark:text-slate-200 focus:ring-1 focus:ring-[#135bec] resize-y"
            disabled={saving}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={saving || editContent.trim() === argument.content}
              className="px-3 py-1.5 rounded-md bg-[#135bec] text-white text-xs font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => { setEditContent(argument.content); setIsEditing(false); }}
              disabled={saving}
              className="px-3 py-1.5 rounded-md border border-slate-600 text-xs text-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-6">
          {argument.content}
        </p>
      )}
      {!isEditing && (
        <div className="mt-2 flex items-center gap-4 text-slate-400 dark:text-slate-500 text-sm">
          {onToggleVote && (
            <button
              type="button"
              onClick={async () => {
                if (voting) return;
                setVoting(true);
                try {
                  await onToggleVote();
                } finally {
                  setVoting(false);
                }
              }}
              disabled={voting}
              className="flex items-center gap-1 hover:text-[#135bec] disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[18px] ${userHasUpvoted ? "fill" : ""}`}>
                thumb_up
              </span>
              <span className="text-xs font-medium">{argument.upvotes}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
