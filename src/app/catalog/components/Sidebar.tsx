'use client';

import { CatalogFilters } from '@/types';

interface SidebarProps {
  filters: CatalogFilters;
  onFilterChange: (patch: Partial<CatalogFilters>) => void;
}

export function Sidebar({
  filters,
  onFilterChange,
}: SidebarProps) {
  return (
    <aside className="sticky top-24 hidden h-fit w-[300px] shrink-0 lg:block">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white">
            Фильтры
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Настройте параметры поиска поставщиков
          </p>
        </div>

        <div className="space-y-7">
          <div>
            <label className="mb-3 block text-sm font-medium text-white/70">
              Цена от
            </label>

            <input
              type="number"
              value={filters.priceMin ?? ''}
              onChange={(e) =>
                onFilterChange({
                  priceMin: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              placeholder="₽"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/40"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-white/70">
              Цена до
            </label>

            <input
              type="number"
              value={filters.priceMax ?? ''}
              onChange={(e) =>
                onFilterChange({
                  priceMax: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              placeholder="₽"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/40"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-white/70">
              Максимальный MOQ
            </label>

            <input
              type="number"
              value={filters.moqMax ?? ''}
              onChange={(e) =>
                onFilterChange({
                  moqMax: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              placeholder="Например 100"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/40"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) =>
                onFilterChange({
                  inStockOnly: e.target.checked,
                })
              }
              className="h-4 w-4 accent-cyan-400"
            />

            <span className="text-sm text-white/80">
              Только в наличии
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
}