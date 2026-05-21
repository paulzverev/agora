// src/types/index.ts

// Поставщик
export interface Supplier {
  id: string;
  name: string;
  logo?: string;
}

// Категория товаров
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

// Единица измерения
export type UnitType = 'шт' | 'компл' | 'кан' | 'рул' | 'уп' | 'кг' | 'м';

// Товар
export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  unit: UnitType;
  image?: string;
  inStock: boolean;
  
  // Связи (внешние ключи в БД)
  supplierId: string;
  categoryId: string;
  
  // Денормализованные поля (для удобства отображения)
  supplierName: string;
  categoryName: string;
  
  // Характеристики (в БД это может быть JSONB или отдельная таблица)
  specs: string[];
}

// Элемент заявки
export interface RequestItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  price: number;
  unit: UnitType;
  quantity: number;
  supplierId: string;
  supplierName: string;
}

// Заявка
export interface PurchaseRequest {
  id: string;
  items: RequestItem[];
  createdAt: string;
  status: 'draft' | 'sent';
}

// Фильтры (для UI состояния)
export interface CatalogFilters {
  search: string;
  categoryId: string | null;
  supplierIds: string[];
  priceMin: number | null;
  priceMax: number | null;
  inStockOnly: boolean;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'name_asc';
}

// Пагинация
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}