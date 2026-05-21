// src/components/Header.tsx
'use client';

import { RequestBadge } from './RequestBadge';

interface HeaderProps {
  requestItemCount: number;
}

export function Header({ requestItemCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8">
      <a href="#" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 no-underline">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">
          A
        </div>
        Агора
      </a>
      <div className="flex items-center gap-4">
        <RequestBadge count={requestItemCount} />
      </div>
    </header>
  );
}