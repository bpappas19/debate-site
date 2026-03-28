"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ShareDebateProps = {
  debateTitle: string;
  debateUrl: string;
};

function toAbsoluteDebateUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (typeof window !== "undefined" && url.startsWith("/")) {
    return `${window.location.origin}${url}`;
  }
  return url;
}

export default function ShareDebate({ debateTitle, debateUrl }: ShareDebateProps) {
  const [copied, setCopied] = useState(false);
  const [resolvedDebateUrl, setResolvedDebateUrl] = useState(debateUrl);

  useEffect(() => {
    setResolvedDebateUrl(toAbsoluteDebateUrl(debateUrl));
  }, [debateUrl]);

  const tweetHref = useMemo(() => {
    const text = `Debate: ${debateTitle}\n\nBull vs Bear arguments:\n${resolvedDebateUrl}`;
    const u = new URL("https://twitter.com/intent/tweet");
    u.searchParams.set("text", text);
    return u.toString();
  }, [debateTitle, resolvedDebateUrl]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(resolvedDebateUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [resolvedDebateUrl]);

  return (
    <div className="flex flex-row flex-wrap items-center gap-2 mt-4">
      <a
        href={tweetHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#0d121b] dark:bg-slate-900 text-white text-sm font-bold hover:opacity-90 transition-opacity border border-[#cfd7e7]/20"
      >
        Share on X
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#cfd7e7] dark:border-slate-600 text-[#0d121b] dark:text-white text-sm font-bold hover:bg-[#f8f9fc] dark:hover:bg-slate-800 transition-colors"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
