// src/app/page.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { ProductGrid } from './components/ProductGrid';
import { Pagination } from './components/Pagination';
import { products, initialRequest } from '@/data/mock';
import { CatalogFilters, Product, RequestItem } from '@/types';

const ITEMS_PER_PAGE = 6;

export default function HomePage() {
  // ==================== СОСТОЯНИЯ ====================
  const [filters, setFilters] = useState<CatalogFilters>({
    search: '',
    categoryId: null,
    subcategoryId: null,
    supplierIds: [],
    regionIds: [],
    priceMin: null,
    priceMax: null,
    moqMax: null,
    inStockOnly: false,
    sortBy: 'relevance',
  });

  const [requestItems, setRequestItems] = useState<RequestItem[]>(initialRequest.items);
  const [currentPage, setCurrentPage] = useState(1);

  // ==================== ОБРАБОТЧИКИ ====================
  const handleFilterChange = useCallback((patch: Partial<CatalogFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setCurrentPage(1); // сброс страницы при любом изменении фильтра
  }, []);

  const handleAddToRequest = useCallback((product: Product) => {
    setRequestItems((prev) => {
      const exists = prev.find((item) => item.productId === product.id);
      if (exists) {
        return prev.filter((item) => item.productId !== product.id);
      }
      const newItem: RequestItem = {
        id: `req-item-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        price: product.price,
        unit: product.unit,
        quantity: product.moq, // по умолчанию — MOQ
        supplierId: product.supplierId,
        supplierName: product.supplierName,
      };
      return [...prev, newItem];
    });
  }, []);

  // Множество ID товаров в заявке (для быстрой проверки в карточке)
  const requestItemIds = useMemo(
    () => new Set(requestItems.map((item) => item.productId)),
    [requestItems]
  );

  // ==================== ФИЛЬТРАЦИЯ ====================
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Поиск по тексту
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Категория
    if (filters.categoryId) {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    // Подкатегория
    if (filters.subcategoryId) {
      result = result.filter((p) => p.subcategoryId === filters.subcategoryId);
    }

    // Поставщики
    if (filters.supplierIds.length > 0) {
      result = result.filter((p) => filters.supplierIds.includes(p.supplierId));
    }

    // Регионы
    if (filters.regionIds.length > 0) {
      result = result.filter((p) => filters.regionIds.includes(p.regionId));
    }

    // Цена
    if (filters.priceMin !== null) {
      result = result.filter((p) => p.price >= filters.priceMin!);
    }
    if (filters.priceMax !== null) {
      result = result.filter((p) => p.price <= filters.priceMax!);
    }

    // MOQ
    if (filters.moqMax !== null) {
      result = result.filter((p) => p.moq <= filters.moqMax!);
    }

    // Наличие
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Сортировка
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'moq_asc':
        result.sort((a, b) => a.moq - b.moq);
        break;
      // relevance — без сортировки (как в данных)
    }

    return result;
  }, [filters]);

  // ==================== ПАГИНАЦИЯ ====================
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  // Если текущая страница вышла за пределы — сбросить
  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, safePage]);

  // ==================== РЕНДЕР ====================
  return (
    <>
      <Header requestItemCount={requestItems.length} />
      <div className="flex max-w-[1440px] mx-auto px-8 min-h-[calc(100vh-4rem)]">
        <Sidebar filters={filters} onFilterChange={handleFilterChange} />
        <main className="flex-1 py-7 pl-8 min-w-0">
          <SearchBar
            value={filters.search}
            onChange={(value) => handleFilterChange({ search: value })}
          />

          {/* Тулбар */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              Найдено: <strong className="text-slate-900">{totalItems} товаров</strong>
            </p>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({ sortBy: e.target.value as CatalogFilters['sortBy'] })
              }
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white cursor-pointer outline-none"
            >
              <option value="relevance">По релевантности</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="name_asc">Название: А-Я</option>
              <option value="moq_asc">MOQ: по возрастанию</option>
            </select>
          </div>

          <ProductGrid
            products={paginatedProducts}
            requestItemIds={requestItemIds}
            onAddToRequest={handleAddToRequest}
          />

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </>
  );
}