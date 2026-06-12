"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const badgeMessages = [
  "Сейчас найдем вам поставщика…",
  "Может, коробочек?",
  "Подберем упаковку быстрее",
  "Запрос уже ищет отклик",
];

export default function Page() {
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [badgeIndex, setBadgeIndex] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reveal-section]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        root: container,
        threshold: 0.35,
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
    <div className='h-screen overflow-hidden bg-[#060816] text-white'>
      {/* FIXED BACKGROUND */}
      <div className='fixed inset-0 -z-10'>
        <div className='hero-glow hero-glow-1' />
        <div className='hero-glow hero-glow-2' />
        <div className='hero-grid' />
      </div>

      {/* SCROLL CONTAINER */}
      <main
        ref={scrollContainerRef}
        className='scroll-snap-container h-full overflow-y-scroll snap-y snap-mandatory'
        style={{ scrollPaddingTop: "64px" }}>
        {/* HEADER */}
        <header className='sticky top-0 z-50 border-b border-white/10 bg-[#060816]/70 backdrop-blur-xl'>
          <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-6'>
            <Link
              href='/'
              className='flex items-center gap-3 text-lg font-semibold tracking-tight no-underline'>
              <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 font-bold shadow-lg shadow-cyan-500/20'>
                A
              </div>
              <span>Агора</span>
            </Link>

            <div className='flex items-center gap-3'>
              <Link
                href='/catalog'
                className='hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/80 transition duration-300 hover:bg-white/10 md:block'>
                Каталог
              </Link>
              <Link
                href='/find-supplier'
                className='rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition duration-300 hover:scale-[1.03]'>
                Подобрать поставщика
              </Link>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section
          data-reveal-section
          className='reveal-section snap-start relative mx-auto flex h-[calc(100vh-64px)] max-w-7xl items-center overflow-hidden px-6 py-6'>
          <div className='grid w-full h-full items-center gap-6 lg:grid-cols-2 lg:gap-8'>
            {/* LEFT */}
            <div className='relative z-10 flex flex-col justify-center'>
              <div className='mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200'>
                <div className='h-2 w-2 rounded-full bg-cyan-400 animate-pulse' />
                <span
                  key={badgeIndex}
                  className='badge-rotator inline-block leading-none'>
                  {badgeMessages[badgeIndex]}
                </span>
              </div>

              <h1 className='max-w-3xl text-5xl font-black leading-[0.8] tracking-[-0.065em] sm:text-6xl lg:text-7xl'>
                Поиск поставщиков
                <span className='gradient-text block pb-4'>
                  транспортной упаковки
                </span>
              </h1>

              <p className='mt-6 max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl'>
                Современная B2B-платформа для закупки упаковки, паллет, плёнки и
                логистических материалов напрямую у производителей и
                дистрибьюторов.
              </p>

              <div className='mt-6 flex flex-wrap gap-4'>
                <Link
                  href='/catalog'
                  className='rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition duration-300 hover:scale-[1.02]'>
                  Открыть каталог
                </Link>
                <Link
                  href='/find-supplier'
                  className='rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition duration-300 hover:bg-white/10'>
                  Найти поставщика
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className='relative hidden h-full items-center justify-end lg:flex'>
              <div className='absolute top-0 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-[120px]' />
              <div className='absolute right-0 top-10 h-[260px] w-[260px] rounded-full bg-blue-500/20 blur-[100px]' />
              <div className='relative z-10 h-full w-full max-w-[470px] animate-float-smooth overflow-hidden rounded-2xl'>
                <Image
                  src='/images/packaging.jpg'
                  alt='Packaging'
                  width={900}
                  height={1200}
                  priority
                  className='h-full w-full object-cover object-center drop-shadow-[0_60px_120px_rgba(0,0,0,0.7)]'
                />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          data-reveal-section
          className='reveal-section snap-start flex min-h-screen items-center'>
          <div className='mx-auto w-full max-w-7xl px-6 py-16'>
            <div className='mb-14 text-center'>
              <div className='section-badge inline-flex'>
                Возможности платформы
              </div>
              <h2 className='mt-5 text-4xl font-bold tracking-tight sm:text-5xl'>
                Всё для современных B2B-закупок
              </h2>
            </div>

            <div className='grid gap-6 md:grid-cols-3'>
              {features.map((feature) => (
                <div key={feature.title} className='feature-card'>
                  <div className='mb-6 text-cyan-400'>{feature.icon}</div>
                  <h3 className='text-xl font-semibold'>{feature.title}</h3>
                  <p className='mt-4 leading-relaxed text-white/60'>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section
          data-reveal-section
          className='reveal-section snap-start flex min-h-screen items-center'>
          <div className='mx-auto w-full max-w-7xl px-6 py-16'>
            <div className='mb-14 flex flex-wrap items-end justify-between gap-6'>
              <div>
                <div className='section-badge'>Категории</div>

                <h2 className='mt-5 text-4xl font-bold'>
                  Популярные направления
                </h2>
              </div>

              <Link
                href='/catalog'
                className='text-sm text-cyan-300 transition hover:text-cyan-200'>
                Смотреть все →
              </Link>
            </div>

            <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6'>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/catalog?categoryId=${category.id}`}
                  className='category-card no-underline'>
                  <div className='text-5xl'>{category.icon}</div>

                  <div className='mt-5 font-medium text-white'>
                    {category.name}
                  </div>

                  <div className='mt-2 text-sm text-white/40'>
                    {category.count} товаров
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          data-reveal-section
          className='reveal-section snap-start flex h-[calc(100vh-64px)] items-center'>
          <div className='relative mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-6 py-4 sm:py-6'>
            <div className='cta-card relative isolate overflow-hidden rounded-[36px] p-4 sm:p-6 lg:p-8'>
              <div className='cta-orb cta-orb-1' />
              <div className='cta-orb cta-orb-2' />
              <div className='cta-gridline' />

              <div className='relative z-10 mx-auto max-w-3xl text-center'>
                <div className='inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/90 sm:text-sm'>
                  <div className='h-2 w-2 rounded-full bg-cyan-300 animate-pulse' />
                  Каталог, заявки и отклики в одной B2B-среде
                </div>

                <h2 className='mt-4 text-2xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-3xl lg:text-4xl'>
                  <span className='block text-white/92'>
                    Найдите поставщика
                  </span>
                  <span className='gradient-text block pb-2 leading-[1.0] sm:text-5xl lg:text-6xl'>
                    быстрее конкурентов
                  </span>
                </h2>

                <p className='mt-3 mx-auto max-w-lg text-sm leading-6 text-white/68 sm:text-base'>
                  Здесь нет фейковых метрик и псевдо-дашбордов. Только понятный
                  блок с входом в каталог, формой заявки и коротким сценарием,
                  который помогает не терять время на лишние действия.
                </p>

                <div className='mt-5 flex flex-wrap justify-center gap-3'>
                  <Link
                    href='/catalog'
                    className='cta-btn-primary rounded-2xl px-5 py-2.5 text-sm font-semibold transition-transform sm:text-base'>
                    Смотреть каталог
                  </Link>

                  <Link
                    href='/find-supplier'
                    className='cta-btn-ghost rounded-2xl px-5 py-2.5 text-sm font-semibold sm:text-base'>
                    Создать заявку
                  </Link>
                </div>

                <div className='mt-4 grid grid-cols-3 gap-2 text-left sm:mt-5 sm:gap-3'>
                  <div className='rounded-2xl border border-white/8 bg-white/5 px-2.5 py-2.5 text-center backdrop-blur-sm sm:px-3 sm:py-3 sm:text-left'>
                    <div className='text-[10px] text-white/38 sm:text-sm'>
                      1. Поиск
                    </div>
                    <div className='mt-1 text-[11px] font-semibold leading-tight sm:text-base'>
                      Подбираем подходящие товары
                    </div>
                  </div>
                  <div className='rounded-2xl border border-white/8 bg-white/5 px-2.5 py-2.5 text-center backdrop-blur-sm sm:px-3 sm:py-3 sm:text-left'>
                    <div className='text-[10px] text-white/38 sm:text-sm'>
                      2. Заявка
                    </div>
                    <div className='mt-1 text-[11px] font-semibold leading-tight sm:text-base'>
                      Отправляете запрос поставщикам
                    </div>
                  </div>
                  <div className='rounded-2xl border border-white/8 bg-white/5 px-2.5 py-2.5 text-center backdrop-blur-sm sm:px-3 sm:py-3 sm:text-left'>
                    <div className='text-[10px] text-white/38 sm:text-sm'>
                      3. Сравнение
                    </div>
                    <div className='mt-1 text-[11px] font-semibold leading-tight sm:text-base'>
                      Сравниваете отклики и условия
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center text-sm text-white/30">
              <span>© 2026 Агора</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const features = [
  {
    icon: <SearchIcon size={36} strokeWidth={1.5} />,
    title: "Умный поиск",
    description:
      "Быстро находите поставщиков по категориям, региону, MOQ и условиям поставки.",
  },
  {
    icon: <PackageIcon size={36} strokeWidth={1.5} />,
    title: "Единая заявка",
    description:
      "Собирайте товары от разных поставщиков и отправляйте запросы в пару кликов.",
  },
  {
    icon: <ZapIcon size={36} strokeWidth={1.5} />,
    title: "Быстрые ответы",
    description:
      "Получайте предложения напрямую от производителей и дистрибьюторов.",
  },
];

const categories = [
  { id: "cat1", name: "Паллеты", slug: "pallets", icon: "📦", count: 48 },
  { id: "cat2", name: "Плёнка", slug: "films", icon: "🎞️", count: 36 },
  { id: "cat3", name: "Короба", slug: "boxes", icon: "📋", count: 72 },
  { id: "cat4", name: "Мешки", slug: "bags", icon: "🛍️", count: 24 },
  { id: "cat5", name: "Защита", slug: "protective", icon: "🛡️", count: 18 },
  { id: "cat6", name: "Крепёж", slug: "fasteners", icon: "🔗", count: 50 },
];

type IconProps = {
  size?: number;
  strokeWidth?: number;
};

function SearchIcon({ size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={strokeWidth}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'>
      <circle cx='11' cy='11' r='8' />
      <path d='m21 21-4.3-4.3' />
    </svg>
  );
}

function PackageIcon({ size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={strokeWidth}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'>
      <path d='M16.5 9.4 7.5 4.2' />
      <path d='M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z' />
      <path d='M3.3 7 12 12l8.7-5' />
      <path d='M12 22V12' />
    </svg>
  );
}

function ZapIcon({ size = 24, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={strokeWidth}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'>
      <path d='M13 2 3 14h7l-1 8 10-12h-7l1-8Z' />
    </svg>
  );
}
