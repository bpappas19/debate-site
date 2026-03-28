/**
 * Debate detail page: uses merged data (mock + user-created) from DebatesContext.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DebateDetailContent from "@/components/DebateDetailContent";
import { getDebateForPage, resolveDebatePageParams } from "@/lib/getDebateForPage";
import { getSiteUrl } from "@/lib/siteUrl";

/** Same chain as opengraph-image.tsx: resolveDebatePageParams → getDebateForPage (full result). */
async function loadDebateForRoute(
  params: Promise<{ categoryType?: string; entitySlug?: string }>
) {
  const { categoryType, entitySlug } = await resolveDebatePageParams(params);
  const debateResult = await getDebateForPage(categoryType, entitySlug);
  return { categoryType, entitySlug, debateResult };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryType: string; entitySlug: string }>;
}): Promise<Metadata> {
  const { debateResult } = await loadDebateForRoute(params);
  const debate = debateResult.data;
  if (!debate) {
    return {
      title: "Debate | DebateIt",
      description: "Read viewpoints and join the debate on DebateIt.",
    };
  }

  const title = debate.debateQuestion || debate.entityName;
  const description = `Bull vs Bear debate on ${title}`;
  const base = getSiteUrl();
  const ogPath = `/debate/${debate.categoryType}/${debate.symbolOrSlug}/opengraph-image`;
  const ogImageUrl = base ? `${base}${ogPath}` : ogPath;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function DebateDetailPage({
  params,
}: {
  params: Promise<{ categoryType: string; entitySlug: string }>;
}) {
  const rawParams = await params;
  const { categoryType, entitySlug, debateResult } = await loadDebateForRoute(params);
  const debate = debateResult.data;

  console.log(
    "[debate/page]",
    JSON.stringify({
      rawParams,
      categoryType,
      entitySlug,
      getDebateForPageReturnedDebate: !!debate,
      debateId: debate?.id ?? null,
      debateTitle: debate ? debate.debateQuestion || debate.entityName : null,
      fetchDebateBySlugError: debateResult.error,
    })
  );

  if (!debate) notFound();
  const base = getSiteUrl();
  const debatePath = `/debate/${debate.categoryType}/${debate.symbolOrSlug}`;
  const debateUrlAbsolute = base ? `${base}${debatePath}` : debatePath;
  return (
    <DebateDetailContent debateUrlAbsolute={debateUrlAbsolute} initialDebate={debate} />
  );
}
