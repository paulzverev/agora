"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const badgeMessages = [
  "Сканируем рынок...",
  "Подбираем лучших поставщиков",
  "Готовим персональные предложения",
  "Почти нашли идеального партнера",
];

export default function Page() {
  const [badgeIndex, setBadgeIndex] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-reveal-section]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setBadgeIndex((current) => (current + 1) % badgeMessages.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation — чистая, минимальная */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2 text-lg font-semibold tracking-tight text-gray-900 no-underline transition-opacity hover:opacity-80"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-900">
              <span className="text-sm font-bold text-white">А</span>
            </div>
            <span>Агора</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/catalog"
              className="hidden rounded-md px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 md:block"
            >
              Каталог
            </Link>
            <Link
              href="/find-supplier"
              className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Найти поставщика
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero секция */}
      <section
        data-reveal-section
        className="reveal-section relative overflow-hidden px-6 py-20 lg:py-28"
      >
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Поиск на основе ИИ
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Найдите поставщиков упаковки
              <span className="block text-gray-900">за минуты</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
              B2B-платформа, соединяющая вас с проверенными производителями
              паллет, стрейч-плёнки, коробок и логистических материалов.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/catalog"
                className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Начать поиск
              </Link>
              <Link
                href="/find-supplier"
                className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Смотреть демо
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-green-500" />
                <span>500+ поставщиков</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-500" />
                <span>10 000+ товаров</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-purple-500" />
                <span>Бесплатно</span>
              </div>
            </div>
          </div>

          {/* Dashboard mockup — вместо фотографии */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="h-6 w-48 rounded-md bg-gray-100" />
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Левая колонка — поиск */}
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <span>🔍</span>
                        <span>Поиск поставщиков</span>
                      </div>
                      <div className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400">
                        Введите материал или категорию...
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <span>📍</span>
                        <span>Регион поставки</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-20 rounded-md border border-gray-200 bg-white" />
                        <div className="h-8 w-20 rounded-md border border-gray-200 bg-white" />
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <span>📊</span>
                        <span>AI анализ</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full rounded-full bg-gray-100">
                          <div className="h-2 w-3/4 rounded-full bg-blue-500" />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Совместимость</span>
                          <span>74%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Правая колонка — результаты */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm">
                      <span className="font-medium text-gray-500">Лучшие совпадения</span>
                      <span className="text-blue-600">3 найдено</span>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-100 bg-white p-3 transition-shadow hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Поставщик {i}</div>
                            <div className="text-xs text-gray-400">Москва • MOQ от 100 шт</div>
                          </div>
                          <div className="text-sm font-medium text-blue-600">от 150 ₽</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI matching статус */}
                <div className="mt-6 flex items-center justify-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>AI matching active</span>
                  <span className="mx-1">•</span>
                  <span>Обновлён в реальном времени</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section
        data-reveal-section
        className="reveal-section border-t border-gray-100 bg-gray-50/30 py-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              Почему Агора
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Создано для современных команд закупок
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-500">
              Всё необходимое для быстрого поиска поставщиков упаковки
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section
        data-reveal-section
        className="reveal-section border-b border-gray-100 py-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { value: "99.9%", label: "Время работы", desc: "Корпоративная надёжность" },
              { value: "< 2 ч", label: "Среднее время ответа", desc: "От поставщиков" },
              { value: "50 000+", label: "Обработанных заявок", desc: "И это только начало" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="mt-1 font-medium text-gray-700">{stat.label}</div>
                <div className="mt-1 text-sm text-gray-400">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section
        data-reveal-section
        className="reveal-section border-t border-gray-100 py-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-8 text-center sm:p-12">
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                Готовы масштабировать закупки?
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Начните поиск поставщиков за 5 минут
              </h2>

              <p className="mx-auto mt-4 max-w-md text-gray-500">
                Присоединяйтесь к 500+ компаниям, которые уже находят надёжных
                поставщиков упаковки через Агору.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/catalog"
                  className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Начать бесплатно
                </Link>
                <Link
                  href="/find-supplier"
                  className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Связаться с продажами
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-400">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-gray-400 to-gray-500"
                    />
                  ))}
                </div>
                <span>Доверяют командам закупок по всему миру</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <span className="text-xs text-gray-400">© 2025 Агора. Все права защищены.</span>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "Умный поиск",
    description:
      "Алгоритм на основе ИИ подбирает оптимальных поставщиков с учётом MOQ, локации и цены.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Единая заявка",
    description:
      "Создавайте один запрос, который увидят сотни поставщиков. Сравнивайте предложения и условия.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Мгновенные ответы",
    description:
      "Получайте коммерческие предложения за часы, а не дни. Среднее время ответа — менее 2 часов.",
  },
];