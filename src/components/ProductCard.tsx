// src/components/ProductCard.tsx
'use client';

import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  isInRequest: boolean;
  onAddToRequest: (product: Product) => void;
}

function getCategoryEmoji(categoryId: string): string {
  const map: Record<string, string> = {
    cat1: '📦', cat2: '🎞️', cat3: '📋', cat4: '🛍️', cat5: '🛡️', cat6: '🔗',
  };
  return map[categoryId] || '📦';
}

export function ProductCard({ product, isInRequest, onAddToRequest }: ProductCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 transition-all hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 flex flex-col relative">
      {/* Изображение */}
      <div className="w-full h-44 bg-slate-100 rounded-lg flex items-center justify-center text-5xl mb-4 relative overflow-hidden">
        {getCategoryEmoji(product.categoryId)}
        {product.inStock ? (
          <span className="absolute top-2.5 left-2.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full">
            В наличии
          </span>
        ) : (
          <span className="absolute top-2.5 left-2.5 bg-red-50 text-red-500 text-xs font-semibold px-2.5 py-1 rounded-full">
            Под заказ
          </span>
        )}
      </div>

      {/* Поставщик + регион */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span className="w-4.5 h-4.5 bg-slate-200 rounded-full inline-flex items-center justify-center text-[10px]">
            {product.supplierName.charAt(0)}
          </span>
          {product.supplierName}
        </div>
        <span className="text-xs text-slate-400">📍 {product.regionName}</span>
      </div>

      {/* Название */}
      <h3 className="font-semibold text-[15px] mb-1 text-slate-900 leading-tight">
        {product.name}
      </h3>

      {/* Артикул */}
      <p className="text-xs text-slate-400 mb-2">Арт: {product.sku}</p>

      {/* Описание (вместо характеристик) */}
      <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
        {product.description}
      </p>

      {/* Место под будущие характеристики — заглушка */}
      {product.specs.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {product.specs.map((spec, i) => (
            <span
              key={i}
              className="text-[11px] bg-slate-50 px-2.5 py-1 rounded-md text-slate-500 border border-slate-100"
            >
              {spec}
            </span>
          ))}
        </div>
      )}

      {/* MOQ */}
      <div className="text-xs text-slate-500 mb-3">
        Мин. заказ: <span className="font-medium text-slate-700">{product.moq} {product.moqUnit}</span>
      </div>

      {/* Цена и кнопка */}
      <div className="mt-auto flex items-center justify-between gap-3">
        <div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            {product.price.toLocaleString()} ₽
          </span>
          <span className="text-xs text-slate-500 font-normal">/{product.unit}</span>
        </div>
        <button
          onClick={() => onAddToRequest(product)}
          className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 border-none cursor-pointer ${
            isInRequest
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-900 text-white hover:bg-slate-700'
          }`}
        >
          {isInRequest ? '✓ В заявке' : '+ В заявку'}
        </button>
      </div>
    </div>
  );
}