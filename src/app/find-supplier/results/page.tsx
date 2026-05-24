"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, products, regions, suppliers } from "@/data/mock";
import type { Supplier } from "@/types";

const defaultCategoryIds = ["cat3", "cat2", "cat6"];
const findSupplierSelectionKey = "find-supplier-selection";
const defaultSelection = {
  selectedCategoryIds: defaultCategoryIds,
  selectedRegionIds: [] as string[],
  minimumOrderFrom: 0,
};
const moneyFormatter = new Intl.NumberFormat("ru-RU");

function formatMoney(value: number) {
  return `${moneyFormatter.format(Math.round(value))} ₽`;
}

type SupplierInsight = {
  supplier: Supplier;
  categoryIds: string[];
  categoryChips: { id: string; name: string }[];
  productCount: number;
  minOrderValue: number;
};

function buildSupplierInsight(supplier: Supplier): SupplierInsight {
  const supplierProducts = products.filter(
    (product) => product.supplierId === supplier.id,
  );
  const categoryIds = Array.from(
    new Set(supplierProducts.map((product) => product.categoryId)),
  );
  const categoryChips = categoryIds
    .map((categoryId) =>
      categories.find((category) => category.id === categoryId),
    )
    .filter((category): category is (typeof categories)[number] =>
      Boolean(category),
    )
    .slice(0, 3)
    .map((category) => ({ id: category.id, name: category.name }));

  const minOrderValue =
    supplierProducts.length > 0
      ? Math.min(
          ...supplierProducts.map((product) => product.price * product.moq),
        )
      : 10000;

  return {
    supplier,
    categoryIds,
    categoryChips,
    productCount: supplierProducts.length,
    minOrderValue,
  };
}

const supplierInsights = suppliers.map(buildSupplierInsight);

type StoredSelection = {
  selectedCategoryIds?: string[];
  selectedRegionIds?: string[];
  minimumOrderFrom?: number;
};

function readSelectionFromStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(findSupplierSelectionKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredSelection;
    const selectedCategoryIds = Array.isArray(parsed.selectedCategoryIds)
      ? parsed.selectedCategoryIds.filter((value) =>
          categories.some((category) => category.id === value),
        )
      : [];
    const selectedRegionIds = Array.isArray(parsed.selectedRegionIds)
      ? parsed.selectedRegionIds.filter((value) =>
          regions.some((region) => region.id === value),
        )
      : [];

    return {
      selectedCategoryIds,
      selectedRegionIds,
      minimumOrderFrom:
        typeof parsed.minimumOrderFrom === "number" &&
        Number.isFinite(parsed.minimumOrderFrom)
          ? parsed.minimumOrderFrom
          : 0,
    };
  } catch {
    return null;
  }
}

