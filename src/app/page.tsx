"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const badgeMessages = [
  "Сканируем рынок...",
  "Подбираем лучших поставщиков",
  "Готовим персоналтные предложения",
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
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
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
    <div className="relative min-h-screen bg-transparent text-white overflow-x-hidden">
      {/* Enhanced glass navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-lg font-semibold tracking-tight no-underline text-white transition-all hover:opacity-80"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/30 transition-all group-hover:scale-105 group-hover:shadow-blue-500/50">
              <span className="font-bold text-white">A</span>
            </div>
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text font-medium tracking-tight text-transparent">
              Agora
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/catalog"
              className="hidden rounded-full px-5 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:text-white md:block"
            >
              Catalog
            </Link>
            <Link
              href="/find-supplier"
              className="group relative overflow-hidden rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 border border-white/20"
            >
              <span className="relative z-10">Find supplier →</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section - no snap */}
      <section
        data-reveal-section
        className="reveal-section relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-32 pb-20 lg:px-8"
      >
        {/* Enhanced floating orbs with more blur */}
        <div className="hero-glow hero-glow-1 animate-float-smooth opacity-70" />
        <div className="hero-glow hero-glow-2 animate-float-smooth opacity-70" style={{ animationDelay: "2s" }} />
        <div className="hero-glow absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[100px]" />

        <div className="relative z-10 grid w-full gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Left content */}
          <div className="flex flex-col justify-center">
            <div className="glass-card-enhanced mb-6 w-fit animate-pulse">
              <div className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              AI-powered matching
            </div>

            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Find packaging
              <span className="gradient-text-enhanced mt-2 block">
                suppliers instantly
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-300 sm:text-lg">
              B2B platform connecting you with verified manufacturers of
              pallets, stretch film, boxes, and logistics materials.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="btn-primary-enhanced rounded-full px-6 py-3 text-sm font-semibold"
              >
                Start exploring →
              </Link>
              <Link
                href="/find-supplier"
                className="btn-ghost-enhanced rounded-full px-6 py-3 text-sm font-semibold transition-all"
              >
                Watch demo
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>500+ suppliers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>10k+ products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>Free to use</span>
              </div>
            </div>
          </div>

          {/* Right - Enhanced glass image card */}
          <div className="relative hidden h-full items-center justify-end lg:flex">
            <div className="glass-card-premium relative w-full max-w-md overflow-hidden rounded-3xl p-1.5 shadow-2xl">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/packaging.jpg"
                  alt="Warehouse packaging"
                  width={800}
                  height={1067}
                  priority
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="absolute bottom-4 left-4 glass-card-dark rounded-xl px-4 py-2 text-xs font-mono text-cyan-300 backdrop-blur-xl">
                🏭 500+ verified partners
              </div>
              <div className="absolute top-4 right-4 glass-card-dark rounded-xl px-3 py-1.5 text-xs font-mono">
                ⚡ Live
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section
        data-reveal-section
        className="reveal-section relative mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="hero-grid opacity-30" />

        <div className="mb-16 text-center">
          <div className="glass-card-dark mx-auto w-fit px-5 py-2">Why choose Agora</div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Built for modern
            <span className="gradient-text-enhanced ml-2">procurement teams</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Everything you need to source packaging materials faster
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="glass-card-premium group cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500/20 group-hover:to-cyan-500/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-mono text-cyan-400 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                <span>Learn more</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats section */}
      <section
        data-reveal-section
        className="reveal-section relative mx-auto max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { value: "99.9%", label: "Uptime SLA", icon: "⚡", desc: "Enterprise-grade reliability" },
            { value: "< 2h", label: "Avg. response time", icon: "🚀", desc: "From suppliers" },
            { value: "50k+", label: "RFQs processed", icon: "📦", desc: "And counting" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card-premium text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <div className="mb-3 text-4xl">{stat.icon}</div>
              <div className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-semibold text-white/90">{stat.label}</div>
              <div className="mt-1 text-xs text-gray-400">{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section
        data-reveal-section
        className="reveal-section relative mx-auto max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="glass-card-dark w-fit px-5 py-2">Categories</div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Browse by product
            </h2>
          </div>
          <Link
            href="/catalog"
            className="group flex items-center gap-2 text-sm font-medium text-gray-300 transition-all hover:text-white"
          >
            <span>View all</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/catalog?categoryId=${category.id}`}
              className="glass-card group text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-3 text-4xl transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-400">
                {category.icon}
              </div>
              <div className="text-sm font-medium text-white/90">
                {category.name}
              </div>
              <div className="mt-1 text-xs text-gray-400">
                {category.count} items
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        data-reveal-section
        className="reveal-section relative mx-auto max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="cta-card-enhanced relative overflow-hidden rounded-3xl p-10 shadow-2xl sm:p-14">
          <div className="cta-orb-enhanced cta-orb-1-enhanced" />
          <div className="cta-orb-enhanced cta-orb-2-enhanced" />
          <div className="cta-gridline-enhanced" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="glass-card-dark mx-auto w-fit border border-cyan-500/30 text-cyan-300">
              🎯 Ready to scale your procurement?
            </div>

            <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Start sourcing in
              <span className="gradient-text-enhanced block">under 5 minutes</span>
            </h2>

            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-gray-300">
              Join 500+ companies already finding reliable packaging suppliers
              through Agora.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/catalog"
                className="btn-primary-enhanced rounded-full px-8 py-3.5 text-sm font-semibold"
              >
                Get started free →
              </Link>
              <Link
                href="/find-supplier"
                className="btn-ghost-enhanced rounded-full px-8 py-3.5 text-sm font-semibold"
              >
                Contact sales
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-3 text-xs text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white/20 bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg"
                  />
                ))}
              </div>
              <span>Trusted by procurement teams worldwide</span>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <span className="text-xs text-gray-500">© 2025 Agora. All rights reserved.</span>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: "🔍",
    title: "Smart matching",
    description:
      "AI-powered algorithm connects you with the right suppliers based on MOQ, location, and pricing.",
  },
  {
    icon: "📋",
    title: "Unified RFQ",
    description:
      "Create single requests that reach multiple suppliers. Compare offers side by side.",
  },
  {
    icon: "⚡",
    title: "Lightning responses",
    description:
      "Get quotes from manufacturers within hours, not days. Average response < 2 hours.",
  },
];

const categories = [
  { id: "cat1", name: "Pallets", slug: "pallets", icon: "📦", count: 148 },
  { id: "cat2", name: "Stretch Film", slug: "films", icon: "🎞️", count: 96 },
  { id: "cat3", name: "Corrugated", slug: "boxes", icon: "📋", count: 212 },
  { id: "cat4", name: "Bags", slug: "bags", icon: "🛍️", count: 84 },
  { id: "cat5", name: "Protection", slug: "protective", icon: "🛡️", count: 67 },
  { id: "cat6", name: "Strapping", slug: "fasteners", icon: "🔗", count: 53 },
];