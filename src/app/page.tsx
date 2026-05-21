// src/app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 no-underline">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">
            A
          </div>
          Агора
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/catalog"
            className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-700 transition-colors no-underline"
          >
            Перейти в каталог
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Более 200 поставщиков транспортной упаковки
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6 max-w-3xl mx-auto">
          Транспортная упаковка
          <span className="block text-slate-400">от проверенных поставщиков</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Агора — B2B-платформа, где вы находите поставщиков паллет, плёнки, коробов, 
          крепежа и другой упаковочной продукции. Сравнивайте цены, формируйте заявки 
          и получайте предложения напрямую.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/catalog"
            className="bg-slate-900 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 no-underline"
          >
            Смотреть каталог
          </Link>
          <Link
            href="/catalog"
            className="bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-50 transition-all no-underline"
          >
            Как это работает
          </Link>
        </div>
      </section>

      {/* Возможности */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
          Всё для закупки упаковки в одном месте
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Категории */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">
          Популярные категории
        </h2>
        <p className="text-slate-500 text-center mb-10">
          Широкий ассортимент транспортной упаковки от разных поставщиков
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog?categoryId=${cat.id}`}
              className="bg-white border border-slate-200 rounded-xl p-5 text-center hover:shadow-md hover:border-slate-300 transition-all no-underline group"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <div className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                {cat.name}
              </div>
              <div className="text-xs text-slate-400 mt-1">{cat.count} товаров</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Как это работает */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
          Как начать работу
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-8 py-16 text-center">
        <div className="bg-slate-900 rounded-2xl p-10 sm:p-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Найдите поставщика уже сегодня
          </h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Присоединяйтесь к платформе и получите доступ к проверенным поставщикам 
            транспортной упаковки со всей России.
          </p>
          <Link
            href="/catalog"
            className="inline-block bg-white text-slate-900 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-100 transition-all no-underline"
          >
            Открыть каталог
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-8 text-center text-sm text-slate-400">
          © 2026 Агора — B2B-каталог поставщиков транспортной упаковки
        </div>
      </footer>
    </div>
  );
}

// Данные для лендинга
const features = [
  {
    icon: '🔍',
    title: 'Умный поиск',
    description: 'Фильтруйте товары по категориям, цене, MOQ, региону и другим параметрам. Находите нужное за секунды.',
  },
  {
    icon: '📋',
    title: 'Заявки поставщикам',
    description: 'Формируйте заявку из товаров одного или нескольких поставщиков. Отправляйте в один клик.',
  },
  {
    icon: '✅',
    title: 'Проверенные поставщики',
    description: 'Все поставщики проходят верификацию. Вы видите рейтинг, регион и статус каждого.',
  },
];

const categories = [
  { id: 'cat1', name: 'Паллеты и поддоны', slug: 'pallets', icon: '📦', count: 48 },
  { id: 'cat2', name: 'Плёнки и stretch', slug: 'films', icon: '🎞️', count: 36 },
  { id: 'cat3', name: 'Коробки и ящики', slug: 'boxes', icon: '📋', count: 72 },
  { id: 'cat4', name: 'Пакеты и мешки', slug: 'bags', icon: '🛍️', count: 24 },
  { id: 'cat5', name: 'Защитные материалы', slug: 'protective', icon: '🛡️', count: 18 },
  { id: 'cat6', name: 'Крепёж и ленты', slug: 'fasteners', icon: '🔗', count: 50 },
];

const steps = [
  {
    title: 'Откройте каталог',
    description: 'Выберите категорию или воспользуйтесь поиском',
  },
  {
    title: 'Сравните предложения',
    description: 'Фильтруйте по цене, MOQ и региону',
  },
  {
    title: 'Добавьте в заявку',
    description: 'Соберите товары в одну заявку',
  },
  {
    title: 'Получите предложение',
    description: 'Поставщик свяжется с вами напрямую',
  },
];