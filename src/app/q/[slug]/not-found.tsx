import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Debate Not Found
      </h1>
      <p className="text-gray-600 mb-8">
        The debate you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        Back to Feed
      </Link>
    </div>
  );
}
