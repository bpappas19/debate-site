import { Category } from "@/lib/types";

interface TagProps {
  category: Category;
  className?: string;
}

export default function Tag({ category, className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 ${className}`}
    >
      {category}
    </span>
  );
}
