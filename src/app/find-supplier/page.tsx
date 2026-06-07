"use client";

import { useState } from "react";
import Link from "next/link";
import { suppliers, regions } from "@/data/mock";
import { Supplier } from "@/types";

const packagingTypes = [
  { id: "pt1", name: "Гофрокоробка", icon: "📋" },
  { id: "pt2", name: "Скотч", icon: "🔗" },
  { id: "pt3", name: "Стрейч-плёнка", icon: "🎞️" },
  { id: "pt4", name: "Упаковочная лента", icon: "🎀" },
  { id: "pt5", name: "Пакеты", icon: "🛍️" },
  { id: "pt6", name: "Воздушно-пузырчатая плёнка", icon: "🛡️" },
  { id: "pt7", name: "Наполнители", icon: "🧻" },
  { id: "pt8", name: "Паллеты", icon: "📦" },
];

const packagingToCategories: Record<string, string[]> = {
  pt1: ["cat3"],
  pt2: ["cat6"],
  pt3: ["cat2"],
  pt4: ["cat6"],
  pt5: ["cat4"],
  pt6: ["cat5"],
  pt7: ["cat5"],
  pt8: ["cat1"],
};

const supplierCategories: Record<string, string[]> = {
  sup1: ["cat1", "cat2", "cat4", "cat6"],
  sup2: ["cat2", "cat3", "cat5", "cat6"],
  sup3: ["cat1", "cat3", "cat5"],
  sup4: ["cat1", "cat3", "cat4", "cat5"],
  sup5: ["cat2", "cat4", "cat6"],
};

const totalSteps = 3;
const findSupplierSelectionKey = "find-supplier-selection";

