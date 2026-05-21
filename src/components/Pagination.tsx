// src/components/Pagination.tsx
'use client';

import { PaginationState } from '@/types';

interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { currentPage, totalPages } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-9 pb-5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-lg border border-slate-200 bg-white cursor-pointer text-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ←
      </button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg text-sm transition-colors cursor-pointer border ${
              page === currentPage
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            {page}
          </button>
        );
      })}
      {totalPages > 5 && (
        <>
          <span className="text-slate-400">…</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 rounded-lg border border-slate-200 bg-white cursor-pointer text-sm hover:bg-slate-50"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-lg border border-slate-200 bg-white cursor-pointer text-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  );
}