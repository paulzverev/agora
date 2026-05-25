'use client';

import Link from 'next/link';

interface HeaderProps {
  requestItemCount: number;
}

export function Header({ requestItemCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060816]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 font-bold text-white shadow-lg shadow-cyan-500/20">
            A
          </div>

          <div>
            <div className="text-base font-semibold tracking-tight text-white">
              Агора
            </div>

            <div className="text-xs text-white/40">
              B2B-платформа упаковки
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Главная
          </Link>

          <button className="relative rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:scale-[1.03]">
            Заявка

            {requestItemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan-400 px-1 text-[11px] font-bold text-black">
                {requestItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}