export default function FindSupplierPage() {
  const [step, setStep] = useState(1);

  const [selectedPackaging, setSelectedPackaging] =
    useState<Set<string>>(new Set());

  const [selectedRegions, setSelectedRegions] =
    useState<Set<string>>(new Set());

  const [budgetMin, setBudgetMin] =
    useState<number>(0);

  const [results, setResults] =
    useState<Supplier[] | null>(null);

  const togglePackaging = (id: string) => {
    setSelectedPackaging((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const toggleRegion = (id: string) => {
    setSelectedRegions((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleSearch = () => {
    const selectedCategoryIds = Array.from(
      new Set(
        Array.from(selectedPackaging).flatMap(
          (packagingId) =>
            packagingToCategories[packagingId] || [],
        ),
      ),
    );

    try {
      sessionStorage.setItem(
        findSupplierSelectionKey,
        JSON.stringify({
          selectedPackagingIds:
            Array.from(selectedPackaging),

          selectedCategoryIds,

          selectedRegionIds:
            Array.from(selectedRegions),

          minimumOrderFrom: budgetMin,
        }),
      );
    } catch {}

    if (selectedPackaging.size === 0) {
      setResults([]);
      return;
    }

    const neededCategories = new Set<string>();

    selectedPackaging.forEach((ptId) => {
      (packagingToCategories[ptId] || []).forEach(
        (c) => neededCategories.add(c),
      );
    });

    const filtered = suppliers.filter((sup) => {
      const supCats =
        supplierCategories[sup.id] || [];

      if (
        !supCats.some((cat) =>
          neededCategories.has(cat),
        )
      ) {
        return false;
      }

      if (
        selectedRegions.size > 0 &&
        !selectedRegions.has(sup.regionId)
      ) {
        return false;
      }

      return true;
    });

    setResults(filtered);
  };

  const handleReset = () => {
    setSelectedPackaging(new Set());
    setSelectedRegions(new Set());
    setBudgetMin(0);
    setResults(null);
    setStep(1);
  };

  const nextStep = () =>
    setStep((prev) =>
      Math.min(prev + 1, totalSteps),
    );

  const prevStep = () =>
    setStep((prev) =>
      Math.max(prev - 1, 1),
    );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060816] text-white">

      {/* BACKGROUND */}
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
            className="flex items-center gap-3 no-underline"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 font-bold">
              A
            </div>

            <div>
              <div className="text-base font-semibold">
                Агора
              </div>

              <div className="text-xs text-white/40">
                B2B-платформа упаковки
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/catalog"
              className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10 md:block"
            >
              Каталог
            </Link>

            <Link
              href="/"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:scale-[1.03]"
            >
              На главную
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-4xl px-4 pt-12 pb-20 sm:px-6">

        {/* HERO */}
        <div className="mb-14 text-center">
          <div className="section-badge">
            AI-подбор поставщиков
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.06em] sm:text-5xl">
            Найдём поставщиков
            <span className="gradient-text block pb-2">
              под вашу задачу
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
            Ответьте на несколько вопросов —
            система автоматически подберёт
            производителей упаковки,
            подходящих под ваш запрос.
          </p>
        </div>

        {/* STEPS */}
        <div className="mb-10 flex items-center justify-center gap-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="flex items-center gap-3"
            >
              <div
                className={`
                  flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-all
                  ${
                    s === step
                      ? "bg-white text-black"
                      : s < step
                        ? "bg-cyan-400 text-black"
                        : "border border-white/10 bg-white/5 text-white/40"
                  }
                `}
              >
                {s < step ? "✓" : s}
              </div>

              {s < 3 && (
                <div
                  className={`
                    h-px w-10
                    ${
                      s < step
                        ? "bg-cyan-400"
                        : "bg-white/10"
                    }
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="glass rounded-[36px] border border-white/10 p-8 sm:p-10">

            <h2 className="text-2xl font-bold">
              Какие типы упаковки вас интересуют?
            </h2>

            <p className="mt-3 text-white/50">
              Выберите один или несколько вариантов
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {packagingTypes.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() =>
                    togglePackaging(pt.id)
                  }
                  className={`
                    group rounded-[28px] border p-6 transition-all
                    ${
                      selectedPackaging.has(pt.id)
                        ? "border-cyan-400/40 bg-cyan-400/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <div className="text-5xl transition-transform duration-300 group-hover:scale-110">
                    {pt.icon}
                  </div>

                  <div className="mt-4 text-sm font-medium leading-snug text-white/80">
                    {pt.name}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={nextStep}
                disabled={
                  selectedPackaging.size === 0
                }
                className="rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Далее →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="glass rounded-[36px] border border-white/10 p-8 sm:p-10">

            <h2 className="text-2xl font-bold">
              В каком регионе искать?
            </h2>

            <p className="mt-3 text-white/50">
              Можно выбрать несколько
            </p>

            <div className="mt-8 space-y-3">
              {regions.map((reg) => (
                <label
                  key={reg.id}
                  className={`
                    flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition-all
                    ${
                      selectedRegions.has(reg.id)
                        ? "border-cyan-400/40 bg-cyan-400/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedRegions.has(reg.id)}
                    onChange={() =>
                      toggleRegion(reg.id)
                    }
                    className="h-4 w-4 accent-cyan-400"
                  />

                  <span className="text-white/80">
                    {reg.name}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={prevStep}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70 transition hover:bg-white/10"
              >
                ← Назад
              </button>

              <button
                onClick={nextStep}
                className="rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Далее →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="glass rounded-[36px] border border-white/10 p-8 sm:p-10">

            <h2 className="text-2xl font-bold">
              Минимальный бюджет заказа
            </h2>

            <p className="mt-3 text-white/50">
              Покажем подходящих поставщиков
            </p>

            <div className="mt-12 text-center">
              <div className="text-5xl font-black tracking-tight">
                от {budgetMin.toLocaleString()} ₽
              </div>

              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={budgetMin}
                onChange={(e) =>
                  setBudgetMin(
                    Number(e.target.value),
                  )
                }
                className="mt-10 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
              />

              <div className="mt-3 flex justify-between text-xs text-white/30">
                <span>0 ₽</span>
                <span>100 000 ₽</span>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={prevStep}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70 transition hover:bg-white/10"
              >
                ← Назад
              </button>

              <Link
                href="/find-supplier/results"
                onClick={handleSearch}
                className="rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-black transition hover:scale-[1.02] no-underline"
              >
                Подобрать поставщиков
              </Link>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {results && (
          <div className="mt-10">
            {results.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {results.map((sup) => (
                  <div
                    key={sup.id}
                    className="glass rounded-[28px] border border-white/10 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          {sup.name}

                          {sup.verified && (
                            <span className="rounded-full bg-cyan-400/20 px-2 py-1 text-xs text-cyan-200">
                              ✓
                            </span>
                          )}
                        </div>

                        <div className="mt-2 text-sm text-white/40">
                          📍 {sup.regionName}
                        </div>
                      </div>

                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
                        ⭐ {sup.rating}
                      </div>
                    </div>

                    <Link
                      href={`/catalog?supplierIds=${sup.id}`}
                      className="mt-6 block rounded-2xl bg-white py-3 text-center text-sm font-semibold text-black transition hover:scale-[1.02] no-underline"
                    >
                      Смотреть товары
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-[36px] border border-white/10 px-8 py-20 text-center">
                <div className="text-6xl">
                  🔍
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  Поставщики не найдены
                </h3>

                <p className="mt-4 text-white/50">
                  Попробуйте изменить параметры поиска
                </p>

                <button
                  onClick={handleReset}
                  className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-white transition hover:bg-white/10"
                >
                  Начать заново
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-white/40">
          © 2026 Агора
        </div>
      </footer>
    </main>
  );
}