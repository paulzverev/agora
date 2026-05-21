// src/components/SearchBar.tsx
'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-7">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по названию, артикулу или поставщику..."
        className="w-full pl-12 pr-4 py-3.5 text-base border border-slate-200 rounded-xl bg-white outline-none transition-all focus:border-slate-900 focus:shadow-[0_0_0_4px_rgba(15,23,42,0.04)] placeholder:text-slate-400"
      />
    </div>
  );
}