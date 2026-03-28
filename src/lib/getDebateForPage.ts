import { cache } from "react";
import { headers } from "next/headers";
import { fetchDebateBySlug } from "@/lib/debatesDataLayer";
import { createClient } from "@/lib/supabaseServer";

/**
 * Single server-side debate lookup for debate routes (page shell, metadata, OG image).
 * Uses the same Supabase client and fetchDebateBySlug path everywhere.
 */
export const getDebateForPage = cache(async (categoryType: string, entitySlug: string) => {
  const supabase = await createClient();
  return fetchDebateBySlug(supabase, categoryType, entitySlug);
});

/** Matches /debate/:category/:slug and /debate/:category/:slug/opengraph-image */
export function parseDebatePathSegments(pathname: string): {
  categoryType: string;
  entitySlug: string;
} | null {
  const path = (pathname.split("?")[0] ?? "").replace(/\/$/, "") || "";
  const m = path.match(/^\/debate\/([^/]+)\/([^/]+)(?:\/opengraph-image)?$/);
  if (!m) return null;
  try {
    return {
      categoryType: decodeURIComponent(m[1]),
      entitySlug: decodeURIComponent(m[2]),
    };
  } catch {
    return { categoryType: m[1], entitySlug: m[2] };
  }
}

function decodeParam(s: string): string {
  const t = s.trim();
  if (!t) return "";
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}

/**
 * Resolves categoryType + entitySlug for debate routes. Next may pass params as a Promise;
 * opengraph-image metadata requests sometimes omit segments unless read from the request URL.
 * Page and OG must use this same helper before calling getDebateForPage.
 */
export async function resolveDebatePageParams(
  params: Promise<{ categoryType?: string; entitySlug?: string }>
): Promise<{ categoryType: string; entitySlug: string }> {
  const raw = await params;
  let categoryType = decodeParam(raw?.categoryType ?? "");
  let entitySlug = decodeParam(raw?.entitySlug ?? "");

  if (categoryType && entitySlug) {
    return { categoryType, entitySlug };
  }

  const h = await headers();
  const headerPaths = [
    h.get("x-pathname"),
    h.get("x-invoke-path"),
    h.get("next-url"),
    h.get("x-url"),
  ];
  for (const value of headerPaths) {
    if (!value) continue;
    let pathname = value;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      try {
        pathname = new URL(value).pathname;
      } catch {
        continue;
      }
    }
    const parsed = parseDebatePathSegments(pathname);
    if (parsed) {
      return {
        categoryType: categoryType || parsed.categoryType,
        entitySlug: entitySlug || parsed.entitySlug,
      };
    }
  }

  const referer = h.get("referer");
  if (referer) {
    try {
      const parsed = parseDebatePathSegments(new URL(referer).pathname);
      if (parsed) {
        return {
          categoryType: categoryType || parsed.categoryType,
          entitySlug: entitySlug || parsed.entitySlug,
        };
      }
    } catch {
      /* ignore */
    }
  }

  return { categoryType, entitySlug };
}
