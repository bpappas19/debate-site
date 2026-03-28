/**
 * Debate detail page: uses merged data (mock + user-created) from DebatesContext.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DebateDetailContent from "@/components/DebateDetailContent";
import { getDebateForPage, resolveDebatePageParams } from "@/lib/getDebateForPage";

function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://debateit.com";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryType: string; entitySlug: string }>;
}): Promise<Metadata> {
  const { categoryType, entitySlug } = await resolveDebatePageParams(params);
  const { data: debate } = await getDebateForPage(categoryType, entitySlug);
  if (!debate) notFound();

  const title = debate.debateQuestion || debate.entityName;
  const description = `Bull vs Bear debate on ${title}`;
  const base = getSiteUrl();
  const ogImageUrl = `${base}/debate/${debate.categoryType}/${debate.symbolOrSlug}/opengraph-image`;

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
  const { categoryType, entitySlug } = await resolveDebatePageParams(params);
  const { data: debate } = await getDebateForPage(categoryType, entitySlug);
  if (!debate) notFound();
  const debateUrlAbsolute = `${getSiteUrl()}/debate/${debate.categoryType}/${debate.symbolOrSlug}`;
  return <DebateDetailContent debateUrlAbsolute={debateUrlAbsolute} />;
}
