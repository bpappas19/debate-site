import Link from "next/link";

export default function DebateNotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Debate Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The debate you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-[#135bec] px-6 py-2 text-sm font-medium text-white hover:bg-[#135bec]/90 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
