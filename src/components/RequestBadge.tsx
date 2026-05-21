// src/components/RequestBadge.tsx
'use client';

interface RequestBadgeProps {
  count: number;
}

export function RequestBadge({ count }: RequestBadgeProps) {
  return (
    <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-slate-700 transition-colors border-none cursor-pointer">
      📋 Моя заявка
      {count > 0 && (
        <span className="bg-white text-slate-900 w-5.5 h-5.5 rounded-full flex items-center justify-center text-xs font-bold">
          {count}
        </span>
      )}
    </button>
  );
}