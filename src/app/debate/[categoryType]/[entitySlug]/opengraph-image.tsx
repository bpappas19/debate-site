import { ImageResponse } from "next/og";
import { fetchArgumentsForDebate } from "@/lib/debatesDataLayer";
import { getDebateForPage, resolveDebatePageParams } from "@/lib/getDebateForPage";
import { createClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export const alt = "Debate preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function clip(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (!t) return "—";
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function debugLabel(s: string): string {
  const t = (s ?? "").replace(/\s+/g, " ").trim();
  return t || "(empty)";
}

export default async function Image({
  params,
}: {
  params: Promise<{ categoryType: string; entitySlug: string }>;
}) {
  const { categoryType, entitySlug } = await resolveDebatePageParams(params);
  const debateResult = await getDebateForPage(categoryType, entitySlug);
  const debate = debateResult.data;

  if (!debate) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 48,
            background: "#0f172a",
            color: "#e2e8f0",
            fontFamily: "ui-monospace, Menlo, Monaco, Consolas, monospace",
            fontSize: 28,
            lineHeight: 1.45,
            gap: 12,
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 800, color: "#fbbf24", marginBottom: 8 }}>
            OG image — debug (debate not found)
          </div>
          <div>
            <span style={{ color: "#94a3b8" }}>categoryType: </span>
            {debugLabel(categoryType)}
          </div>
          <div>
            <span style={{ color: "#94a3b8" }}>entitySlug: </span>
            {debugLabel(entitySlug)}
          </div>
          <div>
            <span style={{ color: "#94a3b8" }}>getDebateForPage returned a debate: </span>
            no
          </div>
          {debateResult.error ? (
            <div style={{ color: "#f87171", marginTop: 8 }}>
              <span style={{ color: "#94a3b8" }}>fetchDebateBySlug error: </span>
              {clip(debateResult.error, 200)}
            </div>
          ) : null}
          <div style={{ marginTop: 16, color: "#64748b", fontSize: 24 }}>
            id (if found): —
          </div>
          <div style={{ color: "#64748b", fontSize: 24 }}>title (if found): —</div>
        </div>
      ),
      { ...size }
    );
  }

  const supabase = await createClient();

  const { data: args } = await fetchArgumentsForDebate(supabase, debate.id);

  const proCount = args.filter((a) => a.side === "PRO").length;
  const conCount = args.filter((a) => a.side === "CON").length;
  const total = proCount + conCount;
  const bullPct = total > 0 ? Math.round((proCount / total) * 100) : 0;
  const bearPct = total > 0 ? Math.round((conCount / total) * 100) : 0;

  const topLevel = args.filter((a) => !a.parentId);
  const byUpvotes = (a: (typeof args)[0], b: (typeof args)[0]) =>
    b.upvotes - a.upvotes || b.createdAt.getTime() - a.createdAt.getTime();
  const topBull = [...topLevel].filter((a) => a.side === "PRO").sort(byUpvotes)[0];
  const topBear = [...topLevel].filter((a) => a.side === "CON").sort(byUpvotes)[0];

  const bullLabel = debate.categoryType === "stocks" ? "Bull" : "Pro";
  const bearLabel = debate.categoryType === "stocks" ? "Bear" : "Con";
  const title = clip(debate.debateQuestion || debate.entityName, 140);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 48,
          background: "linear-gradient(145deg, #0d121b 0%, #1a2332 50%, #101622 100%)",
          color: "#f1f5f9",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: "#135bec",
            }}
          >
            DEBATEIT
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15, color: "#ffffff" }}>
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 12 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: "#4ade80" }}>
              {bullLabel} {bullPct}%
            </span>
            <span style={{ fontSize: 28, color: "#64748b" }}>vs</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: "#f87171" }}>
              {bearLabel} {bearPct}%
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#4ade80" }}>{bullLabel}</span>
            <span style={{ fontSize: 22, color: "#cbd5e1", lineHeight: 1.35 }}>
              {clip(topBull?.content ?? "No arguments yet.", 160)}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#f87171" }}>{bearLabel}</span>
            <span style={{ fontSize: 22, color: "#cbd5e1", lineHeight: 1.35 }}>
              {clip(topBear?.content ?? "No arguments yet.", 160)}
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#94a3b8",
            borderTop: "1px solid #334155",
            paddingTop: 20,
            marginTop: 8,
          }}
        >
          DEBATEIT
        </div>
      </div>
    ),
    { ...size }
  );
}
