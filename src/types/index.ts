// src/types/index.ts

// ==================== БАЗОВЫЕ СПРАВОЧНИКИ ====================

/** Регион (справочник) */
export interface Region {
  id: string;
  name: string;       // «Москва и МО», «СПб и ЛО», «Урал» и т.д.
  timezone: string;   // «UTC+3»
}

/** Категория верхнего уровня */
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

/** Подкатегория — дочерняя от категории */
export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;   // FK → Category.id
}

/** Поставщик */
export interface Supplier {
  id: string;
  name: string;
  regionId: string;     // FK → Region.id
  regionName: string;   // денормализация для удобства
  rating: number;        // 1-5
  verified: boolean;
}

// ==================== ТОВАР ====================

/** Единицы измерения */
export type UnitType = 'шт' | 'компл' | 'рул' | 'уп' | 'кг' | 'м' | 'паллет';

/** Товар */
export interface Product {
  id: string;
  name: string;
  sku: string;              // артикул
  description: string;      // текстовое описание (пока заменяет характеристики)
  price: number;            // цена за единицу, ₽
  unit: UnitType;
  image: string | null;

  // Наличие
  inStock: boolean;
  stockQuantity: number;    // остаток, если inStock = true

  // MOQ — минимальный объём заказа
  moq: number;              // минимальное количество для заказа
  moqUnit: UnitType;        // единица измерения MOQ

  // Связи (внешние ключи в БД)
  supplierId: string;       // FK → Supplier.id
  categoryId: string;       // FK → Category.id
  subcategoryId: string;    // FK → Subcategory.id

  // Денормализованные поля для отображения без JOIN-ов
  supplierName: string;
  categoryName: string;
  subcategoryName: string;
  regionId: string;         // FK → Region.id (через поставщика)
  regionName: string;       // денормализация

  // Место под будущие характеристики (JSONB или отдельная таблица)
  // Пока пустой массив — потом заменишь на реальные поля
  specs: string[];

  createdAt: string;        // ISO-дата
}

// ==================== ЗАЯВКА ====================

/** Одна позиция в заявке */
export interface RequestItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  price: number;
  unit: UnitType;
  quantity: number;         // сколько штук заказали
  supplierId: string;
  supplierName: string;
}

/** Заявка целиком */
export interface PurchaseRequest {
  id: string;
  items: RequestItem[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
}

// ==================== UI-СОСТОЯНИЯ ====================

/** Фильтры каталога (состояние UI) */
export interface CatalogFilters {
  search: string;
  categoryId: string | null;
  subcategoryId: string | null;
  supplierIds: string[];
  regionIds: string[];
  priceMin: number | null;
  priceMax: number | null;
  moqMax: number | null;      // фильтр «MOQ не более»
  inStockOnly: boolean;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'moq_asc';
}

/** Пагинация */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// src/types/index.ts
// ... весь существующий код остаётся, в конец добавляем:

/** Расширенная модель товара для страницы карточки */
export interface ProductDetail extends Product {
  // Дополнительные поля, которых нет в списке:
  fullDescription: string;        // полное описание (может быть HTML/Markdown)
  priceHidden: boolean;           // true → показываем «Цена скрыта»
  priceDiscount?: number;         // цена со скидкой (если есть)
  images: string[];               // массив URL картинок (пока заглушки)
  supplierInfo: {
    id: string;
    name: string;
    regionName: string;
    rating: number;
    verified: boolean;
    // Контакты скрыты по условию задачи
  };
  // Будущие характеристики — пока пустой массив
  characteristics: ProductCharacteristic[];
  // Похожие товары (для блока «С этим также берут»)
  relatedProductIds: string[];
}

/** Одна характеристика товара (заглушка для будущего) */
export interface ProductCharacteristic {
  id: string;
  name: string;       // «Длина», «Ширина», «Материал» и т.д.
  value: string;      // «1200 мм», «800 мм», «Сосна»
  unit?: string;      // «мм», «кг», «мкм»
}