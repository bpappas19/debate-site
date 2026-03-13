/**
 * Legacy route: /q/[slug] redirects to /debate/stocks/[slug] when slug matches a stock.
 * Keeps old links working. Remove when no longer needed.
 */
import { redirect, notFound } from "next/navigation";
import { mockStockDebates } from "@/lib/mock";

export default async function LegacyDebatePage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolved = params instanceof Promise ? await params : params;
  const slug = resolved.slug.toLowerCase();

  const match = mockStockDebates.some(
    (d) => d.symbolOrSlug.toLowerCase() === slug
  );
  if (match) {
    redirect(`/debate/stocks/${slug}`);
  }
  notFound();
}
