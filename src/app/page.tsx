"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

const badgeMessages = [
  "Сканируем рынок...",
  "Подбираем лучших поставщиков",
  "Готовим персональные предложения",
  "Почти нашли идеального партнера",
];

const heroTitles = [
  "Найдите поставщиков упаковки за минуты",
  "Сравнивайте предложения в одном окне",
  "Получайте лучшие цены автоматически",
  "Находите производителей без посредников",
  "Запускайте закупки быстрее конкурентов",
];

export default function Page() {
  const heroRef = useRef<HTMLSpanElement | null>(null);
  const [badgeIndex, setBadgeIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);

  const [heroText, setHeroText] = useState(heroTitles[0]);
  const [heroTitleIndex, setHeroTitleIndex] = useState(0);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    let currentIndex = 0;
    let currentText = heroTitles[0];

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const type = async (text: string) => {
      el.textContent = "";

      for (let i = 0; i <= text.length; i++) {
        el.textContent = text.slice(0, i);
        await sleep(35);
      }
    };

    const erase = async () => {
      const text = el.textContent || "";

      for (let i = text.length; i >= 0; i--) {
        el.textContent = text.slice(0, i);
        await sleep(20);
      }
    };

    const run = async () => {
      while (true) {
        const nextIndex = (currentIndex + 1) % heroTitles.length;
        const nextText = heroTitles[nextIndex];

        await erase();
        await type(nextText);

        currentIndex = nextIndex;
        currentText = nextText;

        await sleep(2000);
      }
    };

    run();
  }, []);

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
      <nav
        className="
    sticky
    top-0
    z-50
    w-full
    border-b
    border-white/50
    bg-white/65
    backdrop-blur-2xl
    supports-[backdrop-filter]:bg-white/60
    shadow-[0_1px_0_rgba(255,255,255,0.6),0_8px_30px_rgba(0,0,0,0.04)]
  "
      >
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
        className="reveal-section relative overflow-hidden px-6 py-24 lg:py-32"
      >
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Поиск на основе ИИ
            </div>

            <h1 className="mx-auto max-w-4xl min-h-[140px] text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span ref={heroRef}></span>
              <span className="typing-cursor" />
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

          {/* Dashboard mockup — продуктовый интерфейс */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-100 bg-gray-50/30 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="h-6 w-48 rounded-md bg-gray-100" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">AI Assistant</span>
                    <div className="h-5 w-5 rounded-full bg-blue-100 text-center text-xs leading-5 text-blue-600">
                      ✓
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Левая колонка — поиск и фильтры */}
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <span>🔍</span>
                          <span>Поиск поставщиков</span>
                        </div>
                        <span className="text-xs text-gray-400">Advanced</span>
                      </div>
                      <div className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400">
                        Введите материал или категорию...
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <span>📍</span>
                        <span>Регион поставки</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-24 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600">
                          Москва
                        </div>
                        <div className="h-8 w-24 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600">
                          СПБ
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <span>🤖</span>
                          <span>AI анализ</span>
                        </div>
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                          Active
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-gray-500">
                            <span>Совместимость</span>
                            <span className="font-medium text-gray-900">92%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-gray-100">
                            <div className="h-1.5 w-[92%] rounded-full bg-blue-500" />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-gray-500">
                            <span>Качество сервиса</span>
                            <span className="font-medium text-gray-900">88%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-gray-100">
                            <div className="h-1.5 w-[88%] rounded-full bg-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Правая колонка — результаты поиска */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Лучшие совпадения
                        </span>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          3 найдено
                        </span>
                      </div>
                      <div className="flex gap-1 text-xs text-gray-400">
                        <span>Рекомендовано AI</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          name: "ПаллетПром",
                          location: "Москва",
                          price: "145 ₽",
                          moq: "500 шт",
                          match: "98%",
                          verified: true,
                          fastResponse: true,
                        },
                        {
                          name: "УпакСервис",
                          location: "Санкт-Петербург",
                          price: "158 ₽",
                          moq: "300 шт",
                          match: "94%",
                          verified: true,
                          fastResponse: false,
                        },
                        {
                          name: "ЛогистикПак",
                          location: "Казань",
                          price: "139 ₽",
                          moq: "1000 шт",
                          match: "89%",
                          verified: false,
                          fastResponse: true,
                        },
                      ].map((supplier, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-gray-100 bg-white p-3 transition-all hover:border-gray-200 hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <div className="font-medium text-gray-900">
                                  {supplier.name}
                                </div>
                                {supplier.verified && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                                    <span className="text-xs">✓</span>
                                    <span>Verified</span>
                                  </span>
                                )}
                                {supplier.fastResponse && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700">
                                    <span>⚡</span>
                                    <span>Fast Response</span>
                                  </span>
                                )}
                              </div>
                              <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                                <span>{supplier.location}</span>
                                <span>MOQ: {supplier.moq}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-1 w-16 rounded-full bg-gray-100">
                                  <div
                                    className={`h-1 rounded-full ${parseInt(supplier.match) >= 95
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                                      }`}
                                    style={{ width: supplier.match }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                  AI Match {supplier.match}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-base font-semibold text-gray-900">
                                {supplier.price}
                              </div>
                              <div className="text-xs text-gray-400">за шт</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-3 text-center">
                      <span className="text-xs text-gray-500">
                        + еще 17 поставщиков по вашему запросу
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI matching статус */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span>AI matching active</span>
                    <span className="mx-1">•</span>
                    <span>Обновлён в реальном времени</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Анализ 1 247 поставщиков
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust line */}
          <div className="mx-auto mt-8 text-center">
            <p className="text-sm text-gray-400">Более 50 000 обработанных заявок</p>
          </div>
        </div>
      </section>

      {/* Разделитель */}
      <div className="border-t border-gray-100" />

      {/* Features grid */}
      <section
        data-reveal-section
        className="reveal-section bg-gray-50/30 py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              Почему Агора
            </div>
            <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Создано для современных команд закупок
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-500">
              Всё необходимое для быстрого поиска поставщиков упаковки
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
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

      {/* Разделитель */}
      <div className="border-t border-gray-100" />

      {/* Stats section */}
      <section
        data-reveal-section
        className="reveal-section py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
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

      {/* Разделитель */}
      <div className="border-t border-gray-100" />

      {/* CTA section */}
      <section
        data-reveal-section
        className="reveal-section py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-gray-50/30 p-12 text-center sm:p-16">
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                Готовы масштабировать закупки?
              </div>

              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
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

              <div className="mt-12 flex items-center justify-center gap-2 text-xs text-gray-400">
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

        <div className="mt-16 text-center">
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