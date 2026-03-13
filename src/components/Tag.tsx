/**
 * Generic tag. Can display a category label or a tag string (e.g. from debate.tags).
 */
interface TagProps {
  label: string;
  className?: string;
}

export default function Tag({ label, className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {label}
    </span>
  );
}
