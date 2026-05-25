'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по товарам, SKU, поставщикам..."
        className="
          w-full
          rounded-[28px]
          border
          border-white/10
          bg-white/[0.04]
          px-6
          py-5
          text-base
          text-white
          outline-none
          backdrop-blur-xl
          transition
          placeholder:text-white/30
          focus:border-cyan-400/40
          focus:bg-white/[0.06]
        "
      />

      <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-white/30">
        ⌘K
      </div>
    </div>
  );
}