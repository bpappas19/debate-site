"use client";

/**
 * Category page: list debates for a category (mock + user-created).
 */
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCategoryByType } from "@/lib/categories";
import { useDebates } from "@/contexts/DebatesContext";
import DebateCard from "@/components/DebateCard";
import StockMetaBar from "@/components/StockMetaBar";
import type { Debate } from "@/lib/types";
import type { StockMetadata } from "@/lib/types";

export default function CategoryPage() {
  const params = useParams();
  const categoryType = (params?.categoryType as string) ?? "";
  const { getMergedDebates } = useDebates();

  const config = getCategoryByType(categoryType.toLowerCase());
  const debates = getMergedDebates().filter(
    (d) => d.categoryType === categoryType.toLowerCase()
  );

  if (!config) {
    return (
      <main className="py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0d121b] dark:text-white mb-2">
            Not found
          </h1>
          <Link href="/" className="text-[#135bec] font-bold hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  if (!config.active && debates.length === 0) {
    return (
      <main className="py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0d121b] dark:text-white mb-2">
            {config.label}
          </h1>
          <p className="text-[#4c669a] dark:text-[#94a3b8]">
            Coming soon. We’re starting with stocks — more categories later.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-[#135bec] font-bold hover:underline"
          >
            ← Back to Stock Debates
          </Link>
        </div>
      </main>
    );
  }

  const proLabel = categoryType === "stocks" ? "Bull" : "Pro";
  const conLabel = categoryType === "stocks" ? "Bear" : "Con";

  const renderEntityMeta = (debate: Debate) => {
    if (debate.categoryType === "stocks" && debate.metadata) {
      return (
        <StockMetaBar
          meta={debate.metadata as unknown as StockMetadata}
          className="mb-2"
        />
      );
    }
    return null;
  };

  return (
    <main className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {config.label} Debates
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {debates.length} debate{debates.length !== 1 ? "s" : ""} in this category
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-[#135bec] hover:underline"
        >
          ← Home
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-stretch">
        {debates.map((debate) => (
          <DebateCard
            key={debate.id}
            debate={debate}
            proLabel={proLabel}
            conLabel={conLabel}
            entityMeta={renderEntityMeta(debate)}
          />
        ))}
      </div>
    </main>
  );
}
