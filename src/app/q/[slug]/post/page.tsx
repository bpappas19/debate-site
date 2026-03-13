"use client";

/**
 * Legacy route: /q/[slug]/post redirects to /debate/stocks/[slug]/post for stock slugs.
 */
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { mockStockDebates } from "@/lib/mock";

export default function LegacyPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) ?? "";

  useEffect(() => {
    const match = mockStockDebates.some(
      (d) => d.symbolOrSlug.toLowerCase() === slug.toLowerCase()
    );
    if (match) {
      router.replace(`/debate/stocks/${slug.toLowerCase()}/post`);
    }
  }, [slug, router]);

  const isStock = mockStockDebates.some(
    (d) => d.symbolOrSlug.toLowerCase() === slug.toLowerCase()
  );
  if (isStock) {
    return (
      <div className="fixed inset-0 top-[57px] z-40 bg-[#0d121b]/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1a2133] rounded-2xl p-8 text-center">
          <p className="text-[#4c669a] dark:text-[#94a3b8]">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-[57px] z-40 bg-[#0d121b]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a2133] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#0d121b] dark:text-white">
          Debate Not Found
        </h2>
        <Link href="/" className="text-[#135bec] hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
