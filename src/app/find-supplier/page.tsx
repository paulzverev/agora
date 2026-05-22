// src/app/find-supplier/page.tsx
// Замени всё содержимое файла

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { suppliers, regions } from '@/data/mock';
import { Supplier } from '@/types';

const packagingTypes = [
    { id: 'pt1', name: 'Гофрокоробка', icon: '📋' },
    { id: 'pt2', name: 'Скотч', icon: '🔗' },
    { id: 'pt3', name: 'Стрейч-плёнка', icon: '🎞️' },
    { id: 'pt4', name: 'Упаковочная лента', icon: '🎀' },
    { id: 'pt5', name: 'Пакеты', icon: '🛍️' },
    { id: 'pt6', name: 'Воздушно-пузырчатая плёнка', icon: '🛡️' },
    { id: 'pt7', name: 'Наполнители', icon: '🧻' },
    { id: 'pt8', name: 'Паллеты', icon: '📦' },
];

const packagingToCategories: Record<string, string[]> = {
    pt1: ['cat3'],
    pt2: ['cat6'],
    pt3: ['cat2'],
    pt4: ['cat6'],
    pt5: ['cat4'],
    pt6: ['cat5'],
    pt7: ['cat5'],
    pt8: ['cat1'],
};

const supplierCategories: Record<string, string[]> = {
    sup1: ['cat1', 'cat2', 'cat4', 'cat6'],
    sup2: ['cat2', 'cat3', 'cat5', 'cat6'],
    sup3: ['cat1', 'cat3', 'cat5'],
    sup4: ['cat1', 'cat3', 'cat4', 'cat5'],
    sup5: ['cat2', 'cat4', 'cat6'],
};

const totalSteps = 3;

export default function FindSupplierPage() {
    const [step, setStep] = useState(1);
    const [selectedPackaging, setSelectedPackaging] = useState<Set<string>>(new Set());
    const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
    const [budgetMin, setBudgetMin] = useState<number>(0);
    const [results, setResults] = useState<Supplier[] | null>(null);
    const [searched, setSearched] = useState(false);

    const togglePackaging = (id: string) => {
        setSelectedPackaging((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleRegion = (id: string) => {
        setSelectedRegions((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleSearch = () => {
        setSearched(true);

        if (selectedPackaging.size === 0) {
            setResults([]);
            return;
        }

        const neededCategories = new Set<string>();
        selectedPackaging.forEach((ptId) => {
            (packagingToCategories[ptId] || []).forEach((c) => neededCategories.add(c));
        });

        const filtered = suppliers.filter((sup) => {
            const supCats = supplierCategories[sup.id] || [];
            if (!supCats.some((cat) => neededCategories.has(cat))) return false;
            if (selectedRegions.size > 0 && !selectedRegions.has(sup.regionId)) return false;
            return true;
        });

        setResults(filtered);
    };

    const handleReset = () => {
        setSelectedPackaging(new Set());
        setSelectedRegions(new Set());
        setBudgetMin(0);
        setResults(null);
        setSearched(false);
        setStep(1);
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-[#f8f9fb]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8">
                <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 no-underline">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">A</div>
                    Агора
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/catalog" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Каталог</Link>
                    <Link href="/" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">← На главную</Link>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-8 py-10">
                {/* Заголовок */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Подбор поставщика</h1>
                    <p className="text-slate-500">Ответьте на 3 вопроса — получите список поставщиков</p>
                </div>

                {/* Индикатор шагов */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${s === step
                                ? 'bg-slate-900 text-white'
                                : s < step
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                {s < step ? '✓' : s}
                            </div>
                            {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                        </div>
                    ))}
                </div>

                {/* Шаг 1: Типы упаковки */}
                {step === 1 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">
                            1. Какие типы упаковки вас интересуют?
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">Выберите один или несколько вариантов</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {packagingTypes.map((pt) => (
                                <button
                                    key={pt.id}
                                    onClick={() => togglePackaging(pt.id)}
                                    className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all cursor-pointer ${selectedPackaging.has(pt.id)
                                        ? 'border-slate-900 bg-slate-50 shadow-md'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                        }`}
                                >
                                    <span className="text-5xl">{pt.icon}</span>
                                    <span className={`text-sm font-medium text-center leading-tight ${selectedPackaging.has(pt.id) ? 'text-slate-900' : 'text-slate-600'
                                        }`}>
                                        {pt.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end mt-8">
                            <button
                                onClick={nextStep}
                                disabled={selectedPackaging.size === 0}
                                className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Далее →
                            </button>
                        </div>
                    </div>
                )}

                {/* Шаг 2: Регион */}
                {step === 2 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">
                            2. В каком регионе искать поставщика?
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">Можно выбрать несколько или пропустить — тогда покажем всех</p>
                        <div className="space-y-3">
                            {regions.map((reg) => (
                                <label
                                    key={reg.id}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRegions.has(reg.id)
                                        ? 'border-slate-900 bg-slate-50'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedRegions.has(reg.id)}
                                        onChange={() => toggleRegion(reg.id)}
                                        className="accent-slate-900 w-4 h-4 rounded"
                                    />
                                    <span className="text-sm font-medium text-slate-700">{reg.name}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 rounded-xl text-sm font-medium text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                ← Назад
                            </button>
                            <button
                                onClick={nextStep}
                                className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all border-none cursor-pointer"
                            >
                                Далее →
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">
                            3. Минимальный заказ?
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">Покажем поставщиков с MOQ не ниже этой суммы</p>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-slate-900 mb-6">
                                от {budgetMin.toLocaleString()} ₽
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="1000"
                                value={budgetMin}
                                onChange={(e) => setBudgetMin(Number(e.target.value))}
                                className="w-full accent-slate-900 h-2 rounded-full appearance-none bg-slate-200 outline-none mb-2"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>0 ₽</span>
                                <span>100 000 ₽</span>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 rounded-xl text-sm font-medium text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                ← Назад
                            </button>
                            <button
                                onClick={() => {
                                    handleSearch();
                                    setStep(totalSteps + 1);
                                }}
                                className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all border-none cursor-pointer"
                            >
                                Подобрать поставщиков
                            </button>
                        </div>
                    </div>
                )}

                {/* Результаты */}
                {step > totalSteps && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Результаты подбора</h2>
                        {results && results.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {results.map((sup) => (
                                    <div
                                        key={sup.id}
                                        className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-slate-300 transition-all"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-600">
                                                {sup.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 flex items-center gap-2">
                                                    {sup.name}
                                                    {sup.verified && (
                                                        <span className="text-blue-500 text-xs bg-blue-50 px-1.5 py-0.5 rounded-full">✓</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500">📍 {sup.regionName}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                            <span>⭐ {sup.rating}</span>
                                        </div>
                                        <Link
                                            href={`/catalog?supplierIds=${sup.id}`}
                                            className="block w-full text-center bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors no-underline"
                                        >
                                            Смотреть товары
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Поставщики не найдены</h3>
                                <p className="text-slate-500 mb-4">Попробуйте изменить параметры поиска.</p>
                                <button
                                    onClick={handleReset}
                                    className="text-slate-900 font-medium underline cursor-pointer border-none bg-transparent"
                                >
                                    Начать заново
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="border-t border-slate-200 bg-white py-8 mt-12">
                <div className="max-w-6xl mx-auto px-8 text-center text-sm text-slate-400">
                    © 2026 Агора — B2B-каталог поставщиков транспортной упаковки
                </div>
            </footer>
        </div>
    );
}