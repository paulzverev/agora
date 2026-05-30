'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useState } from 'react';
import { products, suppliers } from '@/data/mock';
import { Product } from '@/types';

const CATEGORY_ICONS: Record<string, string> = {
  cat1: '📦',
  cat2: '🎞️',
  cat3: '📋',
  cat4: '🛍️',
  cat5: '🛡️',
  cat6: '🔗',
};

const moneyFormatter = new Intl.NumberFormat('ru-RU');
function formatMoney(value: number) {
  return `${moneyFormatter.format(Math.round(value))} ₽`;
}

type RequestItem = {
  product: Product;
  quantity: number;
};

export default function SupplierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const supplier = suppliers.find((s) => s.id === id);

  if (!supplier) notFound();

  const supplierProducts = products.filter((p) => p.supplierId === id);

  const categories = Array.from(
    new Map(
      supplierProducts.map((p) => [p.categoryId, { id: p.categoryId, name: p.categoryName }])
    ).values()
  );

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [requestItems, setRequestItems] = useState<RequestItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = activeCategory
    ? supplierProducts.filter((p) => p.categoryId === activeCategory)
    : supplierProducts;

  const inStockCount = supplierProducts.filter((p) => p.inStock).length;
  const minPrice = Math.min(...supplierProducts.map((p) => p.price * p.moq));

  const addToRequest = (product: Product) => {
    setRequestItems((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      if (exists) return prev;
      return [...prev, { product, quantity: product.moq }];
    });
    setDrawerOpen(true);
  };

  const removeFromRequest = (productId: string) => {
    setRequestItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setRequestItems((prev) =>
      prev.map((i) => {
        if (i.product.id !== productId) return i;
        const next = Math.max(i.product.moq, i.quantity + delta);
        return { ...i, quantity: next };
      })
    );
  };

  const totalPrice = requestItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const isInRequest = (productId: string) =>
    requestItems.some((i) => i.product.id === productId);

  return (
    <div className="relative min-h-screen bg-[#060816] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-grid" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight no-underline">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-bold">A</div>
            <span>Агора</span>
          </Link>

          <nav className="flex items-center gap-3 text-sm text-white/50">
            <Link href="/" className="transition hover:text-white">Главная</Link>
            <span>/</span>
            <Link href="/find-supplier/results" className="transition hover:text-white">Результаты</Link>
            <span>/</span>
            <span className="text-white">{supplier.name}</span>
          </nav>

          {/* Кнопка заявки в хедере */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:scale-[1.03]"
          >
            <span>Заявка</span>
            {requestItems.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan-400 px-1 text-[11px] font-bold text-black">
                {requestItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-32">
        {/* HERO */}
        <section className="pt-12 pb-8">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-8 sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_50%)]" />
            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-3xl font-black">
                  {supplier.name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-black tracking-tight">{supplier.name}</h1>
                    {supplier.verified && (
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        ✓ Проверен
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/50">
                    <span>📍 {supplier.regionName}</span>
                    <span>⭐ {supplier.rating.toFixed(1)}</span>
                    <span>📦 {supplierProducts.length} товаров</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 shrink-0">
                <StatCard label="В наличии" value={`${inStockCount}`} />
                <StatCard label="Мин. заказ" value={formatMoney(minPrice)} small />
                <StatCard label="Рейтинг" value={supplier.rating.toFixed(1)} accent />
              </div>
            </div>
          </div>
        </section>

        {/* КАТЕГОРИИ */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeCategory === null
                ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
                : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]'
            }`}
          >
            Все товары ({supplierProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeCategory === cat.id
                  ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
                  : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]'
              }`}
            >
              {CATEGORY_ICONS[cat.id]} {cat.name} ({supplierProducts.filter((p) => p.categoryId === cat.id).length})
            </button>
          ))}
        </div>

        {/* ТОВАРЫ */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inRequest={isInRequest(product.id)}
              onAdd={addToRequest}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-12 text-center text-white/40">
            Нет товаров в этой категории
          </div>
        )}
      </main>

      {/* DRAWER — заявка */}
      {/* Оверлей */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Панель */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col border-l border-white/10 bg-[#0a0f1e] transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Шапка drawer */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-black">Моя заявка</h2>
            <p className="mt-0.5 text-sm text-white/40">
              {requestItems.length === 0
                ? 'Пока пусто'
                : `${requestItems.length} ${requestItems.length === 1 ? 'товар' : requestItems.length < 5 ? 'товара' : 'товаров'}`}
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Список товаров */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {requestItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="text-5xl">🛒</div>
              <div className="text-white/40">
                Добавьте товары из каталога поставщика
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {requestItems.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  {/* Название и удалить */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{CATEGORY_ICONS[item.product.categoryId]}</span>
                      <div>
                        <div className="text-sm font-semibold leading-snug text-white">
                          {item.product.name}
                        </div>
                        <div className="mt-0.5 text-xs text-white/40">
                          SKU: {item.product.sku}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromRequest(item.product.id)}
                      className="shrink-0 text-white/30 transition hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Количество и цена */}
                  <div className="mt-3 flex items-center justify-between">
                    {/* Счётчик */}
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-1 py-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, -item.product.moq)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
                      >
                        −
                      </button>
                      <span className="min-w-[40px] text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.product.moq)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    {/* Цена */}
                    <div className="text-right">
                      <div className="text-base font-black text-white">
                        {formatMoney(item.product.price * item.quantity)}
                      </div>
                      <div className="text-xs text-white/40">
                        {formatMoney(item.product.price)} / {item.product.unit}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Итог и кнопка */}
        {requestItems.length > 0 && (
          <div className="border-t border-white/10 px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-white/60">Итого</span>
              <span className="text-2xl font-black text-white">{formatMoney(totalPrice)}</span>
            </div>
            <button className="w-full rounded-2xl bg-white py-4 text-sm font-semibold text-black transition hover:scale-[1.02]">
              Отправить заявку поставщику
            </button>
            <button
              onClick={() => setRequestItems([])}
              className="mt-3 w-full rounded-2xl border border-white/10 py-3 text-sm text-white/50 transition hover:text-white"
            >
              Очистить заявку
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label, value, small, accent,
}: {
  label: string; value: string; small?: boolean; accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center">
      <div className="mb-1 text-xs text-white/40">{label}</div>
      <div className={`font-black ${accent ? 'text-cyan-300' : 'text-white'} ${small ? 'text-base' : 'text-2xl'}`}>
        {value}
      </div>
    </div>
  );
}

function ProductCard({
  product, inRequest, onAdd,
}: {
  product: Product; inRequest: boolean; onAdd: (p: Product) => void;
}) {
  const icon = CATEGORY_ICONS[product.categoryId] ?? '📦';

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.06]">
      <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
        <span className="select-none text-6xl transition duration-500 group-hover:scale-110">{icon}</span>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold leading-snug text-white">{product.name}</div>
            <div className="mt-0.5 text-xs text-white/40">SKU: {product.sku}</div>
          </div>
          <div className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-200 whitespace-nowrap">
            MOQ {product.moq}
          </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-white/40">{product.description}</p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-xl font-black text-white">{formatMoney(product.price)}</div>
            <div className="text-xs text-white/40">за {product.unit}</div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`rounded-full px-3 py-1 text-xs font-medium ${
              product.inStock
                ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                : 'border border-white/10 bg-white/5 text-white/30'
            }`}>
              {product.inStock ? '● В наличии' : '○ Нет'}
            </div>

            <button
              onClick={() => onAdd(product)}
              disabled={!product.inStock}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition duration-300 ${
                inRequest
                  ? 'bg-cyan-400 text-black'
                  : product.inStock
                  ? 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                  : 'cursor-not-allowed border border-white/5 bg-white/[0.02] text-white/20'
              }`}
            >
              {inRequest ? '✓ В заявке' : '+ В заявку'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}