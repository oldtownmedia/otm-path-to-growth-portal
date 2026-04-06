export default function InheritedBadge({
  sourceName,
}: {
  sourceName: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 italic">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
      </svg>
      Based on {sourceName}
    </span>
  );
}
