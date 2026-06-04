'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Package, Zap } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Page() {
  const shouldReduce = useReducedMotion();

  function fadeUp(delay = 0) {
    if (shouldReduce) return {};
    return {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-60px' },
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], delay },
    };
  }

  return (
    <div className="h-screen overflow-hidden bg-[#060816] text-white">
      {/* FIXED BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-grid" />
      </div>

      {/* SCROLL CONTAINER */}
      <main
        className="scroll-snap-container h-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollPaddingTop: '64px' }}
      >
        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060816]/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link
              href="/"
              className="flex items-center gap-3 text-lg font-semibold tracking-tight no-underline"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 font-bold shadow-lg shadow-cyan-500/20">
                A
              </div>
              <span>Агора</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/catalog"
                className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/80 transition duration-300 hover:bg-white/10 md:block"
              >
                Каталог
              </Link>
              <Link
                href="/find-supplier"
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition duration-300 hover:scale-[1.03]"
              >
                Подобрать поставщика
              </Link>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="snap-start relative mx-auto flex h-[calc(100vh-64px)] max-w-7xl items-center overflow-hidden px-6 py-6">
          <div className="grid w-full h-full items-center gap-6 lg:grid-cols-2 lg:gap-8">

            {/* LEFT */}
            <div className="relative z-10 flex flex-col justify-center">
              <motion.div
                className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200"
                {...fadeUp(0)}
              >
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                200+ проверенных поставщиков
              </motion.div>

              <motion.h1
                className="max-w-3xl text-5xl font-black leading-[0.8] tracking-[-0.065em] sm:text-6xl lg:text-7xl"
                {...fadeUp(0.1)}
              >
                Поиск поставщиков
                <span className="gradient-text block pb-4">
                  транспортной упаковки
                </span>
              </motion.h1>

              <motion.p
                className="mt-6 max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl"
                {...fadeUp(0.2)}
              >
                Современная B2B-платформа для закупки упаковки,
                паллет, плёнки и логистических материалов напрямую
                у производителей и дистрибьюторов.
              </motion.p>

              <motion.div
                className="mt-6 flex flex-wrap gap-4"
                {...fadeUp(0.3)}
              >
                <Link
                  href="/catalog"
                  className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition duration-300 hover:scale-[1.02]"
                >
                  Открыть каталог
                </Link>
                <Link
                  href="/find-supplier"
                  className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition duration-300 hover:bg-white/10"
                >
                  Найти поставщика
                </Link>
              </motion.div>
            </div>

            {/* RIGHT */}
            <div className="relative hidden h-full items-center justify-end lg:flex">
              <div className="absolute top-0 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-[120px]" />
              <div className="absolute right-0 top-10 h-[260px] w-[260px] rounded-full bg-blue-500/20 blur-[100px]" />
              <motion.div
                className="relative z-10 h-full w-full max-w-[470px] animate-float-smooth overflow-hidden rounded-2xl"
                {...fadeUp(0.15)}
              >
                <Image
                  src="/images/packaging.jpg"
                  alt="Packaging"
                  width={900}
                  height={1200}
                  priority
                  className="h-full w-full object-cover object-center drop-shadow-[0_60px_120px_rgba(0,0,0,0.7)]"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="snap-start flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-16">
            <motion.div className="mb-14 text-center" {...fadeUp(0)}>
              <div className="section-badge inline-flex">
                Возможности платформы
              </div>
              <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                Всё для современных B2B-закупок
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="feature-card"
                  {...fadeUp(i * 0.1)}
                >
                  <div className="mb-6 text-cyan-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-white/60">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="snap-start flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-5xl px-6 py-16">
            <motion.div
              className="cta-card overflow-hidden rounded-[40px] p-10 sm:p-16"
              {...fadeUp(0)}
            >
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <motion.h2
                  className="text-4xl font-black leading-tight sm:text-5xl"
                  {...fadeUp(0.1)}
                >
                  Найдите поставщика
                  быстрее конкурентов
                </motion.h2>

                <motion.p
                  className="mt-6 text-lg leading-relaxed text-white/70"
                  {...fadeUp(0.2)}
                >
                  Сравнивайте предложения, отправляйте заявки и
                  работайте напрямую с производителями упаковки.
                </motion.p>

                <motion.div
                  className="mt-10 flex flex-wrap justify-center gap-4"
                  {...fadeUp(0.3)}
                >
                  <Link
                    href="/catalog"
                    className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-[1.02]"
                  >
                    Перейти в каталог
                  </Link>
                  <Link
                    href="/find-supplier"
                    className="rounded-2xl border border-white/15 bg-white/10 px-8 py-4 font-semibold text-white transition hover:bg-white/15"
                  >
                    Оставить заявку
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="mt-8 flex justify-center gap-6 text-sm text-white/30"
              {...fadeUp(0.4)}
            >
              <span>© 2026 Агора</span>
              <span>B2B-платформа транспортной упаковки</span>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

const features = [
  {
    icon: <Search size={36} strokeWidth={1.5} />,
    title: 'Умный поиск',
    description:
      'Быстро находите поставщиков по категориям, региону, MOQ и условиям поставки.',
  },
  {
    icon: <Package size={36} strokeWidth={1.5} />,
    title: 'Единая заявка',
    description:
      'Собирайте товары от разных поставщиков и отправляйте запросы в пару кликов.',
  },
  {
    icon: <Zap size={36} strokeWidth={1.5} />,
    title: 'Быстрые ответы',
    description:
      'Получайте предложения напрямую от производителей и дистрибьюторов.',
  },
];