export default function SupplierResultsPage() {
  const [selection, setSelection] = useState(
    () => readSelectionFromStorage() ?? defaultSelection,
  );

  const { selectedCategoryIds, selectedRegionIds, minimumOrderFrom } =
    selection;

  const selectedCategories = useMemo(
    () =>
      selectedCategoryIds
        .map((categoryId) =>
          categories.find((category) => category.id === categoryId),
        )
        .filter((category): category is (typeof categories)[number] =>
          Boolean(category),
        ),
    [selectedCategoryIds],
  );

  const visibleSuppliers = useMemo(() => {
    return supplierInsights
      .filter((item) => {
        if (
          selectedRegionIds.length > 0 &&
          !selectedRegionIds.includes(item.supplier.regionId)
        ) {
          return false;
        }

        if (item.minOrderValue < minimumOrderFrom) {
          return false;
        }

        if (selectedCategoryIds.length === 0) {
          return false;
        }

        return selectedCategoryIds.some((categoryId) =>
          item.categoryIds.includes(categoryId),
        );
      })
      .sort((a, b) => {
        const aMatches = selectedCategoryIds.filter((categoryId) =>
          a.categoryIds.includes(categoryId),
        ).length;
        const bMatches = selectedCategoryIds.filter((categoryId) =>
          b.categoryIds.includes(categoryId),
        ).length;

        if (aMatches !== bMatches) {
          return bMatches - aMatches;
        }

        return b.supplier.rating - a.supplier.rating;
      });
  }, [minimumOrderFrom, selectedCategoryIds, selectedRegionIds]);

  const fullyMatchingSuppliers = visibleSuppliers.filter((item) =>
    selectedCategoryIds.every((categoryId) =>
      item.categoryIds.includes(categoryId),
    ),
  );

  const partiallyMatchingSuppliers = visibleSuppliers.filter((item) => {
    const matches = selectedCategoryIds.filter((categoryId) =>
      item.categoryIds.includes(categoryId),
    );
    return matches.length > 0 && matches.length < selectedCategoryIds.length;
  });

  const toggleRegion = (regionId: string) => {
    setSelection((prev) => ({
      ...prev,
      selectedRegionIds: prev.selectedRegionIds.includes(regionId)
        ? prev.selectedRegionIds.filter((id) => id !== regionId)
        : [...prev.selectedRegionIds, regionId],
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setSelection((prev) => ({
      ...prev,
      selectedCategoryIds: prev.selectedCategoryIds.includes(categoryId)
        ? prev.selectedCategoryIds.filter((id) => id !== categoryId)
        : [...prev.selectedCategoryIds, categoryId],
    }));
  };

  const resetFilters = () => {
    setSelection({
      selectedCategoryIds: defaultCategoryIds,
      selectedRegionIds: [],
      minimumOrderFrom: 0,
    });
  };

  const scrollToResults = () => {
    document.getElementById("supplier-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className='min-h-screen bg-[#f8f9fb] text-slate-900'>
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md'>
        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
          <Link
            href='/'
            className='flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 no-underline'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm text-white'>
              A
            </div>
            Агора
          </Link>
          <nav className='flex items-center gap-2 text-sm text-slate-500'>
            <Link href='/' className='hover:text-slate-900 no-underline'>
              Главная
            </Link>
            <span>›</span>
            <Link
              href='/find-supplier'
              className='hover:text-slate-900 no-underline'>
              Подбор поставщика
            </Link>
            <span>›</span>
            <span className='text-slate-900'>Результаты</span>
          </nav>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>
            Подходящие поставщики
          </h1>
          <p className='mt-3 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base'>
            Мы подобрали поставщиков, которые подходят под ваш запрос. Сначала
            показываем тех, у кого есть все выбранные категории, затем — тех, у
            кого есть часть.
          </p>
        </div>

        <div className='mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-900'>
                Вы выбрали категории:
              </p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {selectedCategories.map((category) => (
                  <span
                    key={category.id}
                    className='inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700'>
                    {category.icon} {category.name}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href='/find-supplier'
              className='inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-slate-50'>
              Изменить выбор
            </Link>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start'>
          <div id='supplier-results' className='min-w-0 space-y-6'>
            <section>
              <div className='mb-4 flex items-center gap-3'>
                <h2 className='text-lg font-semibold text-slate-900'>
                  Поставщики, у которых есть выбранные категории
                </h2>
                <span className='inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700'>
                  {fullyMatchingSuppliers.length}
                </span>
              </div>

              {fullyMatchingSuppliers.length > 0 ? (
                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                  {fullyMatchingSuppliers.map((item) => (
                    <SupplierCard
                      key={item.supplier.id}
                      item={item}
                      kind='full'
                    />
                  ))}
                </div>
              ) : (
                <EmptySection title='Полностью совпадающих поставщиков пока нет' />
              )}
            </section>

            <section>
              <div className='mb-4 flex items-center gap-3'>
                <h2 className='text-lg font-semibold text-slate-900'>
                  Поставщики, у которых есть часть выбранных категорий
                </h2>
                <span className='inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600'>
                  {partiallyMatchingSuppliers.length}
                </span>
              </div>

              {partiallyMatchingSuppliers.length > 0 ? (
                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                  {partiallyMatchingSuppliers.map((item) => (
                    <SupplierCard
                      key={item.supplier.id}
                      item={item}
                      kind='partial'
                    />
                  ))}
                </div>
              ) : (
                <EmptySection title='Частичных совпадений пока нет' />
              )}
            </section>

            <section className='rounded-2xl bg-slate-900 px-6 py-7 text-white shadow-sm'>
              <h2 className='text-2xl font-semibold tracking-tight'>
                Не нашли подходящего поставщика?
              </h2>
              <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base'>
                Оставьте запрос — и мы поможем подобрать варианты.
              </p>
              <div className='mt-6'>
                <Link
                  href='/catalog'
                  className='inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 no-underline transition-colors hover:bg-slate-100'>
                  Оставить запрос поставщику →
                </Link>
              </div>
            </section>
          </div>

          <aside className='lg:sticky lg:top-20'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <h2 className='text-lg font-semibold text-slate-900'>
                  Фильтры
                </h2>
                <button
                  type='button'
                  onClick={resetFilters}
                  className='text-sm font-medium text-slate-500 transition-colors hover:text-slate-900'>
                  Сбросить все
                </button>
              </div>

              <div className='space-y-6'>
                <FilterGroup title='Регион поставщика'>
                  <div className='space-y-2'>
                    {regions.map((region) => (
                      <label
                        key={region.id}
                        className='flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50'>
                        <input
                          type='checkbox'
                          checked={selectedRegionIds.includes(region.id)}
                          onChange={() => toggleRegion(region.id)}
                          className='h-4 w-4 accent-slate-900'
                        />
                        <span>{region.name}</span>
                      </label>
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title='Минимальный заказ'>
                  <label className='block text-sm text-slate-600'>
                    <span className='mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500'>
                      От
                    </span>
                    <input
                      type='range'
                      min='0'
                      max='50000'
                      step='500'
                      value={minimumOrderFrom}
                      onChange={(event) =>
                        setSelection((prev) => ({
                          ...prev,
                          minimumOrderFrom: Number(event.target.value),
                        }))
                      }
                      className='w-full accent-slate-900'
                    />
                    <div className='mt-2 flex items-center justify-between text-xs text-slate-400'>
                      <span>0 ₽</span>
                      <span>{formatMoney(minimumOrderFrom)}</span>
                    </div>
                  </label>
                </FilterGroup>

                <FilterGroup title='Категории поставщика'>
                  <div className='flex flex-wrap gap-2'>
                    {selectedCategories.map((category) => (
                      <button
                        key={category.id}
                        type='button'
                        onClick={() => toggleCategory(category.id)}
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors ${
                          selectedCategoryIds.includes(category.id)
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </FilterGroup>

                <button
                  type='button'
                  onClick={scrollToResults}
                  className='inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800'>
                  Показать {visibleSuppliers.length} поставщиков
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className='mb-3 text-sm font-semibold text-slate-900'>{title}</h3>
      {children}
    </section>
  );
}

function SupplierCard({
  item,
  kind,
}: {
  item: SupplierInsight;
  kind: "full" | "partial";
}) {
  const isFull = kind === "full";
  const badgeClassName = isFull
    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    : "bg-slate-100 text-slate-600 border-slate-200";
  const statusText = isFull ? "Полностью подходит" : "Частично подходит";

  return (
    <article className='flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md'>
      <div className='mb-4 flex items-start justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-3'>
          <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-600'>
            {item.supplier.name.charAt(0)}
          </div>
          <div className='min-w-0'>
            <div
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClassName}`}>
              {statusText}
            </div>
            <h3 className='mt-2 truncate text-base font-semibold text-slate-900'>
              {item.supplier.name}
            </h3>
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='text-sm text-slate-600'>
          📍 {item.supplier.regionName}
        </div>
        <div className='flex flex-wrap items-center gap-3 text-sm text-slate-600'>
          <span>⭐ {item.supplier.rating.toFixed(1)}</span>
          {item.supplier.verified && (
            <span className='inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600'>
              Проверен
            </span>
          )}
        </div>

        <div className='flex flex-wrap gap-2'>
          {item.categoryChips.map((chip) => (
            <span
              key={chip.id}
              className='inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600'>
              {chip.name}
            </span>
          ))}
        </div>

        <div className='grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm'>
          <div>
            <div className='text-xs text-slate-500'>Минимальный заказ</div>
            <div className='mt-1 font-semibold text-slate-900'>
              от {formatMoney(item.minOrderValue)}
            </div>
          </div>
          <div>
            <div className='text-xs text-slate-500'>Товаров в каталоге</div>
            <div className='mt-1 font-semibold text-slate-900'>
              {item.productCount}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-5'>
        <Link
          href='/catalog'
          className='inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-slate-800'>
          Смотреть товары
        </Link>
      </div>
    </article>
  );
}

function EmptySection({ title }: { title: string }) {
  return (
    <div className='rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500'>
      {title}
    </div>
  );
}
