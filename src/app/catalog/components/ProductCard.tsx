'use client';

import { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  inRequest: boolean;
  onAddToRequest: (product: Product) => void;
}

export function ProductCard({
  product,
  inRequest,
  onAddToRequest,
}: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.06]">

      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
        <Image
          src={product.image || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-white">
              {product.name}
            </div>

            <div className="mt-1 text-sm text-white/40">
              SKU: {product.sku}
            </div>
          </div>

          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
            MOQ {product.moq}
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-white/50">
          {product.description}
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-white">
              {product.price} ₽
            </div>

            <div className="mt-1 text-sm text-white/40">
              за {product.unit}
            </div>
          </div>

          <button
            onClick={() => onAddToRequest(product)}
            className={`
              rounded-2xl
              px-5
              py-3
              text-sm
              font-medium
              transition
              duration-300
              ${inRequest
                ? 'bg-cyan-400 text-black'
                : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
              }
            `}
          >
            {inRequest ? 'Добавлено' : 'В заявку'}
          </button>
        </div>
      </div>
    </div>
  );
}