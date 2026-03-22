"use client";

import { useEffect, useState } from "react";
import { formatRelativeTimeShort } from "@/lib/formatRelativeTime";

interface RelativeTimeProps {
  date: Date;
  className?: string;
}

/**
 * Relative time label; client-only updates to avoid SSR/client clock hydration mismatches.
 */
export default function RelativeTime({ date, className = "" }: RelativeTimeProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    const tick = () => setText(formatRelativeTimeShort(date, new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [date.getTime()]);

  return (
    <time
      dateTime={date.toISOString()}
      className={`tabular-nums shrink-0 ${className}`}
      suppressHydrationWarning
    >
      {text || "\u00a0"}
    </time>
  );
}
