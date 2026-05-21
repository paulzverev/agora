// src/app/product/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { productDetails, products, initialRequest } from '@/data/mock';
import { ProductDetail, RequestItem } from '@/types';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Заявка (в реальном проекте — глобальное состояние)
  const [requestItems, setRequestItems] = useState<RequestItem[]>(initialRequest.items);

  // Ищем товар в детальных данных, если нет — в общем списке
  const detail: ProductDetail | undefined = productDetails[id];
  const basic = products.find((p) => p.id === id);

  if (!basic) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Товар не найден</h1>
        <p className="text-slate-500 mb-6">Товар с таким ID не существует или был удалён.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Вернуться в каталог
        </Link>
      </div>
    );
  }

  // Если нет детальных данных — строим упрощённую версию из basic
  const product: ProductDetail = detail || {
    ...basic,
    fullDescription: basic.description,
    priceHidden: false,
    images: ['📦'],
    supplierInfo: {
      id: basic.supplierId,
      name: basic.supplierName,
      regionName: basic.regionName,
      rating: 4.0,
      verified: false,
    },
    characteristics: [],
    relatedProductIds: [],
  };

  const isInRequest = requestItems.some((item) => item.productId === id);

  const handleAddToRequest = () => {
    setRequestItems((prev) => {
      const exists = prev.find((item) => item.productId === id);
      if (exists) {
        return prev.filter((item) => item.productId !== id);
      }
      const newItem: RequestItem = {
        id: `req-item-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        price: product.price,
        unit: product.unit,
        quantity: product.moq,
        supplierId: product.supplierId,
        supplierName: product.supplierName,
      };
      return [...prev, newItem];
    });
  };

  // Похожие товары
  const relatedProducts = useMemo(() => {
    return products.filter((p) => product.relatedProductIds.includes(p.id));
  }, [product.relatedProductIds]);

  // Состояние выбранного изображения (для галереи-заглушки)
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Верхняя панель */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 no-underline">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">
            A
          </div>
          Агора
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            ← В каталог
          </Link>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-slate-700 transition-colors border-none cursor-pointer">
            📋 Моя заявка
            {requestItems.length > 0 && (
              <span className="bg-white text-slate-900 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                {requestItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Хлебные крошки */}
        <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-700 transition-colors">Каталог</Link>
          <span>›</span>
          <Link href={`/?categoryId=${product.categoryId}`} className="hover:text-slate-700 transition-colors">
            {product.categoryName}
          </Link>
          <span>›</span>
          <span className="text-slate-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Левая колонка — изображения */}
          <div className="lg:col-span-2">
            {/* Главное изображение */}
            <div className="w-full aspect-square bg-white border border-slate-200 rounded-xl flex items-center justify-center text-8xl mb-3">
              {product.images[selectedImage] || '📦'}
            </div>
            {/* Миниатюры */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 bg-white border rounded-lg flex items-center justify-center text-2xl transition-all ${
                      i === selectedImage
                        ? 'border-slate-900 ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {img}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Правая колонка — информация */}
          <div className="lg:col-span-3">
            {/* Поставщик */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm font-bold text-slate-600">
                {product.supplierInfo.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{product.supplierInfo.name}</span>
                  {product.supplierInfo.verified && (
                    <span className="text-blue-500 text-xs bg-blue-50 px-2 py-0.5 rounded-full">✓ Проверен</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                  <span>📍 {product.supplierInfo.regionName}</span>
                  <span>⭐ {product.supplierInfo.rating}</span>
                </div>
              </div>
            </div>

            {/* Название */}
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h1>

            {/* Артикул */}
            <p className="text-sm text-slate-400 mb-4">Артикул: {product.sku}</p>

            {/* Цена */}
            <div className="bg-slate-50 rounded-xl p-5 mb-6">
              {product.priceHidden ? (
                <div className="text-center py-4">
                  <div className="text-lg font-semibold text-slate-500 mb-1">🔒 Цена скрыта</div>
                  <p className="text-sm text-slate-400">
                    Поставщик публикует цену только для зарегистрированных покупателей.
                    Добавьте товар в заявку, чтобы узнать стоимость.
                  </p>
                </div>
              ) : (
                <div className="flex items-end gap-4">
                  <div>
                    {product.priceDiscount && (
                      <span className="text-sm text-slate-400 line-through block">
                        {product.price.toLocaleString()} ₽
                      </span>
                    )}
                    <span className="text-3xl font-bold text-slate-900">
                      {(product.priceDiscount || product.price).toLocaleString()} ₽
                    </span>
                    <span className="text-sm text-slate-500 ml-1">/ {product.unit}</span>
                  </div>
                  {product.priceDiscount && (
                    <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-1">
                      -{Math.round((1 - product.priceDiscount / product.price) * 100)}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Быстрая информация: MOQ, наличие, единица измерения */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Минимальный заказ</div>
                <div className="font-semibold text-slate-900">
                  {product.moq} {product.moqUnit}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Наличие</div>
                <div className={`font-semibold ${product.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                  {product.inStock
                    ? `В наличии (${product.stockQuantity} ${product.unit})`
                    : 'Под заказ'}
                </div>
              </div>
            </div>

            {/* Кнопка "В заявку" */}
            <button
              onClick={handleAddToRequest}
              className={`w-full py-3.5 rounded-xl text-base font-semibold transition-all border-none cursor-pointer ${
                isInRequest
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isInRequest ? '✓ Товар в заявке (нажмите, чтобы убрать)' : '+ Добавить в заявку'}
            </button>
          </div>
        </div>

        {/* Описание */}
        <div className="mt-10 bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Описание</h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {product.fullDescription}
          </p>
        </div>

        {/* Характеристики (заглушка) */}
        {product.characteristics.length > 0 && (
          <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Характеристики</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.characteristics.map((ch) => (
                <div key={ch.id} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{ch.name}</span>
                  <span className="text-sm font-medium text-slate-900">
                    {ch.value}{ch.unit ? ` ${ch.unit}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Похожие товары */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">С этим также берут</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/product/${rp.id}`}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all no-underline group"
                >
                  <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center text-4xl mb-3">
                    {getCategoryEmoji(rp.categoryId)}
                  </div>
                  <div className="text-xs text-slate-500 mb-1">{rp.supplierName}</div>
                  <div className="font-medium text-sm text-slate-900 group-hover:text-slate-700 line-clamp-2">
                    {rp.name}
                  </div>
                  <div className="mt-2 font-bold text-slate-900">
                    {rp.price.toLocaleString()} ₽<span className="text-xs text-slate-500 font-normal">/{rp.unit}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function getCategoryEmoji(categoryId: string): string {
  const map: Record<string, string> = {
    cat1: '📦', cat2: '🎞️', cat3: '📋', cat4: '🛍️', cat5: '🛡️', cat6: '🔗',
  };
  return map[categoryId] || '📦';
}