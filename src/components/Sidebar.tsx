// src/components/Sidebar.tsx
'use client';

import { categories, subcategories, suppliers, regions } from '@/data/mock';
import { CatalogFilters } from '@/types';
import { useMemo } from 'react';

interface SidebarProps {
  filters: CatalogFilters;
  onFilterChange: (patch: Partial<CatalogFilters>) => void;
}

// Статические количества (при интеграции с БД — заменишь на COUNT из API)
const categoryCounts: Record<string, number> = {
  cat1: 3, cat2: 3, cat3: 3, cat4: 3, cat5: 3, cat6: 3,
};

const subcategoryCounts: Record<string, number> = {
  'sub1-1': 1, 'sub1-2': 1, 'sub1-3': 1,
  'sub2-1': 1, 'sub2-2': 1, 'sub2-3': 1,
  'sub3-1': 1, 'sub3-2': 1, 'sub3-3': 1,
  'sub4-1': 1, 'sub4-2': 1, 'sub4-3': 1,
  'sub5-1': 1, 'sub5-2': 1, 'sub5-3': 1,
  'sub6-1': 1, 'sub6-2': 1, 'sub6-3': 1,
};

export function Sidebar({ filters, onFilterChange }: SidebarProps) {
  // Подкатегории только для выбранной категории
  const visibleSubcategories = useMemo(() => {
    if (!filters.categoryId) return [];
    return subcategories.filter((sub) => sub.categoryId === filters.categoryId);
  }, [filters.categoryId]);

  return (
    <aside className="w-72 flex-shrink-0 py-7 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* ========== КАТЕГОРИИ ========== */}
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
            onClick={() => onFilterChange({ categoryId: null, subcategoryId: null })}
          >
            <span className="w-5 text-center">📦</span>
            Все товары
            <span className="ml-auto text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              18
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
              onClick={() => onFilterChange({ categoryId: cat.id, subcategoryId: null })}
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

      {/* ========== ПОДКАТЕГОРИИ (показываются при выбранной категории) ========== */}
      {filters.categoryId && visibleSubcategories.length > 0 && (
        <div className="mb-7">
          <h3 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-3 px-5">
            Подкатегории
          </h3>
          <ul className="list-none">
            <li
              className={`px-5 py-2 text-sm cursor-pointer flex items-center gap-2.5 border-l-2 transition-all ${
                filters.subcategoryId === null
                  ? 'bg-slate-100 text-slate-900 font-medium border-slate-900'
                  : 'border-transparent hover:bg-slate-50 hover:text-slate-900'
              }`}
              onClick={() => onFilterChange({ subcategoryId: null })}
            >
              <span className="w-5 text-center">—</span>
              Все подкатегории
            </li>
            {visibleSubcategories.map((sub) => (
              <li
                key={sub.id}
                className={`px-5 py-2 text-sm cursor-pointer flex items-center gap-2.5 border-l-2 transition-all pl-9 ${
                  filters.subcategoryId === sub.id
                    ? 'bg-slate-100 text-slate-900 font-medium border-slate-900'
                    : 'border-transparent hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={() => onFilterChange({ subcategoryId: sub.id })}
              >
                {sub.name}
                <span className="ml-auto text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {subcategoryCounts[sub.id] || 0}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ========== РЕГИОНЫ ========== */}
      <div className="mb-7">
        <h3 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-3 px-5">
          Регион поставщика
        </h3>
        <div className="px-5">
          {regions.map((reg) => (
            <label
              key={reg.id}
              className="flex items-center gap-2 py-1.5 text-sm text-slate-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.regionIds.includes(reg.id)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...filters.regionIds, reg.id]
                    : filters.regionIds.filter((id) => id !== reg.id);
                  onFilterChange({ regionIds: next });
                }}
                className="accent-slate-900 w-4 h-4"
              />
              {reg.name}
            </label>
          ))}
        </div>
      </div>

      {/* ========== ПОСТАВЩИКИ ========== */}
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
                  const next = e.target.checked
                    ? [...filters.supplierIds, sup.id]
                    : filters.supplierIds.filter((id) => id !== sup.id);
                  onFilterChange({ supplierIds: next });
                }}
                className="accent-slate-900 w-4 h-4"
              />
              {sup.name}
              {sup.verified && <span className="text-blue-500 text-xs">✓</span>}
            </label>
          ))}
        </div>
      </div>

      {/* ========== ЦЕНА ========== */}
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

      {/* ========== MOQ (минимальный заказ) ========== */}
      <div className="mb-7">
        <h3 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-3 px-5">
          Минимальный заказ (MOQ), не более
        </h3>
        <div className="px-5">
          <select
            value={filters.moqMax ?? ''}
            onChange={(e) =>
              onFilterChange({ moqMax: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white cursor-pointer outline-none"
          >
            <option value="">Не важно</option>
            <option value="1">до 1 ед.</option>
            <option value="5">до 5 ед.</option>
            <option value="10">до 10 ед.</option>
            <option value="50">до 50 ед.</option>
            <option value="100">до 100 ед.</option>
            <option value="500">до 500 ед.</option>
            <option value="1000">до 1000 ед.</option>
          </select>
        </div>
      </div>

      {/* ========== НАЛИЧИЕ ========== */}
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