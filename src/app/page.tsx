// src/app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { ProductGrid } from '@/components/ProductGrid';
import { Pagination } from '@/components/Pagination';
import { products, initialRequest } from '@/data/mock';
import { CatalogFilters, PaginationState, Product, RequestItem } from '@/types';

export default function HomePage() {
  // Состояние фильтров
  const [filters, setFilters] = useState<CatalogFilters>({
    search: '',
    categoryId: null,
    supplierIds: [],
    priceMin: null,
    priceMax: null,
    inStockOnly: false,
    sortBy: 'relevance',
  });

  // Состояние заявки (в реальном проекте — глобальное состояние или API)
  const [requestItems, setRequestItems] = useState<RequestItem[]>(initialRequest.items);

  // Состояние пагинации
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const ITEMS_PER_PAGE = 6;

  // Обновление фильтров
  const handleFilterChange = (patch: Partial<CatalogFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Добавление/удаление из заявки
  const handleAddToRequest = (product: Product) => {
    setRequestItems((prev) => {
      const exists = prev.find((item) => item.productId === product.id);
      if (exists) {
        // Удаляем из заявки
        return prev.filter((item) => item.productId !== product.id);
      }
      // Добавляем в заявку
      const newItem: RequestItem = {
        id: `req-item-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        price: product.price,
        unit: product.unit,
        quantity: 1,
        supplierId: product.supplierId,
        supplierName: product.supplierName,
      };
      return [...prev, newItem];
    });
  };

  // Множество ID товаров в заявке для быстрой проверки
  const requestItemIds = useMemo(
    () => new Set(requestItems.map((item) => item.productId)),
    [requestItems]
  );

  // Фильтрация и сортировка товаров
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Поиск по тексту
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q)
      );
    }

    // Фильтр по категории
    if (filters.categoryId) {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    // Фильтр по поставщикам
    if (filters.supplierIds.length > 0) {
      result = result.filter((p) => filters.supplierIds.includes(p.supplierId));
    }

    // Фильтр по цене
    if (filters.priceMin !== null) {
      result = result.filter((p) => p.price >= filters.priceMin!);
    }
    if (filters.priceMax !== null) {
      result = result.filter((p) => p.price <= filters.priceMax!);
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
    }

    return result;
  }, [filters]);

  // Пагинация
  const paginatedProducts = useMemo(() => {
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const start = (pagination.currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    setPagination((prev) => {
      if (prev.totalItems !== totalItems || prev.totalPages !== totalPages) {
        return { ...prev, totalItems, totalPages, currentPage: Math.min(prev.currentPage, totalPages || 1) };
      }
      return prev;
    });

    return filteredProducts.slice(start, end);
  }, [filteredProducts, pagination.currentPage]);

  return (
    <>
      <Header />
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
              Найдено: <strong className="text-slate-900">{pagination.totalItems} товаров</strong>
            </p>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as CatalogFilters['sortBy'] })}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white cursor-pointer outline-none"
            >
              <option value="relevance">По релевантности</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="name_asc">Название: А-Я</option>
            </select>
          </div>

          <ProductGrid
            products={paginatedProducts}
            requestItemIds={requestItemIds}
            onAddToRequest={handleAddToRequest}
          />

          <Pagination
            pagination={pagination}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
          />
        </main>
      </div>
    </>
  );
}