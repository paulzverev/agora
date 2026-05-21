// src/components/Sidebar.tsx
'use client';

import { categories, suppliers } from '@/data/mock';
import { CatalogFilters } from '@/types';

interface SidebarProps {
  filters: CatalogFilters;
  onFilterChange: (filters: Partial<CatalogFilters>) => void;
}

// Статические количества для категорий (в реальном проекте — из БД)
const categoryCounts: Record<string, number> = {
  cat1: 48,
  cat2: 36,
  cat3: 72,
  cat4: 24,
  cat5: 18,
  cat6: 50,
};

export function Sidebar({ filters, onFilterChange }: SidebarProps) {
  return (
    <aside className="w-72 flex-shrink-0 py-7 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Категории */}
      <div className="mb-7">
        <h3 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-3 px-5">
          Категории
        </h3>
        <ul className="list-none">
          <li
            className={`px-5 py-2 text-sm cursor-pointer flex items-center gap-2.5 border-l-2 transition-all ${
              filters.categoryId === null
                ? 'bg-slate-100 text-slate-900 font-medium border-slate-900'
                : 'border-transparent hover:bg-slate-50 hover:text-slate-900'
            }`}
            onClick={() => onFilterChange({ categoryId: null })}
          >
            <span className="w-5 text-center">📦</span>
            Все товары
            <span className="ml-auto text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              248
            </span>
          </li>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`px-5 py-2 text-sm cursor-pointer flex items-center gap-2.5 border-l-2 transition-all ${
                filters.categoryId === cat.id
                  ? 'bg-slate-100 text-slate-900 font-medium border-slate-900'
                  : 'border-transparent hover:bg-slate-50 hover:text-slate-900'
              }`}
              onClick={() => onFilterChange({ categoryId: cat.id })}
            >
              <span className="w-5 text-center">{cat.icon}</span>
              {cat.name}
              <span className="ml-auto text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {categoryCounts[cat.id] || 0}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Поставщики */}
      <div className="mb-7">
        <h3 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-3 px-5">
          Поставщики
        </h3>
        <div className="px-5">
          {suppliers.map((sup) => (
            <label
              key={sup.id}
              className="flex items-center gap-2 py-1.5 text-sm text-slate-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.supplierIds.includes(sup.id)}
                onChange={(e) => {
                  const newSuppliers = e.target.checked
                    ? [...filters.supplierIds, sup.id]
                    : filters.supplierIds.filter((id) => id !== sup.id);
                  onFilterChange({ supplierIds: newSuppliers });
                }}
                className="accent-slate-900 w-4 h-4"
              />
              {sup.name}
            </label>
          ))}
        </div>
      </div>

      {/* Цена */}
      <div className="mb-7">
        <h3 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-3 px-5">
          Цена, ₽
        </h3>
        <div className="px-5 flex gap-2">
          <input
            type="number"
            placeholder="От"
            value={filters.priceMin ?? ''}
            onChange={(e) =>
              onFilterChange({ priceMin: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-slate-900"
          />
          <input
            type="number"
            placeholder="До"
            value={filters.priceMax ?? ''}
            onChange={(e) =>
              onFilterChange({ priceMax: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {/* Наличие */}
      <div className="mb-7">
        <h3 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-3 px-5">
          Наличие
        </h3>
        <div className="px-5">
          <label className="flex items-center gap-2 py-1.5 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
              className="accent-slate-900 w-4 h-4"
            />
            Только в наличии
          </label>
        </div>
      </div>
    </aside>
  );
}