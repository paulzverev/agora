// src/app/find-supplier/results/page.tsx

"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
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
    .map((category) => ({
      id: category.id,
      name: category.name,
    }));

  const minOrderValue =
    supplierProducts.length > 0
      ? Math.min(
          ...supplierProducts.map(
            (product) => product.price * product.moq,
          ),
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
  const [selection, setSelection] = useState(defaultSelection);

  useEffect(() => {
    const stored = readSelectionFromStorage();
    if (stored) setSelection(stored);
  }, []);

  const { selectedCategoryIds, selectedRegionIds, minimumOrderFrom } = selection;

  const selectedCategories = useMemo(
    () =>
      selectedCategoryIds
        .map((categoryId) =>
          categories.find((category) => category.id === categoryId),
        )
        .filter(
          (category): category is (typeof categories)[number] =>
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
    document
      .getElementById("supplier-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 -z-10">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-grid" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-semibold tracking-tight no-underline"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-bold">
              A
            </div>
            <span>Агора</span>
          </Link>

          <nav className="flex items-center gap-3 text-sm text-white/50">
            <Link href="/" className="transition hover:text-white">
              Главная
            </Link>
            <span>/</span>
            <Link href="/find-supplier" className="transition hover:text-white">
              Подбор
            </Link>
            <span>/</span>
            <span className="text-white">Результаты</span>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-8 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_40%)]" />

          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="section-badge">Результаты подбора</div>

              <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Подходящие
                <span className="gradient-text block">поставщики</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
                Мы подобрали поставщиков, которые соответствуют вашему запросу
                по категориям, региону и минимальному заказу.
              </p>
            </div>

            <div className="glass rounded-3xl px-6 py-5">
              <div className="text-sm text-white/50">Найдено поставщиков</div>
              <div className="mt-2 text-4xl font-black">{visibleSuppliers.length}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* FILTERS */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="glass rounded-[32px] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Фильтры</h2>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm text-white/50 transition hover:text-white"
                >
                  Сбросить
                </button>
              </div>

              <div className="space-y-8">
                {/* REGIONS */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/40">
                    Регион
                  </h3>
                  <div className="space-y-2">
                    {regions.map((region) => (
                      <label
                        key={region.id}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.06]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRegionIds.includes(region.id)}
                          onChange={() => toggleRegion(region.id)}
                          className="h-4 w-4 accent-cyan-400"
                        />
                        <span className="text-sm text-white/70">{region.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* MOQ */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/40">
                    Минимальный заказ
                  </h3>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-3xl font-black">
                      {formatMoney(minimumOrderFrom)}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={minimumOrderFrom}
                      onChange={(event) =>
                        setSelection((prev) => ({
                          ...prev,
                          minimumOrderFrom: Number(event.target.value),
                        }))
                      }
                      className="mt-5 w-full accent-cyan-400"
                    />
                    <div className="mt-3 flex items-center justify-between text-xs text-white/30">
                      <span>0 ₽</span>
                      <span>50 000 ₽</span>
                    </div>
                  </div>
                </div>

                {/* CATEGORIES */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/40">
                    Категории
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          selectedCategoryIds.includes(category.id)
                            ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToResults}
                  className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Показать {visibleSuppliers.length} поставщиков
                </button>
              </div>
            </div>
          </aside>

          {/* RESULTS */}
          <div id="supplier-results" className="space-y-10">
            {/* FULL */}
            <section>
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-2xl font-bold">Полное совпадение</h2>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
                  {fullyMatchingSuppliers.length}
                </div>
              </div>

              {fullyMatchingSuppliers.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {fullyMatchingSuppliers.map((item) => (
                    <SupplierCard key={item.supplier.id} item={item} kind="full" />
                  ))}
                </div>
              ) : (
                <EmptySection title="Поставщиков пока не найдено" />
              )}
            </section>

            {/* PARTIAL */}
            <section>
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-2xl font-bold">Частичное совпадение</h2>
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-sm text-white/60">
                  {partiallyMatchingSuppliers.length}
                </div>
              </div>

              {partiallyMatchingSuppliers.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {partiallyMatchingSuppliers.map((item) => (
                    <SupplierCard key={item.supplier.id} item={item} kind="partial" />
                  ))}
                </div>
              ) : (
                <EmptySection title="Частичных совпадений нет" />
              )}
            </section>

            {/* CTA */}
            <section className="cta-card rounded-[36px] p-10 text-center">
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="text-4xl font-black leading-tight">
                  Не нашли нужного поставщика?
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-white/70">
                  Оставьте заявку — и мы поможем подобрать варианты под ваш запрос.
                </p>
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/catalog"
                    className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-[1.02]"
                  >
                    Оставить заявку
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
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

  return (
    <article className="feature-card flex h-full flex-col">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">
            {item.supplier.name.charAt(0)}
          </div>

          <div>
            <div
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                isFull
                  ? "bg-emerald-400/10 text-emerald-200"
                  : "bg-white/10 text-white/60"
              }`}
            >
              {isFull ? "Полное совпадение" : "Частичное совпадение"}
            </div>

            <h3 className="mt-3 text-xl font-bold">{item.supplier.name}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-4 text-white/60">
        <div>📍 {item.supplier.regionName}</div>

        <div className="flex items-center gap-4">
          <span>⭐ {item.supplier.rating.toFixed(1)}</span>
          {item.supplier.verified && (
            <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-xs text-cyan-200">
              Проверен
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {item.categoryChips.map((chip) => (
            <span
              key={chip.id}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs"
            >
              {chip.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div>
            <div className="text-xs text-white/40">MOQ</div>
            <div className="mt-1 font-semibold text-white">
              от {formatMoney(item.minOrderValue)}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/40">Товаров</div>
            <div className="mt-1 font-semibold text-white">{item.productCount}</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={`/supplier/${item.supplier.id}`}
          className="block rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:scale-[1.02]"
        >
          Смотреть товары
        </Link>
      </div>
    </article>
  );
}

function EmptySection({ title }: { title: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-8 text-white/50">
      {title}
    </div>
  );
}